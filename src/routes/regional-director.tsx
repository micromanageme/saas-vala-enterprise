import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/regional-director")({
  head: () => ({ meta: [{ title: "Regional Director — SaaS Vala" }, { name: "description", content: "Regional leadership" }] }),
  component: Page,
});

function Page() {
  const { data: regionalData, isLoading, error } = useQuery({
    queryKey: ["regional-director-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Regional Director data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Regional Director" subtitle="Regional leadership" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Regional Director data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Branches Managed", value: "12", delta: "+1", up: true },
    { label: "Regional Revenue", value: "$2.1M", delta: "+$0.3M", up: true },
    { label: "Team Size", value: "145", delta: "+8", up: true },
    { label: "Growth Rate", value: "22%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "branch", label: "Branch" },
    { key: "revenue", label: "Revenue" },
    { key: "headcount", label: "Headcount" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { branch: "New York HQ", revenue: "$800K", headcount: "45", status: "Healthy" },
    { branch: "Boston", revenue: "$450K", headcount: "28", status: "Healthy" },
    { branch: "Chicago", revenue: "$380K", headcount: "25", status: "Healthy" },
    { branch: "Miami", revenue: "$280K", headcount: "22", status: "Healthy" },
    { branch: "Toronto", revenue: "$190K", headcount: "25", status: "Growing" },
  ];

  return (
    <AppShell>
      <ModulePage title="Regional Director" subtitle="Regional leadership" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
