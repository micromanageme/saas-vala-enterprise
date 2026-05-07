import { Bell, MessageCircle, HelpCircle, Volume2, VolumeX, Globe, Clock, DollarSign, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Systray() {
  const [sound, setSound] = useState(true);
  const [online, setOnline] = useState(true);
  const [lang, setLang] = useState("EN");
  const [tz] = useState("UTC+05:30");
  const [cur, setCur] = useState("USD");

  return (
    <div className="hidden md:flex items-center gap-0.5 text-muted-foreground">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-[11px] gap-1"><Globe className="h-3.5 w-3.5" />{lang}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="glass">
          <DropdownMenuLabel>Language</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {["EN", "HI", "AR", "ES", "FR", "DE"].map((l) => (
            <DropdownMenuItem key={l} onClick={() => setLang(l)}>{l}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-[11px] gap-1"><DollarSign className="h-3.5 w-3.5" />{cur}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="glass">
          <DropdownMenuLabel>Currency</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {["USD", "EUR", "GBP", "INR", "AED", "JPY"].map((c) => (
            <DropdownMenuItem key={c} onClick={() => setCur(c)}>{c}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="ghost" size="sm" className="h-8 px-2 text-[11px] gap-1" title={`Timezone ${tz}`}><Clock className="h-3.5 w-3.5" />{tz}</Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSound((s) => !s)} title={sound ? "Mute notifications" : "Enable sound"}>
        {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-destructive" />}
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Discuss / Chat"><MessageCircle className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Help"><HelpCircle className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 relative" title="Activities">
        <Bell className="h-4 w-4" />
        <span className="absolute -top-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full gradient-primary text-[9px] font-bold text-primary-foreground">7</span>
      </Button>
      <button onClick={() => setOnline((o) => !o)} title={online ? "Online" : "Offline"} className="grid h-8 w-8 place-items-center hover:bg-muted/40 rounded-md">
        {online ? <Wifi className="h-4 w-4 text-success" /> : <WifiOff className="h-4 w-4 text-destructive" />}
      </button>
    </div>
  );
}
