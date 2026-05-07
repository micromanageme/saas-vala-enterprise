import { ReactNode, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Download, Filter, Search, TrendingUp, TrendingDown, Columns3, Rows3, RefreshCw, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Counter } from "./Counter";

export type Kpi = { label: string; value: string; delta?: string; up?: boolean };
export type Column = { key: string; label: string };
export type Row = Record<string, string | number>;

function parseKpiNumber(v: string): { n: number; prefix: string; suffix: string } {
  const m = v.match(/^([^\d-]*)([\d,.\-]+)(.*)$/);
  if (!m) return { n: 0, prefix: "", suffix: v };
  return { prefix: m[1] || "", n: Number(m[2].replace(/,/g, "")) || 0, suffix: m[3] || "" };
}

export function ModulePage({
  title, subtitle, kpis = [], columns = [], rows = [], extra,
}: {
  title: string; subtitle: string;
  kpis?: Kpi[]; columns?: Column[]; rows?: Row[]; extra?: ReactNode;
}) {
  const [selected, setSelected] = useState<number[]>([]);
  const [density, setDensity] = useState<"compact" | "normal">("normal");
  const [q, setQ] = useState("");
  const filtered = rows.filter((r) =>
    !q || Object.values(r).some((v) => String(v).toLowerCase().includes(q.toLowerCase()))
  );
  const allChecked = filtered.length > 0 && selected.length === filtered.length;
  const padCell = density === "compact" ? "py-1.5" : "py-3";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <Badge variant="outline" className="border-primary/40 text-primary">Enterprise</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-1" />Filter</Button>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Export</Button>
          <Button size="sm" className="gradient-primary text-primary-foreground border-0 shadow-glow">
            <Plus className="h-4 w-4 mr-1" />New
          </Button>
        </div>
      </div>

      {kpis.length > 0 && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => {
            const parsed = parseKpiNumber(k.value);
            const numeric = parsed.n > 0;
            return (
              <Card key={k.label} className="gradient-card border-border/60 shadow-elegant hover-scale relative overflow-hidden group">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full gradient-primary opacity-10 blur-2xl group-hover:opacity-30 transition-opacity" />
                <CardContent className="p-4 relative">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</div>
                  <div className="mt-2 text-2xl font-bold text-gradient">
                    {numeric ? <Counter value={parsed.n} prefix={parsed.prefix} suffix={parsed.suffix} /> : k.value}
                  </div>
                  {k.delta && (
                    <div className={`mt-1 flex items-center gap-1 text-xs ${k.up ? "text-success" : "text-destructive"}`}>
                      {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {k.delta}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Tabs defaultValue="list">
        <TabsList className="bg-card/60">
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4">
          <Card className="gradient-card border-border/60">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3 flex-wrap">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Records</CardTitle>
                <Badge variant="outline" className="text-[10px]">{filtered.length}</Badge>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative w-56">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="pl-9 h-8 bg-input/50" />
                </div>
                <Button variant="ghost" size="sm" onClick={() => setDensity(density === "compact" ? "normal" : "compact")} title="Density">
                  {density === "compact" ? <Rows3 className="h-4 w-4" /> : <Columns3 className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm" title="Refresh"><RefreshCw className="h-4 w-4" /></Button>
              </div>
            </CardHeader>

            {selected.length > 0 && (
              <div className="mx-4 mb-3 flex items-center justify-between rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 animate-fade-in">
                <span className="text-xs"><b>{selected.length}</b> selected</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="h-7"><Download className="h-3 w-3 mr-1" />Export</Button>
                  <Button size="sm" variant="ghost" className="h-7 text-destructive"><Trash2 className="h-3 w-3 mr-1" />Delete</Button>
                </div>
              </div>
            )}

            <CardContent className="p-0">
              {filtered.length ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-card/95 backdrop-blur z-10">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-10">
                          <Checkbox checked={allChecked} onCheckedChange={(v) => setSelected(v ? filtered.map((_, i) => i) : [])} />
                        </TableHead>
                        {columns.map((c) => <TableHead key={c.key}>{c.label}</TableHead>)}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((r, i) => (
                        <TableRow key={i} className="hover:bg-primary/5 transition-colors">
                          <TableCell className={padCell}>
                            <Checkbox
                              checked={selected.includes(i)}
                              onCheckedChange={(v) => setSelected((s) => v ? [...s, i] : s.filter((x) => x !== i))}
                            />
                          </TableCell>
                          {columns.map((c) => <TableCell key={c.key} className={padCell}>{r[c.key]}</TableCell>)}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full gradient-primary opacity-30 mb-3">
                    <Search className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="text-sm text-muted-foreground">No records match.</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kanban" className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            {["New", "In Progress", "Done"].map((s, idx) => (
              <Card key={s} className="gradient-card border-border/60 min-h-48">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm">{s}</CardTitle>
                  <Badge variant="outline" className="text-[10px]">{filtered.length > 0 ? Math.ceil(filtered.length / 3) : 0}</Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  {filtered.slice(idx, idx + 2).map((r, i) => (
                    <div key={i} className="rounded-lg border border-border/60 bg-card/80 p-3 hover:border-primary/40 hover:shadow-glow transition cursor-grab">
                      <div className="text-sm font-medium">{Object.values(r)[0]}</div>
                      <div className="text-[11px] text-muted-foreground mt-1">{Object.values(r)[1]}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <Card className="gradient-card border-border/60">
            <CardContent className="p-6 text-sm text-muted-foreground">
              Live enterprise reports for {title} render here.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card className="gradient-card border-border/60">
            <CardContent className="p-6 text-sm text-muted-foreground">
              Module configuration for {title}.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {extra}
    </div>
  );
}
