import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — SaaS Vala" }] }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/crm" });
    });
  }, [nav]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    nav({ to: "/crm" });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password: pw,
      options: {
        emailRedirectTo: `${window.location.origin}/crm`,
        data: { full_name: name },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — check your email if confirmation is required");
    nav({ to: "/crm" });
  };

  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/crm",
    });
    if (result.error) {
      setBusy(false);
      toast.error(result.error.message || "Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    nav({ to: "/crm" });
  };

  return (
    <div className="relative min-h-screen grid place-items-center px-4 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.32_0.12_295/0.35),transparent_60%),radial-gradient(ellipse_at_bottom,oklch(0.3_0.12_200/0.25),transparent_60%)]" />
      <Card className="w-full max-w-md gradient-card border-border/60 shadow-elegant">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-primary shadow-glow mb-3">
              <Sparkles className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">SaaS Vala Nexus</h1>
            <p className="text-xs text-muted-foreground mt-1">Enterprise Operating System</p>
          </div>

          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="mt-4 space-y-3">
                <EmailField email={email} setEmail={setEmail} />
                <PasswordField pw={pw} setPw={setPw} show={show} setShow={setShow} />
                <Button type="submit" disabled={busy} className="w-full gradient-primary text-primary-foreground border-0 shadow-glow h-10">
                  {busy ? "Signing in…" : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="mt-4 space-y-3">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="h-10 bg-input/50" required />
                <EmailField email={email} setEmail={setEmail} />
                <PasswordField pw={pw} setPw={setPw} show={show} setShow={setShow} />
                <Button type="submit" disabled={busy} className="w-full gradient-primary text-primary-foreground border-0 shadow-glow h-10">
                  {busy ? "Creating…" : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-wider text-muted-foreground">
            <div className="flex-1 h-px bg-border" /> or <div className="flex-1 h-px bg-border" />
          </div>

          <Button type="button" variant="outline" disabled={busy} onClick={handleGoogle} className="w-full h-10">
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function EmailField({ email, setEmail }: { email: string; setEmail: (v: string) => void }) {
  return (
    <div className="relative">
      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@company.com" className="pl-9 h-10 bg-input/50" autoComplete="email" required />
    </div>
  );
}

function PasswordField({ pw, setPw, show, setShow }: { pw: string; setPw: (v: string) => void; show: boolean; setShow: (v: boolean) => void }) {
  return (
    <div className="relative">
      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input value={pw} onChange={(e) => setPw(e.target.value)} type={show ? "text" : "password"} placeholder="Password" className="pl-9 pr-10 h-10 bg-input/50" autoComplete="current-password" required minLength={6} />
      <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="toggle">
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
