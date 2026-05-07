import { useState } from "react";
import { AlertTriangle, Sparkles, X, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Banners() {
  const [trial, setTrial] = useState(true);
  const [license] = useState(true);
  const [online, setOnline] = useState(true);
  const [syncing, setSyncing] = useState(false);

  return (
    <div className="space-y-2">
      {trial && (
        <div className="flex items-center gap-3 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-xs animate-fade-in">
          <Sparkles className="h-4 w-4 text-warning" />
          <span className="flex-1">Your <b>Enterprise Trial</b> ends in <b>14 days</b>. Upgrade to keep premium modules.</span>
          <Button size="sm" className="h-7 gradient-primary text-primary-foreground">Upgrade</Button>
          <button onClick={() => setTrial(false)}><X className="h-3.5 w-3.5 opacity-60 hover:opacity-100" /></button>
        </div>
      )}
      {license && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-xs">
          <span className="grid h-5 w-5 place-items-center rounded gradient-primary text-[9px] text-primary-foreground font-bold">L</span>
          <span className="flex-1">License <b>SV-ENT-2026</b> · 250 users · valid until <b>Dec 31, 2026</b></span>
          <Button size="sm" variant="ghost" className="h-7">Manage</Button>
        </div>
      )}
      <div className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-xs ${online ? "border-success/30 bg-success/5" : "border-destructive/40 bg-destructive/10"}`}>
        {online ? <Wifi className="h-4 w-4 text-success" /> : <WifiOff className="h-4 w-4 text-destructive" />}
        <span className="flex-1">{online ? "Connected to SaaS Vala servers" : "You are offline. Changes will sync when reconnected."}</span>
        {!online && <Button size="sm" variant="outline" className="h-7" onClick={() => setOnline(true)}>Reconnect</Button>}
        <button onClick={() => setOnline((o) => !o)} className="text-[10px] underline opacity-70">toggle</button>
      </div>
      <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-card/60 px-3 py-2 text-xs">
        <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin text-primary" : "text-muted-foreground"}`} />
        <span className="flex-1">Last sync: <b>2 minutes ago</b> · 0 pending</span>
        <Button size="sm" variant="ghost" className="h-7" onClick={() => { setSyncing(true); setTimeout(() => setSyncing(false), 1500); }}>Sync now</Button>
      </div>
    </div>
  );
}
