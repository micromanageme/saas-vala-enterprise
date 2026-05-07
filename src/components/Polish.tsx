import { useEffect, useState } from "react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Copy, Edit, Archive, Trash2, Star, Share2, Eye, Download, Maximize2, Minimize2, Focus, Save, CheckCircle2, Cloud, Upload as UploadIcon, X } from "lucide-react";
import { ui } from "@/lib/ui-bus";
import { ACTION_EVENTS } from "./ActionWizards";
import { Button } from "./ui/button";

/* ----------- Right click / context menu wrapper ------------- */
export function RightClick({ children }: { children: React.ReactNode }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild><div>{children}</div></ContextMenuTrigger>
      <ContextMenuContent className="glass w-56">
        <ContextMenuItem><Eye className="h-3.5 w-3.5 mr-2" />Open</ContextMenuItem>
        <ContextMenuItem><Edit className="h-3.5 w-3.5 mr-2" />Quick edit</ContextMenuItem>
        <ContextMenuItem onClick={() => ui.emit(ACTION_EVENTS.duplicate)}><Copy className="h-3.5 w-3.5 mr-2" />Duplicate</ContextMenuItem>
        <ContextMenuItem><Star className="h-3.5 w-3.5 mr-2" />Star</ContextMenuItem>
        <ContextMenuItem><Share2 className="h-3.5 w-3.5 mr-2" />Share</ContextMenuItem>
        <ContextMenuItem><Download className="h-3.5 w-3.5 mr-2" />Export row</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => ui.emit(ACTION_EVENTS.archive)}><Archive className="h-3.5 w-3.5 mr-2" />Archive</ContextMenuItem>
        <ContextMenuItem className="text-destructive"><Trash2 className="h-3.5 w-3.5 mr-2" />Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

/* ----------- Global ripple click feedback ------------- */
export function RippleProvider() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest("button, a");
      if (!btn || (btn as HTMLElement).dataset.noRipple) return;
      const rect = btn.getBoundingClientRect();
      const r = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      r.style.cssText = `position:absolute;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;width:${size}px;height:${size}px;border-radius:9999px;background:radial-gradient(circle, oklch(0.72 0.19 295/.4), transparent 70%);pointer-events:none;transform:scale(0);animation:sv-ripple .55s ease-out;z-index:0;`;
      const cs = getComputedStyle(btn as Element);
      if (cs.position === "static") (btn as HTMLElement).style.position = "relative";
      (btn as HTMLElement).style.overflow = "hidden";
      btn.appendChild(r);
      setTimeout(() => r.remove(), 600);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
  return null;
}

/* ----------- Save / autosave indicator ------------- */
export function SaveIndicator() {
  const [state, setState] = useState<"saved" | "saving" | "dirty">("saved");
  useEffect(() => {
    const i = setInterval(() => {
      setState("saving");
      setTimeout(() => setState("saved"), 800);
    }, 18000);
    return () => clearInterval(i);
  }, []);
  return (
    <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-muted-foreground">
      {state === "saved" && (<><CheckCircle2 className="h-3.5 w-3.5 text-success" />All changes saved</>)}
      {state === "saving" && (<><Cloud className="h-3.5 w-3.5 animate-pulse text-primary" />Saving…</>)}
      {state === "dirty" && (<><Save className="h-3.5 w-3.5 text-warning" />Unsaved changes</>)}
    </div>
  );
}

/* ----------- Focus / fullscreen mode toggle ------------- */
export function FocusMode() {
  const [focus, setFocus] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("focus-mode", focus);
  }, [focus]);
  const fs = async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
    else await document.exitFullscreen?.();
  };
  return (
    <div className="hidden md:flex items-center">
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Zen / Focus mode" onClick={() => setFocus((f) => !f)}>
        <Focus className={`h-4 w-4 ${focus ? "text-primary" : ""}`} />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Fullscreen" onClick={fs}>
        <Maximize2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

/* ----------- Drag-and-drop upload overlay ------------- */
export function DragUploadOverlay() {
  const [over, setOver] = useState(false);
  useEffect(() => {
    let t: any;
    const enter = (e: DragEvent) => { if (e.dataTransfer?.types.includes("Files")) { setOver(true); clearTimeout(t); } };
    const leave = () => { t = setTimeout(() => setOver(false), 80); };
    const drop = () => setOver(false);
    window.addEventListener("dragenter", enter);
    window.addEventListener("dragleave", leave);
    window.addEventListener("drop", drop);
    window.addEventListener("dragover", (e) => e.preventDefault());
    return () => {
      window.removeEventListener("dragenter", enter);
      window.removeEventListener("dragleave", leave);
      window.removeEventListener("drop", drop);
    };
  }, []);
  if (!over) return null;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="rounded-2xl border-2 border-dashed border-primary p-12 text-center gradient-card shadow-glow">
        <UploadIcon className="h-12 w-12 mx-auto text-primary mb-3 animate-bounce" />
        <div className="text-lg font-bold text-gradient">Drop files anywhere</div>
        <div className="text-xs text-muted-foreground mt-1">PDF, images, CSV — auto-attached to current record</div>
      </div>
    </div>
  );
}

