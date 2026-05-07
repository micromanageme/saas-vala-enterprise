import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, CalendarClock, CheckSquare, Upload, Download, Copy, Archive } from "lucide-react";
import { ui, UI_EVENTS } from "@/lib/ui-bus";
import { useEffect } from "react";

export const ACTION_EVENTS = {
  scheduleActivity: "action:scheduleActivity",
  importWizard: "action:importWizard",
  exportWizard: "action:exportWizard",
  duplicate: "action:duplicate",
  archive: "action:archive",
};

export function ActionWizards() {
  const [activity, setActivity] = useState(false);
  const [imp, setImp] = useState(false);
  const [exp, setExp] = useState(false);
  const [dup, setDup] = useState(false);
  const [arch, setArch] = useState(false);
  const [type, setType] = useState<"call" | "email" | "meeting" | "todo">("todo");

  useEffect(() => {
    const offs = [
      ui.on(ACTION_EVENTS.scheduleActivity, () => setActivity(true)),
      ui.on(ACTION_EVENTS.importWizard, () => setImp(true)),
      ui.on(ACTION_EVENTS.exportWizard, () => setExp(true)),
      ui.on(ACTION_EVENTS.duplicate, () => setDup(true)),
      ui.on(ACTION_EVENTS.archive, () => setArch(true)),
    ];
    return () => offs.forEach((o) => o());
  }, []);

  return (
    <>
      {/* Schedule Activity */}
      <Dialog open={activity} onOpenChange={setActivity}>
        <DialogContent className="glass max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-primary" />Schedule Activity</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="flex gap-1">
              {([["call", Phone], ["email", Mail], ["meeting", CalendarClock], ["todo", CheckSquare]] as const).map(([t, Icon]) => (
                <button key={t} onClick={() => setType(t)} className={`flex-1 flex flex-col items-center gap-1 rounded-md border px-2 py-3 text-[11px] capitalize transition ${type === t ? "border-primary gradient-primary text-primary-foreground" : "border-border/60 hover:border-primary/40"}`}>
                  <Icon className="h-4 w-4" />{t}
                </button>
              ))}
            </div>
            <div><Label className="text-xs">Summary</Label><Input placeholder="What's the activity?" /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label className="text-xs">Due date</Label><Input type="date" /></div>
              <div><Label className="text-xs">Assigned to</Label><Input placeholder="@user" /></div>
            </div>
            <div><Label className="text-xs">Notes</Label><Textarea rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setActivity(false)}>Discard</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={() => setActivity(false)}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Wizard */}
      <Dialog open={imp} onOpenChange={setImp}>
        <DialogContent className="glass max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Upload className="h-4 w-4 text-primary" />Import Records</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="rounded-lg border-2 border-dashed border-border/60 bg-card/40 p-6 text-center text-xs text-muted-foreground">
              <Upload className="h-8 w-8 mx-auto mb-2 text-primary" />
              Drop your CSV / XLSX here, or <span className="text-primary underline cursor-pointer">browse</span>
            </div>
            <ol className="text-xs space-y-1 text-muted-foreground">
              <li>1. Map columns to fields</li>
              <li>2. Validate & preview rows</li>
              <li>3. Import to database</li>
            </ol>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setImp(false)}>Cancel</Button>
            <Button variant="outline">Download template</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={() => setImp(false)}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Wizard */}
      <Dialog open={exp} onOpenChange={setExp}>
        <DialogContent className="glass max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Download className="h-4 w-4 text-primary" />Export Records</DialogTitle></DialogHeader>
          <div className="space-y-3 text-sm">
            <div>
              <Label className="text-xs">Format</Label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {["CSV", "XLSX", "PDF"].map((f) => (
                  <button key={f} className="rounded-md border border-border/60 px-3 py-2 text-xs hover:border-primary/40 hover:bg-primary/10">{f}</button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs">Fields to export</Label>
              <div className="mt-1 max-h-40 overflow-y-auto rounded-md border border-border/60 p-2 text-xs space-y-1">
                {["Name", "Email", "Stage", "Owner", "Created at", "Amount"].map((f) => (
                  <label key={f} className="flex items-center gap-2"><input type="checkbox" defaultChecked /> {f}</label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setExp(false)}>Cancel</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={() => setExp(false)}>Export</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Duplicate */}
      <Dialog open={dup} onOpenChange={setDup}>
        <DialogContent className="glass max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Copy className="h-4 w-4 text-primary" />Duplicate Record</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Create an editable copy of the selected record(s)?</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDup(false)}>Cancel</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={() => setDup(false)}>Duplicate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive */}
      <Dialog open={arch} onOpenChange={setArch}>
        <DialogContent className="glass max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Archive className="h-4 w-4 text-warning" />Archive Record</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Archived records are hidden from default views but can be restored later.</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setArch(false)}>Cancel</Button>
            <Button className="bg-warning text-background hover:bg-warning/90" onClick={() => setArch(false)}>Archive</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
