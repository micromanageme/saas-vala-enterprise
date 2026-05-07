import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Paperclip, Send, Activity, Mail, AtSign } from "lucide-react";

type Msg = { who: string; initials: string; text: string; when: string; type: "log" | "note" | "activity" };

export function Chatter({ title = "Chatter" }: { title?: string }) {
  const [tab, setTab] = useState<"send" | "log" | "activity">("send");
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { who: "System", initials: "SV", text: "Record created", when: "2h ago", type: "log" },
    { who: "Aria K.", initials: "AK", text: "Reviewed and approved. Pushing to next stage.", when: "1h ago", type: "note" },
    { who: "Ravi M.", initials: "RM", text: "Scheduled call with customer for tomorrow 10:00", when: "30m ago", type: "activity" },
  ]);
  const post = () => {
    if (!text.trim()) return;
    setMsgs((m) => [{ who: "You", initials: "ME", text, when: "now", type: tab === "activity" ? "activity" : tab === "log" ? "log" : "note" }, ...m]);
    setText("");
  };
  return (
    <Card className="gradient-card border-border/60">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /> {title}</CardTitle>
          <div className="flex gap-1 text-[11px]">
            {(["send", "log", "activity"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`rounded-md px-2 py-1 ${tab === t ? "gradient-primary text-primary-foreground" : "hover:bg-muted/60"}`}>
                {t === "send" ? "Send message" : t === "log" ? "Log note" : "Schedule activity"}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-lg border border-border/60 bg-card/60 p-2">
          <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={tab === "send" ? "Send message to followers…" : tab === "log" ? "Log an internal note…" : "Schedule activity…"} className="min-h-20 border-0 bg-transparent resize-none focus-visible:ring-0" />
          <div className="flex items-center justify-between border-t border-border/40 pt-2">
            <div className="flex gap-1 text-muted-foreground">
              <Button size="icon" variant="ghost" className="h-7 w-7"><Paperclip className="h-3.5 w-3.5" /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7"><AtSign className="h-3.5 w-3.5" /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7"><Mail className="h-3.5 w-3.5" /></Button>
            </div>
            <Button size="sm" onClick={post} className="gradient-primary text-primary-foreground h-7"><Send className="h-3 w-3 mr-1" />Post</Button>
          </div>
        </div>
        <div className="space-y-3">
          {msgs.map((m, i) => (
            <div key={i} className="flex gap-3">
              <Avatar className="h-8 w-8"><AvatarFallback className="text-[10px] gradient-primary text-primary-foreground">{m.initials}</AvatarFallback></Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{m.who}</span>
                  <Badge variant="outline" className="text-[9px] uppercase">{m.type}</Badge>
                  <span className="text-[10px] text-muted-foreground">{m.when}</span>
                </div>
                <div className="mt-1 text-sm rounded-lg border border-border/40 bg-card/40 px-3 py-2">{m.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-border/40 pt-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> 4 followers</span>
          <button className="hover:text-primary">Follow</button>
        </div>
      </CardContent>
    </Card>
  );
}
