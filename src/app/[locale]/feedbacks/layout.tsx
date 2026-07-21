import type { Metadata } from "next";

/** Auth-walled panel routes — keep out of the index. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PanelSegmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
