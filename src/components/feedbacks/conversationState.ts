import type { FeedbackWithMeta } from "@/lib/admin-repo";
import type { Tone } from "@/components/ui/Badge";

/** Conversation-net state shown on inbox rows (independent of triage status). */
export type ConversationState =
  | "unanswered"
  | "awaiting_reply"
  | "replied"
  | "agent_replied"
  | "closed";

export function getConversationState(f: FeedbackWithMeta): ConversationState {
  if (f.status === "resolved" || f.status === "wontfix") return "closed";
  // Initial visitor message only — nobody from the team has replied yet.
  if (f.reply_count === 0) return "unanswered";
  // Visitor spoke last (or has unreplied user messages after the last admin reply).
  if (f.has_new_user_reply || f.last_message_author === "user") return "awaiting_reply";
  // Team replied last; distinguish assigned agent vs unassigned/owner reply.
  if (f.assigned_to) return "agent_replied";
  return "replied";
}

export const CONVERSATION_TONE: Record<ConversationState, Tone> = {
  unanswered: "danger",
  awaiting_reply: "warning",
  replied: "info",
  agent_replied: "violet",
  closed: "neutral",
};

export const CONVERSATION_LABEL_KEY: Record<ConversationState, string> = {
  unanswered: "convUnanswered",
  awaiting_reply: "convAwaiting",
  replied: "convReplied",
  agent_replied: "convAgentReplied",
  closed: "convClosed",
};
