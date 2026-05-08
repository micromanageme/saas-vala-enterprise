import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/guest")({
  head: () => ({ meta: [{ title: "Guest Dashboard — SaaS Vala" }, { name: "description", content: "Guest portal" }] }),
  component: Page,
});

function Page() {
  const { data: guestData, isLoading, error } = useQuery({
    queryKey: ["guest-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Guest data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Guest Dashboard" subtitle="Guest portal" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Guest data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Trial Days Left", value: "14", delta: "—", up: true },
    { label: "Features Used", value: "5/10", delta: "+2", up: true },
    { label: "Data Processed", value: "1.2K", delta: "+500", up: true },
    { label: "Upgrade Eligible", value: "Yes", delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "feature", label: "Feature" },
    { key: "usage", label: "Usage" },
    { key: "limit", label: "Limit" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { feature: "API Calls", usage: "500", limit: "1000", status: "Active" },
    { feature: "Storage", usage: "250MB", limit: "1GB", status: "Active" },
    { feature: "Users", usage: "3", limit: "5", status: "Active" },
    { feature: "Projects", usage: "2", limit: "3", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Guest Dashboard" subtitle="Guest portal" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
