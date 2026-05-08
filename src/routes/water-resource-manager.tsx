import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/water-resource-manager")({
  head: () => ({ meta: [{ title: "Water Resource Manager — SaaS Vala" }, { name: "description", content: "Water resource management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: waterData, isLoading, error } = useQuery({
    queryKey: ["water-resource-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Water Resource Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Water Resource Manager" subtitle="Water resource management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Water Resource Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Water Supplied", value: "45M gal", delta: "+2M gal", up: true },
    { label: "Water Quality", value: "99.8%", delta: "+0.1%", up: true },
    { label: "Leakage Rate", value: "8%", delta: "-1%", up: true },
    { label: "Storage Level", value: "78%", delta: "+5%", up: true },
  ];

  const columns = [
    { key: "source", label: "Water Source" },
    { key: "capacity", label: "Daily Capacity" },
    { key: "quality", label: "Quality Score" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { source: "Reservoir A", capacity: "15M gal", quality: "99.5%", status: "Active" },
    { source: "Treatment Plant B", capacity: "20M gal", quality: "99.8%", status: "Active" },
    { source: "Well Field C", capacity: "8M gal", quality: "99.2%", status: "Active" },
    { source: "River Intake D", capacity: "12M gal", quality: "98.5%", status: "Standby" },
    { source: "Desalination E", capacity: "5M gal", quality: "99.9%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Water Resource Manager" subtitle="Water resource management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
