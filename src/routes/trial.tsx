import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/trial")({
  head: () => ({ meta: [{ title: "Trial Dashboard — SaaS Vala" }, { name: "description", content: "Trial user portal" }] }),
  component: Page,
});

function Page() {
  const { data: trialData, isLoading, error } = useQuery({
    queryKey: ["trial-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Trial data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Trial Dashboard" subtitle="Trial user portal" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Trial data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Trial Days Left", value: "28", delta: "—", up: true },
    { label: "Features Used", value: "8/15", delta: "+3", up: true },
    { label: "Data Processed", value: "5.6K", delta: "+2K", up: true },
    { label: "Conversion Progress", value: "65%", delta: "+15%", up: true },
  ];

  const columns = [
    { key: "feature", label: "Feature" },
    { key: "usage", label: "Usage" },
    { key: "limit", label: "Limit" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { feature: "API Calls", usage: "4500", limit: "10000", status: "Active" },
    { feature: "Storage", usage: "2.5GB", limit: "10GB", status: "Active" },
    { feature: "Users", usage: "8", limit: "15", status: "Active" },
    { feature: "Projects", usage: "5", limit: "10", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Trial Dashboard" subtitle="Trial user portal" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
