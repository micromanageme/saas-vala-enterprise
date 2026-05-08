import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/global-operations-manager")({
  head: () => ({ meta: [{ title: "Global Operations Manager — SaaS Vala" }, { name: "description", content: "Global operations management" }] }),
  component: Page,
});

function Page() {
  const { data: globalOpsData, isLoading, error } = useQuery({
    queryKey: ["global-operations-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Global Operations Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Global Operations Manager" subtitle="Global operations management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Global Operations Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Facilities Managed", value: "45", delta: "+3", up: true },
    { label: "Cost Optimization", value: "12%", delta: "+3%", up: true },
    { label: "Resource Utilization", value: "82%", delta: "+5%", up: true },
    { label: "Vendor Performance", value: "94%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "region", label: "Region" },
    { key: "facilities", label: "Facilities" },
    { key: "budget", label: "Budget" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { region: "North America", facilities: "15", budget: "$5.2M", status: "On Budget" },
    { region: "Europe", facilities: "12", budget: "$3.8M", status: "On Budget" },
    { region: "Asia Pacific", facilities: "10", budget: "$2.5M", status: "Under Budget" },
    { region: "Latin America", facilities: "5", budget: "$1.2M", status: "On Budget" },
    { region: "Middle East", facilities: "3", budget: "$0.8M", status: "On Budget" },
  ];

  return (
    <AppShell>
      <ModulePage title="Global Operations Manager" subtitle="Global operations management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
