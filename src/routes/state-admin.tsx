import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/state-admin")({
  head: () => ({ meta: [{ title: "State Admin — SaaS Vala" }, { name: "description", content: "State-level administration" }] }),
  component: Page,
});

function Page() {
  const { data: stateData, isLoading, error } = useQuery({
    queryKey: ["state-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch State Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="State Admin" subtitle="State-level administration" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load State Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Total Cities", value: "8", delta: "+1", up: true },
    { label: "Total Users", value: "234", delta: "+12", up: true },
    { label: "State Revenue", value: "$450K", delta: "+8%", up: true },
    { label: "Active Projects", value: "5", delta: "+1", up: true },
  ];

  const columns = [
    { key: "city", label: "City" },
    { key: "users", label: "Users" },
    { key: "revenue", label: "Revenue" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { city: "Manhattan", users: "89", revenue: "$180K", status: "Active" },
    { city: "Brooklyn", users: "56", revenue: "$95K", status: "Active" },
    { city: "Queens", users: "45", revenue: "$78K", status: "Active" },
    { city: "Bronx", users: "28", revenue: "$52K", status: "Active" },
    { city: "Staten Island", users: "16", revenue: "$45K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="State Admin" subtitle="State-level administration" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
