import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/franchise")({
  head: () => ({ meta: [{ title: "Franchise Dashboard — SaaS Vala" }, { name: "description", content: "Franchise portal" }] }),
  component: Page,
});

function Page() {
  const { data: franchiseData, isLoading, error } = useQuery({
    queryKey: ["franchise-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Franchise data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Franchise Dashboard" subtitle="Franchise portal" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Franchise data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Locations", value: "3", delta: "+1", up: true },
    { label: "Total Revenue", value: "$45K", delta: "+12%", up: true },
    { label: "Team Size", value: "18", delta: "+3", up: true },
    { label: "Performance", value: "92%", delta: "+2%", up: true },
  ] : [];

  const columns = [
    { key: "location", label: "Location" },
    { key: "revenue", label: "Revenue" },
    { key: "team", label: "Team" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { location: "New York", revenue: "$18K", team: "8", status: "Active" },
    { location: "Los Angeles", revenue: "$15K", team: "6", status: "Active" },
    { location: "Chicago", revenue: "$12K", team: "4", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Franchise Dashboard" subtitle="Franchise portal" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
