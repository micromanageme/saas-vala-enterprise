import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/tower-operations-manager")({
  head: () => ({ meta: [{ title: "Tower Operations Manager — SaaS Vala" }, { name: "description", content: "Tower operations management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: towerData, isLoading, error } = useQuery({
    queryKey: ["tower-operations-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Tower Operations Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Tower Operations Manager" subtitle="Tower operations management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Tower Operations Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Towers Managed", value: "85", delta: "+5", up: true },
    { label: "Uptime", value: "99.8%", delta: "+0.1%", up: true },
    { label: "Maintenance", value: "95%", delta: "+2%", up: true },
    { label: "Power Efficiency", value: "88%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "tower", label: "Tower" },
    { key: "height", label: "Height (m)" },
    { key: "tenants", label: "Tenants" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { tower: "TWR-001", height: "50", tenants: "5", status: "Active" },
    { tower: "TWR-002", height: "80", tenants: "8", status: "Active" },
    { tower: "TWR-003", height: "60", tenants: "6", status: "Active" },
    { tower: "TWR-004", height: "100", tenants: "10", status: "Maintenance" },
    { tower: "TWR-005", height: "70", tenants: "7", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Tower Operations Manager" subtitle="Tower operations management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
