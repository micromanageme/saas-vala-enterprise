import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/international-operations-lead")({
  head: () => ({ meta: [{ title: "International Operations Lead — SaaS Vala" }, { name: "description", content: "International operations workspace" }] }),
  component: Page,
});

function Page() {
  const { data: intlData, isLoading, error, refetch } = useQuery({
    queryKey: ["international-operations-lead-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch International Operations Lead data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="International Operations Lead" subtitle="International operations workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="International Operations Lead"
          subtitle="International operations workspace"
          message="We couldn't load International Operations Lead data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Countries Active", value: "30", delta: "+2", up: true },
    { label: "Regional Offices", value: "15", delta: "+1", up: true },
    { label: "Local Compliance", value: "95%", delta: "+2%", up: true },
    { label: "Global Revenue", value: "$12M", delta: "+$1.5M", up: true },
  ];

  const columns = [
    { key: "region", label: "International Region" },
    { key: "offices", label: "Offices" },
    { key: "revenue", label: "Revenue" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { region: "APAC", offices: "5", revenue: "$4M", status: "Active" },
    { region: "EMEA", offices: "6", revenue: "$5M", status: "Active" },
    { region: "LATAM", offices: "3", revenue: "$2M", status: "Active" },
    { region: "NAFTA", offices: "4", revenue: "$3.5M", status: "Active" },
    { region: "MENA", offices: "2", revenue: "$1M", status: "Expanding" },
  ];

  return (
    <AppShell>
      <ModulePage title="International Operations Lead" subtitle="International operations workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
