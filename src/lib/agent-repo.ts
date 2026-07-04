import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { db } from "@/db/client";
import { agentMemberships, feedbacks, projects, user } from "@/db/schema";
import { toAgentMembershipRow, toProjectRow } from "@/db/map";
import { generateId } from "./ids";
import { createInviteToken, consumeInviteToken } from "./otp";
import { sendAgentInviteEmail } from "./email";
import { parseSettings } from "./repo";
import type { AgentMembershipRow, AgentMembershipStatus, ProjectRow } from "./types";

/** Project ids the user can access: owned outright, or an active agent membership on. */
export function accessibleProjectIds(userId: string) {
  return db
    .select({ id: projects.id })
    .from(projects)
    .where(eq(projects.userId, userId))
    .union(
      db
        .select({ id: agentMemberships.projectId })
        .from(agentMemberships)
        .where(and(eq(agentMemberships.userId, userId), eq(agentMemberships.status, "active"))),
    );
}

/** Owned ∪ active-agent projects, for nav surfaces (sidebar, widget switcher). */
export async function listAccessibleProjects(userId: string): Promise<ProjectRow[]> {
  const rows = await db
    .select()
    .from(projects)
    .where(inArray(projects.id, accessibleProjectIds(userId)))
    .orderBy(desc(projects.createdAt));
  return rows.map(toProjectRow);
}

async function getOwnedProjectForAgents(userId: string, projectId: string): Promise<ProjectRow | undefined> {
  const [r] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
    .limit(1);
  return r ? toProjectRow(r) : undefined;
}

/** Owned or agent-accessible project lookup — used by pages/routes that agents may also load (e.g. the inbox's `?w=` filter). */
export async function getAccessibleProject(userId: string, projectId: string): Promise<ProjectRow | undefined> {
  const [r] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), inArray(projects.id, accessibleProjectIds(userId))))
    .limit(1);
  return r ? toProjectRow(r) : undefined;
}

// --- Owner-side membership management ---

export async function listAgentMemberships(ownerId: string, projectId: string): Promise<AgentMembershipRow[]> {
  const project = await getOwnedProjectForAgents(ownerId, projectId);
  if (!project) return [];
  const rows = await db
    .select()
    .from(agentMemberships)
    .where(eq(agentMemberships.projectId, projectId))
    .orderBy(agentMemberships.createdAt);
  return rows.map(toAgentMembershipRow);
}

export async function inviteAgent(
  ownerId: string,
  projectId: string,
  email: string,
  categories: string[] | null,
): Promise<AgentMembershipRow | null> {
  const project = await getOwnedProjectForAgents(ownerId, projectId);
  if (!project) return null;
  const normalizedEmail = email.trim().toLowerCase();

  const [existing] = await db
    .select()
    .from(agentMemberships)
    .where(and(eq(agentMemberships.projectId, projectId), eq(agentMemberships.email, normalizedEmail)))
    .limit(1);

  const now = Date.now();
  let membershipId: string;
  if (existing) {
    membershipId = existing.id;
    await db
      .update(agentMemberships)
      .set({ status: "invited", categories, invitedBy: ownerId, invitedAt: now, updatedAt: now, acceptedAt: null })
      .where(eq(agentMemberships.id, membershipId));
  } else {
    membershipId = generateId();
    await db.insert(agentMemberships).values({
      id: membershipId,
      projectId,
      email: normalizedEmail,
      status: "invited",
      categories,
      invitedBy: ownerId,
      invitedAt: now,
      createdAt: now,
      updatedAt: now,
    });
  }

  await sendInviteEmail(ownerId, project, membershipId, normalizedEmail, categories);

  const [row] = await db.select().from(agentMemberships).where(eq(agentMemberships.id, membershipId)).limit(1);
  return row ? toAgentMembershipRow(row) : null;
}

