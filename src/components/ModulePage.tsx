import { ReactNode, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Download, Filter, Search, TrendingUp, TrendingDown, Columns3, Rows3, RefreshCw, Trash2, Star, ListFilter, Group, ChevronLeft, ChevronRight, BarChart3, PieChart as PieIcon, Grid2x2, Table as TableIcon, KanbanSquare, CalendarDays, Activity as ActivityIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Counter } from "./Counter";
import { Chatter } from "./Chatter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";

export type Kpi = { label: string; value: string; delta?: string; up?: boolean };
export type Column = { key: string; label: string };
export type Row = Record<string, string | number>;

function parseKpiNumber(v: string): { n: number; prefix: string; suffix: string } {
  const m = v.match(/^([^\d-]*)([\d,.\-]+)(.*)$/);
  if (!m) return { n: 0, prefix: "", suffix: v };
  return { prefix: m[1] || "", n: Number(m[2].replace(/,/g, "")) || 0, suffix: m[3] || "" };
}

const STAGES = ["New", "Qualified", "Proposal", "Won"];

export function ModulePage({
  title, subtitle, kpis = [], columns = [], rows = [], extra,
}: {
  title: string; subtitle: string;
  kpis?: Kpi[]; columns?: Column[]; rows?: Row[]; extra?: ReactNode;
}) {
  const [selected, setSelected] = useState<number[]>([]);
  const [density, setDensity] = useState<"compact" | "normal">("normal");
  const [q, setQ] = useState("");
  const [stage, setStage] = useState(1);
  const [starred, setStarred] = useState(false);
  const filtered = rows.filter((r) =>
    !q || Object.values(r).some((v) => String(v).toLowerCase().includes(q.toLowerCase()))
  );
  const allChecked = filtered.length > 0 && selected.length === filtered.length;
  const padCell = density === "compact" ? "py-1.5" : "py-3";

  return (
    <div className="space-y-4">
      {/* Odoo-style breadcrumb action bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
        <div className="flex items-center gap-2 text-sm">
          <Button size="sm" variant="ghost" className="h-7 gradient-primary text-primary-foreground"><Plus className="h-3.5 w-3.5 mr-1" />New</Button>
          <span className="text-muted-foreground">{title}</span>
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <span className="font-medium">All records</span>
          <button onClick={() => setStarred(!starred)} className="ml-1">
            <Star className={`h-3.5 w-3.5 ${starred ? "fill-warning text-warning" : "text-muted-foreground"}`} />
          </button>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Button size="icon" variant="ghost" className="h-7 w-7"><ChevronLeft className="h-3.5 w-3.5" /></Button>
          <span>1-{Math.min(filtered.length, 80)} / {filtered.length || 0}</span>
          <Button size="icon" variant="ghost" className="h-7 w-7"><ChevronRight className="h-3.5 w-3.5" /></Button>
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <Badge variant="outline" className="border-primary/40 text-primary">Enterprise</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          {/* Smart buttons (Odoo) */}
          <div className="hidden md:flex items-center gap-1 rounded-lg border border-border/60 bg-card/60 p-1">
            {[{ n: 24, l: "Activities" }, { n: 12, l: "Documents" }, { n: 7, l: "Tasks" }].map((s) => (
              <button key={s.l} className="text-left px-3 py-1 rounded-md hover:bg-primary/10 transition">
                <div className="text-sm font-bold text-primary leading-none">{s.n}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Export</Button>
          <Button size="sm" className="gradient-primary text-primary-foreground border-0 shadow-glow">
            <Plus className="h-4 w-4 mr-1" />New
          </Button>
        </div>
      </div>

      {/* Odoo-style status bar */}
      <div className="flex items-center gap-0 rounded-lg border border-border/60 bg-card/60 p-1 overflow-x-auto">
        {STAGES.map((s, i) => (
          <button key={s} onClick={() => setStage(i)} className={`relative flex-1 min-w-24 text-xs px-4 py-2 transition ${i <= stage ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {i <= stage && <span className="absolute inset-0 gradient-primary rounded-md -z-0" />}
            <span className="relative z-10 font-medium">{s}</span>
          </button>
        ))}
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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TabsList className="bg-card/60">
            <TabsTrigger value="list"><TableIcon className="h-3.5 w-3.5 mr-1" />List</TabsTrigger>
            <TabsTrigger value="kanban"><KanbanSquare className="h-3.5 w-3.5 mr-1" />Kanban</TabsTrigger>
            <TabsTrigger value="pivot"><Grid2x2 className="h-3.5 w-3.5 mr-1" />Pivot</TabsTrigger>
            <TabsTrigger value="graph"><BarChart3 className="h-3.5 w-3.5 mr-1" />Graph</TabsTrigger>
            <TabsTrigger value="cohort"><PieIcon className="h-3.5 w-3.5 mr-1" />Cohort</TabsTrigger>
            <TabsTrigger value="calendar"><CalendarDays className="h-3.5 w-3.5 mr-1" />Calendar</TabsTrigger>
            <TabsTrigger value="activity"><ActivityIcon className="h-3.5 w-3.5 mr-1" />Activity</TabsTrigger>
          </TabsList>
          {/* Odoo-style filter / group / favorites */}
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><Filter className="h-3.5 w-3.5 mr-1" />Filters</Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass w-56">
                <DropdownMenuLabel>Filters</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem>My records</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Active only</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Created this week</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><Group className="h-3.5 w-3.5 mr-1" />Group By</Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass w-48">
                <DropdownMenuLabel>Group by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.slice(0, 4).map((c) => (
                  <DropdownMenuCheckboxItem key={c.key}>{c.label}</DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><Star className="h-3.5 w-3.5 mr-1" />Favorites</Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass w-56">
                <DropdownMenuLabel>Saved searches</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>★ My priority items</DropdownMenuItem>
                <DropdownMenuItem>★ This quarter</DropdownMenuItem>
                <DropdownMenuItem>★ High value</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Save current filter…</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><ListFilter className="h-3.5 w-3.5" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass w-48">
                <DropdownMenuLabel>Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.map((c) => <DropdownMenuCheckboxItem key={c.key} defaultChecked>{c.label}</DropdownMenuCheckboxItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

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
          <div className="grid gap-4 md:grid-cols-4">
            {STAGES.map((s, idx) => (
              <Card key={s} className="gradient-card border-border/60 min-h-48">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm">{s}</CardTitle>
                    <div className="text-[10px] text-muted-foreground">${(idx + 1) * 12}k</div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{Math.max(1, Math.floor(filtered.length / 4))}</Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  {filtered.slice(idx, idx + 3).map((r, i) => (
                    <div key={i} className="rounded-lg border border-border/60 bg-card/80 p-3 hover:border-primary/40 hover:shadow-glow transition cursor-grab">
                      <div className="text-sm font-medium">{Object.values(r)[0]}</div>
                      <div className="text-[11px] text-muted-foreground mt-1">{Object.values(r)[1]}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex -space-x-1">
                          {["AK", "RM", "JS"].slice(0, (i % 3) + 1).map((a) => (
                            <div key={a} className="h-5 w-5 rounded-full gradient-primary text-[8px] grid place-items-center text-primary-foreground ring-1 ring-card">{a}</div>
                          ))}
                        </div>
                        <Badge className="text-[9px] gradient-primary text-primary-foreground border-0">P{(i % 3) + 1}</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pivot" className="mt-4">
          <Card className="gradient-card border-border/60">
            <CardContent className="p-0 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dimension</TableHead>
                    {STAGES.map((s) => <TableHead key={s} className="text-right">{s}</TableHead>)}
                    <TableHead className="text-right font-bold">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {["Q1", "Q2", "Q3", "Q4"].map((q, i) => {
                    const vals = STAGES.map((_, j) => (i + 1) * (j + 2) * 7);
                    return (
                      <TableRow key={q} className="hover:bg-primary/5">
                        <TableCell className="font-medium">{q}</TableCell>
                        {vals.map((v, j) => <TableCell key={j} className="text-right tabular-nums">{v}</TableCell>)}
                        <TableCell className="text-right font-bold text-primary tabular-nums">{vals.reduce((a, b) => a + b, 0)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graph" className="mt-4">
          <Card className="gradient-card border-border/60">
            <CardContent className="p-6">
              <div className="flex items-end justify-around h-64 gap-3">
                {[42, 68, 55, 80, 92, 74, 88, 95, 70, 84, 99, 76].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition">{v}</div>
                    <div className="w-full gradient-primary rounded-t-md shadow-glow hover:opacity-90 transition" style={{ height: `${v}%` }} />
                    <div className="text-[10px] text-muted-foreground">{["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i]}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cohort" className="mt-4">
          <Card className="gradient-card border-border/60">
            <CardContent className="p-4 overflow-auto">
              <div className="grid grid-cols-[100px_repeat(8,1fr)] gap-1 text-[10px]">
                <div className="font-medium text-muted-foreground">Cohort</div>
                {Array.from({ length: 8 }).map((_, i) => <div key={i} className="text-center text-muted-foreground">W{i}</div>)}
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, r) => (
                  <>
                    <div key={m} className="font-medium pr-2">{m}</div>
                    {Array.from({ length: 8 }).map((_, c) => {
                      const v = Math.max(0, 100 - r * 8 - c * 6);
                      return (
                        <div key={c} className="aspect-square rounded grid place-items-center text-foreground" style={{ background: `oklch(0.72 0.19 295 / ${v / 100})` }}>
                          {v}%
                        </div>
                      );
                    })}
                  </>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="mt-4">
          <Card className="gradient-card border-border/60">
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-1 text-[10px] uppercase text-muted-foreground mb-2">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d} className="text-center py-1">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, i) => {
                  const day = i - 2;
                  const has = [3, 7, 12, 18, 24, 29].includes(day);
                  return (
                    <div key={i} className="aspect-square rounded-md border border-border/40 bg-card/40 p-1.5 text-[11px] hover:border-primary/40 transition">
                      <div className="text-muted-foreground">{day > 0 && day <= 31 ? day : ""}</div>
                      {has && <div className="mt-1 text-[9px] gradient-primary text-primary-foreground rounded px-1 truncate">Meeting</div>}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <Card className="gradient-card border-border/60">
            <CardContent className="p-0 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Record</TableHead>
                    <TableHead>Call</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Meeting</TableHead>
                    <TableHead>To Do</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.slice(0, 6).map((r, i) => (
                    <TableRow key={i} className="hover:bg-primary/5">
                      <TableCell className="font-medium">{Object.values(r)[0]}</TableCell>
                      {[0, 1, 2, 3].map((j) => (
                        <TableCell key={j}>
                          {(i + j) % 3 === 0 ? (
                            <div className="h-6 w-6 rounded-full gradient-primary grid place-items-center text-[10px] text-primary-foreground">●</div>
                          ) : (
                            <div className="h-6 w-6 rounded-full border border-dashed border-border/60" />
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Odoo-style Chatter panel */}
      <Chatter title={`${title} Chatter`} />

      {extra}
    </div>
  );
}
