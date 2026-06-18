import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kanews Feedback",
  description: "Kanthemes geri bildirim yönetim paneli",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
