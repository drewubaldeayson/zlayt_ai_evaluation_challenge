"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Very simple check for MVP
    const token = localStorage.getItem("admin_token");
    if (!token && window.location.pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [router]);

  return <>{children}</>;
}