async function sendInviteEmail(
  ownerId: string,
  project: ProjectRow,
  membershipId: string,
  email: string,
  categories: string[] | null,
): Promise<void> {
  const [owner] = await db.select({ name: user.name }).from(user).where(eq(user.id, ownerId)).limit(1);
  const token = await createInviteToken(membershipId);
  const settings = parseSettings(project);
  await sendAgentInviteEmail(email, token, project.name, owner?.name ?? project.name, categories, {
    accent: settings.accentColor,
    logo: settings.logoUrl,
  });
}

export async function resendAgentInvite(ownerId: string, projectId: string, membershipId: string): Promise<boolean> {
  const project = await getOwnedProjectForAgents(ownerId, projectId);
  if (!project) return false;
  const [membership] = await db
    .select()
    .from(agentMemberships)
    .where(and(eq(agentMemberships.id, membershipId), eq(agentMemberships.projectId, projectId)))
    .limit(1);
  if (!membership || membership.status === "revoked") return false;

  await sendInviteEmail(ownerId, project, membershipId, membership.email, membership.categories ?? null);
  return true;
}

export async function updateAgentCategories(
  ownerId: string,
  projectId: string,
  membershipId: string,
  categories: string[] | null,
): Promise<boolean> {
  const project = await getOwnedProjectForAgents(ownerId, projectId);
  if (!project) return false;
  await db
    .update(agentMemberships)
    .set({ categories, updatedAt: Date.now() })
    .where(and(eq(agentMemberships.id, membershipId), eq(agentMemberships.projectId, projectId)));
  return true;
}

export async function revokeAgentMembership(ownerId: string, projectId: string, membershipId: string): Promise<boolean> {
  const project = await getOwnedProjectForAgents(ownerId, projectId);
  if (!project) return false;
  await db
    .update(agentMemberships)
    .set({ status: "revoked" as AgentMembershipStatus, updatedAt: Date.now() })
    .where(and(eq(agentMemberships.id, membershipId), eq(agentMemberships.projectId, projectId)));
  return true;
}

export async function deleteAgentMembership(ownerId: string, projectId: string, membershipId: string): Promise<boolean> {
  const project = await getOwnedProjectForAgents(ownerId, projectId);
  if (!project) return false;
  await db
    .delete(agentMemberships)
    .where(and(eq(agentMemberships.id, membershipId), eq(agentMemberships.projectId, projectId)));
  return true;
}

// --- Invite acceptance (invitee side) ---

export interface InvitePreview {
  projectId: string;
  projectName: string;
  email: string;
  categories: string[] | null;
  inviterName: string;
  status: AgentMembershipStatus;
}

export async function previewAgentInvite(token: string): Promise<InvitePreview | null> {
  const membershipId = await consumeInviteToken(token, { peek: true });
  if (!membershipId) return null;
  const [row] = await db
    .select({ membership: agentMemberships, projectName: projects.name, inviterName: user.name })
    .from(agentMemberships)
    .innerJoin(projects, eq(projects.id, agentMemberships.projectId))
    .innerJoin(user, eq(user.id, agentMemberships.invitedBy))
    .where(eq(agentMemberships.id, membershipId))
    .limit(1);
  if (!row) return null;
  return {
    projectId: row.membership.projectId,
    projectName: row.projectName,
    email: row.membership.email,
    categories: row.membership.categories ?? null,
    inviterName: row.inviterName,
    status: row.membership.status,
  };
}

export async function acceptAgentInvite(
  sessionUser: { id: string; email: string },
  token: string,
): Promise<{ ok: true; projectId: string } | { ok: false; error: "invalid" | "email_mismatch" }> {
  const membershipId = await consumeInviteToken(token, { peek: true });
  if (!membershipId) return { ok: false, error: "invalid" };
  const [membership] = await db.select().from(agentMemberships).where(eq(agentMemberships.id, membershipId)).limit(1);
  if (!membership || membership.status === "revoked") return { ok: false, error: "invalid" };
  if (membership.email.toLowerCase() !== sessionUser.email.toLowerCase()) {
    return { ok: false, error: "email_mismatch" };
  }

  const now = Date.now();
  await db
    .update(agentMemberships)
    .set({ status: "active", userId: sessionUser.id, acceptedAt: now, updatedAt: now })
    .where(eq(agentMemberships.id, membershipId));
  // Only burn the token once the invite has actually been consumed successfully.
  await consumeInviteToken(token);
  return { ok: true, projectId: membership.projectId };
}

