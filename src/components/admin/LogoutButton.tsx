"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      className="admin-btn admin-btn-secondary"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
    >
      Sign out
    </button>
  );
}
