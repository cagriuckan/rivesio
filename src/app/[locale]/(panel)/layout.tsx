import Shell from "@/components/layout/Shell";
import { getSessionUser } from "@/lib/auth";

/**
 * Shared chrome for authenticated panel routes. Guest visitors of `/` (landing)
 * pass through without Shell so marketing stays Shell-free; Soft nav between
 * Overview / Feedbacks / Sites / … keeps ShellClient mounted.
 */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) return children;
  return <Shell>{children}</Shell>;
}
