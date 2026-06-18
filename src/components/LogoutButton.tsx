"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors"
    >
      Çıkış yap
    </button>
  );
}