/* ----------- Background task / queue progress ------------- */
export function BackgroundTasks() {
  const [open, setOpen] = useState(true);
  const [progress, setProgress] = useState(12);
  useEffect(() => {
    const i = setInterval(() => setProgress((p) => (p >= 100 ? 12 : p + 7)), 700);
    return () => clearInterval(i);
  }, []);
  if (!open) return null;
  return (
    <div className="fixed bottom-44 left-6 z-30 w-72 rounded-xl glass border border-border/60 shadow-elegant animate-slide-in-right">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/40">
        <div className="text-xs font-semibold flex items-center gap-2"><Cloud className="h-3.5 w-3.5 text-primary" />Background tasks</div>
        <button onClick={() => setOpen(false)}><X className="h-3 w-3 opacity-60 hover:opacity-100" /></button>
      </div>
      <div className="p-3 space-y-2 text-[11px]">
        <div>
          <div className="flex justify-between mb-1"><span>Importing leads.csv</span><span className="text-primary">{progress}%</span></div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full gradient-primary transition-all" style={{ width: `${progress}%` }} /></div>
        </div>
        <div>
          <div className="flex justify-between mb-1"><span>Exporting Q4 report</span><span className="text-success">Done</span></div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full bg-success" style={{ width: "100%" }} /></div>
        </div>
        <div>
          <div className="flex justify-between mb-1"><span>Sync to Cloud</span><span className="text-muted-foreground">Queued</span></div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full bg-warning animate-pulse" style={{ width: "30%" }} /></div>
        </div>
      </div>
    </div>
  );
}

/* ----------- Live presence avatars (Discuss style) ------------- */
export function PresenceAvatars() {
  const users = [
    { i: "AK", c: "bg-success" },
    { i: "RM", c: "bg-warning" },
    { i: "JS", c: "bg-info" },
    { i: "ND", c: "bg-success" },
  ];
  return (
    <div className="hidden md:flex items-center -space-x-2">
      {users.map((u) => (
        <div key={u.i} className="relative grid h-7 w-7 place-items-center rounded-full gradient-primary text-[9px] font-bold text-primary-foreground ring-2 ring-background hover:scale-110 transition" title={`${u.i} · online`}>
          {u.i}
          <span className={`absolute -bottom-0 -right-0 h-2 w-2 rounded-full ${u.c} ring-1 ring-background`} />
        </div>
      ))}
    </div>
  );
}

/* ----------- Onboarding walkthrough overlay ------------- */
export function Walkthrough() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const steps = [
    { t: "Welcome to SaaS Vala", d: "Your enterprise command center. Let's tour the essentials." },
    { t: "App Drawer", d: "Click the grid icon to access all 50+ modules." },
    { t: "Spotlight Search", d: "Press ⌘K from anywhere to jump to any record or page." },
    { t: "Chatter & Activities", d: "Every record has built-in collaboration: messages, notes & scheduled activities." },
    { t: "You're set", d: "Click Finish to start using SaaS Vala Enterprise." },
  ];
  useEffect(() => {
    if (!localStorage.getItem("sv-walkthrough-done")) setOpen(true);
  }, []);
  if (!open) return null;
  const close = () => { localStorage.setItem("sv-walkthrough-done", "1"); setOpen(false); };
  const s = steps[step];
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-background/70 backdrop-blur-sm animate-fade-in">
      <div className="w-[420px] max-w-[92vw] rounded-2xl glass shadow-glow border border-primary/30 p-6 animate-scale-in">
        <div className="text-[10px] uppercase tracking-wider text-primary mb-1">Step {step + 1} of {steps.length}</div>
        <h3 className="text-lg font-bold text-gradient">{s.t}</h3>
        <p className="text-sm text-muted-foreground mt-2">{s.d}</p>
        <div className="mt-4 flex gap-1">
          {steps.map((_, i) => <div key={i} className={`h-1 flex-1 rounded ${i <= step ? "gradient-primary" : "bg-muted"}`} />)}
        </div>
        <div className="mt-5 flex justify-between">
          <Button variant="ghost" size="sm" onClick={close}>Skip</Button>
          {step < steps.length - 1 ? (
            <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => setStep((s) => s + 1)}>Next</Button>
          ) : (
            <Button size="sm" className="gradient-primary text-primary-foreground" onClick={close}>Finish</Button>
          )}
        </div>
      </div>
    </div>
  );
}

export { Minimize2 };
