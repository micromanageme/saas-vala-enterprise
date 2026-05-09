import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/manufacturing")({
  head: () => ({ meta: [{ title: "Manufacturing — SaaS Vala" }, { name: "description", content: "BoM, MO & work centers" }] }),
  component: Page,
});

function Page() {
  const { data: manufacturingData, isLoading, error } = useQuery({
    queryKey: ["manufacturing"],
    queryFn: async () => {
      const response = await fetch("/api/manufacturing?type=all");
      if (!response.ok) throw new Error("Failed to fetch Manufacturing data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Manufacturing" subtitle="BoM, MO & work centers" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Manufacturing data</div>
      </AppShell>
    );
  }

  const data = manufacturingData?.data;
  const kpis = data?.kpis ? [
    { label: "Open MOs", value: data.kpis.openMOs.toString(), delta: `+${data.kpis.openMOsDelta}`, up: data.kpis.openMOsDelta > 0 },
    { label: "Completed", value: data.kpis.completed.toString(), delta: `+${data.kpis.completedDelta}`, up: data.kpis.completedDelta > 0 },
    { label: "Throughput", value: `${data.kpis.throughput}%`, delta: `+${data.kpis.throughputDelta}%`, up: data.kpis.throughputDelta > 0 },
    { label: "Scrap", value: `${data.kpis.scrap}%`, delta: `${data.kpis.scrapDelta}%`, up: data.kpis.scrapDelta < 0 }
  ] : [];

  const columns = [{ key: "id", label: "MO #" }, { key: "product", label: "Product" }, { key: "qty", label: "Qty" }, { key: "status", label: "Status" }];
  const rows = data?.orders?.map((o: any) => ({
    id: o.id,
    product: o.product,
    qty: o.qty.toString(),
    status: o.status
  })) || [];

  return (
    <AppShell>
      <ModulePage title="Manufacturing" subtitle="BoM, MO & work centers" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