// --- Assignment ---

export interface ActiveAgent {
  user_id: string;
  name: string;
  email: string;
  categories: string[] | null;
}

export async function listActiveAgents(projectId: string): Promise<ActiveAgent[]> {
  const rows = await db
    .select({
      userId: agentMemberships.userId,
      categories: agentMemberships.categories,
      name: user.name,
      email: user.email,
    })
    .from(agentMemberships)
    .innerJoin(user, eq(user.id, agentMemberships.userId))
    .where(and(eq(agentMemberships.projectId, projectId), eq(agentMemberships.status, "active")))
    .orderBy(agentMemberships.acceptedAt);
  return rows.map((r) => ({ user_id: r.userId as string, name: r.name, email: r.email, categories: r.categories ?? null }));
}

export async function findCategoryAgent(projectId: string, category: string): Promise<string | null> {
  const agents = await listActiveAgents(projectId);
  return agents.find((a) => a.categories?.includes(category))?.user_id ?? null;
}

/** Everyone with a live stake in a project's inbox — the owner plus its active agents. */
export async function listProjectWatcherIds(projectId: string): Promise<string[]> {
  const [[ownerRow], agents] = await Promise.all([
    db.select({ id: projects.userId }).from(projects).where(eq(projects.id, projectId)).limit(1),
    listActiveAgents(projectId),
  ]);
  const ids = agents.map((a) => a.user_id);
  if (ownerRow?.id) ids.push(ownerRow.id);
  return Array.from(new Set(ids));
}

export async function claimFeedbackIfUnassigned(userId: string, feedbackId: string): Promise<boolean> {
  const result = await db
    .update(feedbacks)
    .set({ assignedTo: userId, assignedAt: Date.now(), assignmentSource: "claimed" })
    .where(
      and(
        eq(feedbacks.id, feedbackId),
        isNull(feedbacks.assignedTo),
        inArray(feedbacks.projectId, accessibleProjectIds(userId)),
      ),
    )
    .returning({ id: feedbacks.id });
  return result.length > 0;
}

/** Owner-only manual handoff. `newAssigneeUserId` must be the owner or an active agent on the project. */
export async function reassignFeedback(
  ownerId: string,
  feedbackId: string,
  newAssigneeUserId: string | null,
): Promise<boolean> {
  const [fb] = await db
    .select({ projectId: feedbacks.projectId })
    .from(feedbacks)
    .innerJoin(projects, eq(projects.id, feedbacks.projectId))
    .where(and(eq(feedbacks.id, feedbackId), eq(projects.userId, ownerId)))
    .limit(1);
  if (!fb) return false;

  if (newAssigneeUserId && newAssigneeUserId !== ownerId) {
    const [agent] = await db
      .select({ id: agentMemberships.id })
      .from(agentMemberships)
      .where(
        and(
          eq(agentMemberships.projectId, fb.projectId),
          eq(agentMemberships.userId, newAssigneeUserId),
          eq(agentMemberships.status, "active"),
        ),
      )
      .limit(1);
    if (!agent) return false;
  }

  await db
    .update(feedbacks)
    .set({
      assignedTo: newAssigneeUserId,
      assignedAt: newAssigneeUserId ? Date.now() : null,
      assignmentSource: newAssigneeUserId ? "manual" : null,
    })
    .where(eq(feedbacks.id, feedbackId));
  return true;
}

/** Auto-assigns a freshly created feedback if its category matches an active agent's scope. Returns the agent's user id, if any. */
export async function maybeAutoAssignOnCreate(
  projectId: string,
  feedbackId: string,
  category: string,
): Promise<string | null> {
  const agentId = await findCategoryAgent(projectId, category);
  if (!agentId) return null;
  await db
    .update(feedbacks)
    .set({ assignedTo: agentId, assignedAt: Date.now(), assignmentSource: "category_auto" })
    .where(eq(feedbacks.id, feedbackId));
  return agentId;
}
