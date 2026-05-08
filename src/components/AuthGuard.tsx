import { ReactNode, useEffect } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useSession } from "@/lib/auth";

const PUBLIC = new Set(["/login"]);

export function AuthGuard({ children }: { children: ReactNode }) {
  const session = useSession();
  const nav = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPublic = PUBLIC.has(pathname);

  useEffect(() => {
    if (!session && !isPublic) nav({ to: "/login" });
  }, [session, isPublic, pathname, nav]);

  if (!session && !isPublic) return null;
  return <>{children}</>;
}
