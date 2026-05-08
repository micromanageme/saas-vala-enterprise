import { ShieldCheck, Check, Crown, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLES, useSession, impersonate, stopImpersonation, isSuperAdmin } from "@/lib/auth";
import { toast } from "sonner";

export function RoleSwitcher() {
  const session = useSession();
  if (!session) return null;
  const isSA = isSuperAdmin(session);
  const active = ROLES.find((r) => r.id === session.role);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-xs h-8">
          <div className="grid h-5 w-5 place-items-center rounded gradient-primary">
            {isSA && session.role === "SUPER_ADMIN" ? <Crown className="h-3 w-3 text-primary-foreground" /> : <ShieldCheck className="h-3 w-3 text-primary-foreground" />}
          </div>
          <span className="hidden sm:inline">{active?.label ?? session.role}</span>
          {session.impersonating && (
            <Badge variant="outline" className="ml-1 text-[9px] border-warning/60 text-warning">Impersonating</Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72 glass max-h-[60vh] overflow-y-auto">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Role</span>
          {isSA && <Badge className="text-[9px] gradient-primary text-primary-foreground border-0">SUPER ADMIN</Badge>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!isSA && (
          <div className="px-2 py-2 text-[11px] text-muted-foreground">Only Super Admin can switch roles.</div>
        )}
        {isSA && session.impersonating && (
          <>
            <DropdownMenuItem onClick={() => { stopImpersonation(); toast.success("Returned to Super Admin"); }}>
              <UserCog className="h-4 w-4 mr-2" />Stop impersonation
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {ROLES.map((r) => {
          const allowed = isSA;
          return (
            <DropdownMenuItem
              key={r.id}
              disabled={!allowed}
              onClick={() => {
                if (!allowed) return;
                impersonate(r.id);
                toast.success(r.id === "SUPER_ADMIN" ? "Active role: Super Admin" : `Impersonating ${r.label}`);
              }}
              className="flex items-center gap-2"
            >
              <div className="grid h-6 w-6 place-items-center rounded gradient-primary opacity-80">
                {r.id === "SUPER_ADMIN" ? <Crown className="h-3 w-3 text-primary-foreground" /> : <ShieldCheck className="h-3 w-3 text-primary-foreground" />}
              </div>
              <span className="flex-1 text-sm">{r.label}</span>
              {session.role === r.id && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
