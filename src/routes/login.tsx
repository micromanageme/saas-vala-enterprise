import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Lock, Mail, ShieldCheck, KeyRound, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { login } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In — SaaS Vala" }, { name: "description", content: "Super Admin master login" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      login(email, pw);
      toast.success("Welcome, Super Admin");
      nav({ to: "/super-admin" });
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen grid place-items-center px-4 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.32_0.12_295/0.35),transparent_60%),radial-gradient(ellipse_at_bottom,oklch(0.3_0.12_200/0.25),transparent_60%)]" />
      <Card className="w-full max-w-md gradient-card border-border/60 shadow-elegant">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-primary shadow-glow mb-3">
              <Sparkles className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">SaaS Vala</h1>
            <p className="text-xs text-muted-foreground mt-1">Enterprise Master Control · Sign in to continue</p>
            <div className="mt-3 flex gap-1.5">
              <Badge variant="outline" className="text-[10px] border-primary/40 text-primary"><ShieldCheck className="h-3 w-3 mr-1" />2FA Ready</Badge>
              <Badge variant="outline" className="text-[10px] border-primary/40 text-primary"><Lock className="h-3 w-3 mr-1" />RBAC</Badge>
              <Badge variant="outline" className="text-[10px] border-primary/40 text-primary"><KeyRound className="h-3 w-3 mr-1" />Audit</Badge>
            </div>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-3">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="superadmin@saasvala.com" className="pl-9 h-10 bg-input/50" autoComplete="email" required />
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={pw} onChange={(e) => setPw(e.target.value)} type={show ? "text" : "password"} placeholder="Master password" className="pl-9 pr-10 h-10 bg-input/50" autoComplete="current-password" required />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="toggle">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button type="submit" disabled={busy} className="w-full gradient-primary text-primary-foreground border-0 shadow-glow h-10">
              {busy ? "Signing in…" : "Sign in to Master Control"}
            </Button>
          </form>

          <p className="mt-5 text-[10px] text-center text-muted-foreground leading-relaxed">
            Protected by enterprise-grade security · session tracking · device binding · audit logging.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
