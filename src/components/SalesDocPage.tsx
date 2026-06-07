import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
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
import { Plus, Search, Trash2, Pencil, RefreshCw, Download, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface LineItem {
  description: string;
  qty: number;
  price: number;
}

export interface SalesDoc {
  id: string;
  number: string;
  customer_name: string;
  customer_email: string | null;
  customer_company: string | null;
  line_items: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: string;
  notes: string | null;
  owner_id: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  // optional fields per doc type
  valid_until?: string | null;
  due_date?: string | null;
  paid_at?: string | null;
}

export interface SalesDocConfig {
  table: "sales_quotes" | "sales_orders" | "sales_invoices";
  title: string;
  subtitle: string;
  prefix: string; // QUO, ORD, INV
  statuses: readonly string[];
  statusColor: Record<string, string>;
  extraFields?: Array<"valid_until" | "due_date">;
}

export function SalesDocPage({ config }: { config: SalesDocConfig }) {
  const nav = useNavigate();
  const qc = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<SalesDoc | null>(null);

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

  const { data: docs = [], isLoading, refetch } = useQuery({
    queryKey: [config.table],
    enabled: !!userId,
    queryFn: async (): Promise<SalesDoc[]> => {
      const { data, error } = await supabase
        .from(config.table)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((d: any) => ({
        ...d,
        line_items: Array.isArray(d.line_items) ? d.line_items : [],
      })) as SalesDoc[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (input: Partial<SalesDoc>) => {
      if (!userId) throw new Error("Not signed in");
      const payload: any = {
        number: input.number,
        customer_name: input.customer_name,
        customer_email: input.customer_email ?? null,
        customer_company: input.customer_company ?? null,
        line_items: input.line_items ?? [],
        subtotal: input.subtotal ?? 0,
        tax: input.tax ?? 0,
        total: input.total ?? 0,
        currency: input.currency ?? "USD",
        status: input.status,
        notes: input.notes ?? null,
      };
      if (config.extraFields?.includes("valid_until")) payload.valid_until = input.valid_until ?? null;
      if (config.extraFields?.includes("due_date")) payload.due_date = input.due_date ?? null;

      if (editing) {
        const { error } = await supabase.from(config.table).update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(config.table).insert({ ...payload, owner_id: userId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? `${config.title.slice(0, -1)} updated` : `${config.title.slice(0, -1)} created`);
      setOpenForm(false); setEditing(null);
      qc.invalidateQueries({ queryKey: [config.table] });
    },
    onError: (e: any) => toast.error(e.message || "Failed"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(config.table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: [config.table] }); },
    onError: (e: any) => toast.error(e.message || "Failed"),
  });

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return docs.filter((d) => {
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      if (!needle) return true;
      return [d.number, d.customer_name, d.customer_email, d.customer_company]
        .filter(Boolean).some((v) => v!.toLowerCase().includes(needle));
    });
  }, [docs, q, statusFilter]);

  const kpis = useMemo(() => {
    const totalValue = docs.reduce((s, d) => s + Number(d.total || 0), 0);
    const open = docs.filter((d) => !["paid","completed","accepted","cancelled","rejected","expired"].includes(d.status));
    const closedGood = docs.filter((d) => ["paid","completed","accepted"].includes(d.status));
    const closedGoodValue = closedGood.reduce((s, d) => s + Number(d.total || 0), 0);
    return {
      count: docs.length,
      openCount: open.length,
      totalValue,
      closedGoodValue,
    };
  }, [docs]);

  const exportCsv = () => {
    const head = ["number","customer_name","customer_company","customer_email","status","subtotal","tax","total","currency","created_at"];
    const rows = filtered.map((d) => head.map((k) => JSON.stringify((d as any)[k] ?? "")).join(","));
    const csv = [head.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${config.table}-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">{config.title}</h1>
            <p className="text-xs text-muted-foreground">{config.subtitle}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}><RefreshCw className="h-4 w-4 mr-1.5" />Refresh</Button>
            <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4 mr-1.5" />Export</Button>
            <Dialog open={openForm} onOpenChange={(o) => { setOpenForm(o); if (!o) setEditing(null); }}>
              <DialogTrigger asChild>
                <Button size="sm" className="gradient-primary text-primary-foreground border-0"><Plus className="h-4 w-4 mr-1.5" />New</Button>
              </DialogTrigger>
              <DocForm
                key={editing?.id || "new"}
                config={config}
                initial={editing}
                onSubmit={(v) => upsert.mutate(v)}
                submitting={upsert.isPending}
              />
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Kpi label="Total" value={String(kpis.count)} />
          <Kpi label="Open" value={String(kpis.openCount)} />
          <Kpi label="Pipeline" value={`$${kpis.totalValue.toLocaleString()}`} />
          <Kpi label="Closed value" value={`$${kpis.closedGoodValue.toLocaleString()}`} />
        </div>

        <Card className="gradient-card border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-sm">All {config.title}</CardTitle>
              <div className="relative ml-auto">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-8 h-8 w-56" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {config.statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow><TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">Loading…</TableCell></TableRow>
                )}
                {!isLoading && filtered.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
                    No records. Click <span className="font-medium">New</span> to create one.
                  </TableCell></TableRow>
                )}
                {filtered.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-mono text-xs">{d.number}</TableCell>
                    <TableCell>
                      <div className="font-medium">{d.customer_name}</div>
                      <div className="text-xs text-muted-foreground">{d.customer_company || d.customer_email || "—"}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] ${config.statusColor[d.status] || ""}`}>{d.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{d.currency} {Number(d.total || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditing(d); setOpenForm(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-rose-400 hover:text-rose-300" onClick={() => { if (confirm(`Delete ${d.number}?`)) remove.mutate(d.id); }}><Trash2 className="h-3.5 w-3.5" /></Button>
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

function genNumber(prefix: string) {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `${prefix}-${stamp}-${rand}`;
}

function DocForm({
  config, initial, onSubmit, submitting,
}: {
  config: SalesDocConfig;
  initial: SalesDoc | null;
  onSubmit: (v: Partial<SalesDoc>) => void;
  submitting: boolean;
}) {
  const [number, setNumber] = useState(initial?.number || genNumber(config.prefix));
  const [name, setName] = useState(initial?.customer_name || "");
  const [company, setCompany] = useState(initial?.customer_company || "");
  const [email, setEmail] = useState(initial?.customer_email || "");
  const [status, setStatus] = useState<string>(initial?.status || config.statuses[0]);
  const [currency, setCurrency] = useState(initial?.currency || "USD");
  const [taxPct, setTaxPct] = useState<string>(
    initial && initial.subtotal > 0 ? String(Math.round((Number(initial.tax)/Number(initial.subtotal))*10000)/100) : "0"
  );
  const [items, setItems] = useState<LineItem[]>(initial?.line_items?.length ? initial.line_items : [{ description: "", qty: 1, price: 0 }]);
  const [notes, setNotes] = useState(initial?.notes || "");
  const [validUntil, setValidUntil] = useState(initial?.valid_until?.slice(0,10) || "");
  const [dueDate, setDueDate] = useState(initial?.due_date?.slice(0,10) || "");

  const subtotal = items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.price) || 0), 0);
  const tax = subtotal * (Number(taxPct) || 0) / 100;
  const total = subtotal + tax;

  const updateItem = (idx: number, patch: Partial<LineItem>) =>
    setItems((arr) => arr.map((it, i) => i === idx ? { ...it, ...patch } : it));
  const addItem = () => setItems((a) => [...a, { description: "", qty: 1, price: 0 }]);
  const removeItem = (idx: number) => setItems((a) => a.filter((_, i) => i !== idx));

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader><DialogTitle>{initial ? `Edit ${config.prefix}` : `New ${config.prefix}`}</DialogTitle></DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return toast.error("Customer name is required");
          if (!number.trim()) return toast.error("Number is required");
          const cleanItems = items.filter((i) => i.description.trim());
          onSubmit({
            number: number.trim(),
            customer_name: name.trim(),
            customer_company: company.trim() || null,
            customer_email: email.trim() || null,
            line_items: cleanItems.map((i) => ({ description: i.description.trim(), qty: Number(i.qty) || 0, price: Number(i.price) || 0 })),
            subtotal, tax, total, currency, status,
            notes: notes.trim() || null,
            valid_until: validUntil || null,
            due_date: dueDate || null,
          });
        }}
        className="space-y-3"
      >
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Number *" value={number} onChange={(e) => setNumber(e.target.value)} required maxLength={60} />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{config.statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <Input placeholder="Customer name *" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} />
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} maxLength={120} />
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200} />
        </div>
        {config.extraFields?.includes("valid_until") && (
          <div>
            <label className="text-xs text-muted-foreground">Valid until</label>
            <Input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
          </div>
        )}
        {config.extraFields?.includes("due_date") && (
          <div>
            <label className="text-xs text-muted-foreground">Due date</label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        )}

        <div className="border border-border/60 rounded-md p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Line items</div>
            <Button type="button" size="sm" variant="outline" onClick={addItem}><Plus className="h-3 w-3 mr-1" />Add</Button>
          </div>
          {items.map((it, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center">
              <Input className="col-span-6" placeholder="Description" value={it.description} onChange={(e) => updateItem(idx, { description: e.target.value })} maxLength={200} />
              <Input className="col-span-2" type="number" min="0" step="1" placeholder="Qty" value={it.qty} onChange={(e) => updateItem(idx, { qty: Number(e.target.value) })} />
              <Input className="col-span-3" type="number" min="0" step="0.01" placeholder="Price" value={it.price} onChange={(e) => updateItem(idx, { price: Number(e.target.value) })} />
              <Button type="button" size="icon" variant="ghost" className="col-span-1 h-8 w-8" onClick={() => removeItem(idx)}><X className="h-3.5 w-3.5" /></Button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs text-muted-foreground">Currency</label>
            <Input value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} maxLength={3} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Tax %</label>
            <Input type="number" min="0" step="0.01" value={taxPct} onChange={(e) => setTaxPct(e.target.value)} />
          </div>
          <div className="text-right self-end">
            <div className="text-xs text-muted-foreground">Subtotal: {currency} {subtotal.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Tax: {currency} {tax.toLocaleString()}</div>
            <div className="text-base font-bold">Total: {currency} {total.toLocaleString()}</div>
          </div>
        </div>

        <Textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={2000} rows={3} />
        <DialogFooter>
          <Button type="submit" disabled={submitting} className="gradient-primary text-primary-foreground border-0">
            {submitting ? "Saving…" : initial ? "Save changes" : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
