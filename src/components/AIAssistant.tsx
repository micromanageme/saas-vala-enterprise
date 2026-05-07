import { useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hi, I'm Vala AI. Ask me anything about your business." },
  ]);
  const [v, setV] = useState("");

  const send = () => {
    if (!v.trim()) return;
    const text = v.trim();
    setMsgs((m) => [...m, { role: "user", text }]);
    setV("");
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "ai", text: `Here's a smart suggestion based on "${text}".` }]);
    }, 600);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-40 grid h-14 w-14 place-items-center rounded-full gradient-primary text-primary-foreground shadow-glow hover:scale-110 transition-transform"
        aria-label="AI Assistant"
      >
        <Sparkles className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-success animate-pulse" />
      </button>

      {open && (
        <div className="fixed bottom-44 right-6 z-50 w-[360px] max-w-[92vw] rounded-2xl glass shadow-glow animate-scale-in overflow-hidden border border-primary/30">
          <div className="flex items-center justify-between gap-2 border-b border-border/60 bg-card/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg gradient-primary"><Bot className="h-4 w-4 text-primary-foreground" /></div>
              <div>
                <div className="text-sm font-semibold">Vala Copilot</div>
                <div className="text-[10px] text-success flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-success" /> Online</div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}><X className="h-4 w-4" /></Button>
          </div>
          <div className="max-h-72 overflow-y-auto p-3 space-y-2">
            {msgs.map((m, i) => (
              <div key={i} className={`text-sm rounded-xl px-3 py-2 max-w-[85%] ${m.role === "user" ? "ml-auto gradient-primary text-primary-foreground" : "bg-muted/60"}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="border-t border-border/60 p-2 flex gap-2 bg-card/60">
            <Input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask Vala AI…" className="bg-input/50" />
            <Button size="icon" onClick={send} className="gradient-primary text-primary-foreground"><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </>
  );
}
