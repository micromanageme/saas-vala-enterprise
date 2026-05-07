import { Sun, Moon, Languages, Rows3, Columns3, MoreVertical, Globe2, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSub,
  DropdownMenuSubTrigger, DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { usePrefs } from "@/lib/preferences";

const langs = [
  { v: "en", label: "English" },
  { v: "hi", label: "हिन्दी" },
  { v: "ar", label: "العربية" },
  { v: "es", label: "Español" },
  { v: "fr", label: "Français" },
];

export function PreferencesMenu() {
  const [p, set] = usePrefs();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Preferences"><MoreVertical className="h-4 w-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 glass">
        <DropdownMenuLabel>Preferences</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => set({ theme: p.theme === "dark" ? "light" : "dark" })}>
          {p.theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
          {p.theme === "dark" ? "Light mode" : "Dark mode"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => set({ density: p.density === "compact" ? "comfortable" : "compact" })}>
          {p.density === "compact" ? <Rows3 className="h-4 w-4 mr-2" /> : <Columns3 className="h-4 w-4 mr-2" />}
          {p.density === "compact" ? "Comfortable density" : "Compact density"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => set({ rtl: !p.rtl })}>
          <ArrowLeftRight className="h-4 w-4 mr-2" />
          {p.rtl ? "Switch to LTR" : "Switch to RTL"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger><Languages className="h-4 w-4 mr-2" />Language</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="glass">
            <DropdownMenuRadioGroup value={p.language} onValueChange={(v) => set({ language: v as any, rtl: v === "ar" })}>
              {langs.map((l) => <DropdownMenuRadioItem key={l.v} value={l.v}>{l.label}</DropdownMenuRadioItem>)}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger><Globe2 className="h-4 w-4 mr-2" />Region</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="glass">
            <DropdownMenuRadioGroup value={p.region} onValueChange={(v) => set({ region: v as any })}>
              {["Global","APAC","Americas","EMEA"].map((r) => <DropdownMenuRadioItem key={r} value={r}>{r}</DropdownMenuRadioItem>)}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
