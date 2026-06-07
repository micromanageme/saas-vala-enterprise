import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Trash2, Pencil, RefreshCw, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/crm")({
  head: () => ({ meta: [{ title: "CRM · Leads — SaaS Vala" }] }),
  component: LeadsPage,
});

type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
type LeadSource = "website" | "referral" | "cold_outreach" | "event" | "ad" | "other";

interface Lead {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  source: LeadSource;
  status: LeadStatus;
  estimated_value: number;
  notes: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "proposal", "won", "lost"];
const SOURCES: LeadSource[] = ["website", "referral", "cold_outreach", "event", "ad", "other"];

const statusColor: Record<LeadStatus, string> = {
  new: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  contacted: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  qualified: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  proposal: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  won: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  lost: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

function LeadsPage() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) nav({ to: "/auth" });
      else setUserId(data.user.id);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) nav({ to: "/auth" });
      else setUserId(session.user.id);
    });
    return () => sub.subscription.unsubscribe();
  }, [nav]);

  const { data: leads = [], isLoading, refetch } = useQuery({
    queryKey: ["leads"],
    enabled: !!userId,
    queryFn: async (): Promise<Lead[]> => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Lead[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (input: Partial<Lead>) => {
      if (!userId) throw new Error("Not signed in");
      if (editing) {
        const { error } = await supabase
          .from("leads")
          .update({
            name: input.name!, company: input.company ?? null, email: input.email ?? null,
            phone: input.phone ?? null, source: input.source!, status: input.status!,
            estimated_value: input.estimated_value ?? 0, notes: input.notes ?? null,
          })
          .eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("leads").insert({
          name: input.name!, company: input.company ?? null, email: input.email ?? null,
          phone: input.phone ?? null, source: input.source ?? "other",
          status: input.status ?? "new", estimated_value: input.estimated_value ?? 0,
          notes: input.notes ?? null, owner_id: userId,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Lead updated" : "Lead created");
      setOpenForm(false); setEditing(null);
      qc.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (e: any) => toast.error(e.message || "Failed"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Lead deleted"); qc.invalidateQueries({ queryKey: ["leads"] }); },
    onError: (e: any) => toast.error(e.message || "Failed"),
  });

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (!needle) return true;
      return [l.name, l.company, l.email, l.phone].filter(Boolean).some((v) => v!.toLowerCase().includes(needle));
    });
  }, [leads, q, statusFilter]);

  const kpis = useMemo(() => {
    const open = leads.filter((l) => !["won", "lost"].includes(l.status)).length;
    const won = leads.filter((l) => l.status === "won");
    const wonValue = won.reduce((s, l) => s + Number(l.estimated_value || 0), 0);
    const closed = leads.filter((l) => ["won", "lost"].includes(l.status)).length;
    const winRate = closed ? Math.round((won.length / closed) * 100) : 0;
    const pipeline = leads.filter((l) => !["won", "lost"].includes(l.status))
      .reduce((s, l) => s + Number(l.estimated_value || 0), 0);
    return { open, wonValue, winRate, pipeline };
  }, [leads]);

  const exportCsv = () => {
    const head = ["name", "company", "email", "phone", "source", "status", "estimated_value", "created_at"];
    const rows = filtered.map((l) => head.map((k) => JSON.stringify((l as any)[k] ?? "")).join(","));
    const csv = [head.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `leads-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">CRM · Leads</h1>
            <p className="text-xs text-muted-foreground">Capture, qualify, and convert leads. Real backend.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}><RefreshCw className="h-4 w-4 mr-1.5" />Refresh</Button>
            <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4 mr-1.5" />Export</Button>
            <Dialog open={openForm} onOpenChange={(o) => { setOpenForm(o); if (!o) setEditing(null); }}>
              <DialogTrigger asChild>
                <Button size="sm" className="gradient-primary text-primary-foreground border-0"><Plus className="h-4 w-4 mr-1.5" />New Lead</Button>
              </DialogTrigger>
              <LeadForm
                key={editing?.id || "new"}
                initial={editing}
                onSubmit={(v) => upsert.mutate(v)}
                submitting={upsert.isPending}
              />
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Kpi label="Open Leads" value={String(kpis.open)} />
          <Kpi label="Pipeline" value={`$${kpis.pipeline.toLocaleString()}`} />
          <Kpi label="Won Value" value={`$${kpis.wonValue.toLocaleString()}`} />
          <Kpi label="Win Rate" value={`${kpis.winRate}%`} />
        </div>

        <Card className="gradient-card border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-sm">All Leads</CardTitle>
              <div className="relative ml-auto">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-8 h-8 w-56" />
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <SelectTrigger className="h-8 w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow><TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">Loading…</TableCell></TableRow>
                )}
                {!isLoading && filtered.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                    No leads yet. Click <span className="font-medium">New Lead</span> to add one.
                  </TableCell></TableRow>
                )}
                {filtered.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.name}</TableCell>
                    <TableCell>{l.company || "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {l.email || "—"}{l.phone ? ` · ${l.phone}` : ""}
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{l.source}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className={`text-[10px] ${statusColor[l.status]}`}>{l.status}</Badge></TableCell>
                    <TableCell className="text-right">${Number(l.estimated_value || 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditing(l); setOpenForm(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-rose-400 hover:text-rose-300" onClick={() => { if (confirm(`Delete lead "${l.name}"?`)) remove.mutate(l.id); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <Card className="gradient-card border-border/60">
      <CardContent className="p-4">
        <div className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</div>
        <div className="text-2xl font-bold mt-1">{value}</div>
      </CardContent>
    </Card>
  );
}

function LeadForm({
  initial, onSubmit, submitting,
}: {
  initial: Lead | null;
  onSubmit: (v: Partial<Lead>) => void;
  submitting: boolean;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [company, setCompany] = useState(initial?.company || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [source, setSource] = useState<LeadSource>(initial?.source || "other");
  const [status, setStatus] = useState<LeadStatus>(initial?.status || "new");
  const [value, setValue] = useState<string>(String(initial?.estimated_value ?? 0));
  const [notes, setNotes] = useState(initial?.notes || "");

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader><DialogTitle>{initial ? "Edit Lead" : "New Lead"}</DialogTitle></DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return toast.error("Name is required");
          onSubmit({
            name: name.trim(), company: company.trim() || null, email: email.trim() || null,
            phone: phone.trim() || null, source, status,
            estimated_value: Number(value) || 0, notes: notes.trim() || null,
          });
        }}
        className="space-y-3"
      >
        <Input placeholder="Lead name *" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} />
        <Input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} maxLength={120} />
        <div className="grid grid-cols-2 gap-2">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200} />
          <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={40} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Select value={source} onValueChange={(v) => setSource(v as LeadSource)}>
            <SelectTrigger><SelectValue placeholder="Source" /></SelectTrigger>
            <SelectContent>{SOURCES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => setStatus(v as LeadStatus)}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <Input type="number" min="0" step="0.01" placeholder="Estimated value" value={value} onChange={(e) => setValue(e.target.value)} />
        <Textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={2000} rows={3} />
        <DialogFooter>
          <Button type="submit" disabled={submitting} className="gradient-primary text-primary-foreground border-0">
            {submitting ? "Saving…" : initial ? "Save changes" : "Create lead"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
