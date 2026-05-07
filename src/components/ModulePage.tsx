import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Download, Filter, Search, TrendingUp, TrendingDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type Kpi = { label: string; value: string; delta?: string; up?: boolean };
export type Column = { key: string; label: string };
export type Row = Record<string, string | number>;

export function ModulePage({
  title, subtitle, kpis = [], columns = [], rows = [], extra,
}: {
  title: string; subtitle: string;
  kpis?: Kpi[]; columns?: Column[]; rows?: Row[]; extra?: ReactNode;
}) {
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
          {kpis.map((k) => (
            <Card key={k.label} className="gradient-card border-border/60 shadow-elegant hover-scale">
              <CardContent className="p-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</div>
                <div className="mt-2 text-2xl font-bold text-gradient">{k.value}</div>
                {k.delta && (
                  <div className={`mt-1 flex items-center gap-1 text-xs ${k.up ? "text-success" : "text-destructive"}`}>
                    {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {k.delta}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
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
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
              <CardTitle className="text-base">Records</CardTitle>
              <div className="relative w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search…" className="pl-9 h-8 bg-input/50" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {rows.length ? (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      {columns.map((c) => <TableHead key={c.key}>{c.label}</TableHead>)}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((r, i) => (
                      <TableRow key={i} className="hover:bg-primary/5">
                        {columns.map((c) => <TableCell key={c.key}>{r[c.key]}</TableCell>)}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-10 text-center text-sm text-muted-foreground">
                  No records yet. Click <span className="text-primary font-medium">New</span> to create one.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kanban" className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            {["New", "In Progress", "Done"].map((s) => (
              <Card key={s} className="gradient-card border-border/60 min-h-48">
                <CardHeader className="pb-2"><CardTitle className="text-sm">{s}</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground">
                  Drag records here.
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <Card className="gradient-card border-border/60">
            <CardContent className="p-6 text-sm text-muted-foreground">
              Live enterprise reports for {title} will render here.
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
