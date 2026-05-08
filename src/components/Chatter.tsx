import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Paperclip, Send, Activity, Mail, AtSign, X } from "lucide-react";

type Msg = { who: string; initials: string; text: string; when: string; type: "log" | "note" | "activity"; mentions?: string[] };
type User = { id: string; name: string; initials: string };

const USERS: User[] = [
  { id: "1", name: "Aria K.", initials: "AK" },
  { id: "2", name: "Ravi M.", initials: "RM" },
  { id: "3", name: "John D.", initials: "JD" },
  { id: "4", name: "Sarah L.", initials: "SL" },
];

export function Chatter({ title = "Chatter" }: { title?: string }) {
  const [tab, setTab] = useState<"send" | "log" | "activity">("send");
  const [text, setText] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>(USERS);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [msgs, setMsgs] = useState<Msg[]>([
    { who: "System", initials: "SV", text: "Record created", when: "2h ago", type: "log" },
    { who: "Aria K.", initials: "AK", text: "Reviewed and approved. Pushing to next stage.", when: "1h ago", type: "note" },
    { who: "Ravi M.", initials: "RM", text: "Scheduled call with customer for tomorrow 10:00", when: "30m ago", type: "activity" },
  ]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);

    // Check for @mention trigger
    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1 && (lastAtIndex === 0 || textBeforeCursor[lastAtIndex - 1] === ' ')) {
      const mentionText = textBeforeCursor.substring(lastAtIndex + 1);
      setMentionQuery(mentionText);
      setShowMentions(true);

      // Filter users based on mention query
      const filtered = USERS.filter(u =>
        u.name.toLowerCase().includes(mentionText.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (user: User) => {
    const cursorPos = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = text.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    const newText = text.substring(0, lastAtIndex) + `@${user.name}` + text.substring(cursorPos);
    setText(newText);
    setShowMentions(false);
    textareaRef.current?.focus();
  };

  const post = () => {
    if (!text.trim()) return;
    
    // Extract mentions from text
    const mentionRegex = /@(\w+(?:\s+\w+)*)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }

    setMsgs((m) => [{ 
      who: "You", 
      initials: "ME", 
      text, 
      when: "now", 
      type: tab === "activity" ? "activity" : tab === "log" ? "log" : "note",
      mentions: mentions.length > 0 ? mentions : undefined
    }, ...m]);
    setText("");
  };

  return (
    <Card className="gradient-card border-border/60 relative">
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
        <div className="rounded-lg border border-border/60 bg-card/60 p-2 relative">
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            placeholder={tab === "send" ? "Send message to followers… Use @ to mention users" : tab === "log" ? "Log an internal note…" : "Schedule activity…"}
            className="min-h-20 border-0 bg-transparent resize-none focus-visible:ring-0"
          />
          {/* Mentions dropdown */}
          {showMentions && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border/60 bg-card shadow-glow z-10 max-h-48 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => insertMention(user)}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-primary/10 transition text-left"
                  >
                    <Avatar className="h-6 w-6"><AvatarFallback className="text-[8px] gradient-primary text-primary-foreground">{user.initials}</AvatarFallback></Avatar>
                    <span className="text-sm">{user.name}</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">No users found</div>
              )}
            </div>
          )}
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
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">{m.who}</span>
                  <Badge variant="outline" className="text-[9px] uppercase">{m.type}</Badge>
                  {m.mentions && m.mentions.length > 0 && (
                    <div className="flex items-center gap-1 text-[10px] text-primary">
                      <AtSign className="h-3 w-3" />
                      {m.mentions.map((mention, idx) => (
                        <span key={idx} className="bg-primary/10 px-1.5 py-0.5 rounded">@{mention}</span>
                      ))}
                    </div>
                  )}
                  <span className="text-[10px] text-muted-foreground">{m.when}</span>
                </div>
                <div className="mt-1 text-sm rounded-lg border border-border/40 bg-card/40 px-3 py-2">
                  {m.text.split(/(@\w+(?:\s+\w+)*)/g).map((part, idx) => {
                    if (part.startsWith('@')) {
                      return <span key={idx} className="text-primary font-medium bg-primary/10 px-1 rounded">{part}</span>;
                    }
                    return <span key={idx}>{part}</span>;
                  })}
                </div>
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
