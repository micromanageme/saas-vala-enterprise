import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const s = typeof window !== "undefined" ? getSession() : null;
    if (!s) throw redirect({ to: "/login" });
    throw redirect({ to: s.baseRole === "SUPER_ADMIN" ? "/super-admin" : "/dashboard" });
  },
});
