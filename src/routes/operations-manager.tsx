import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/operations-manager")({
  head: () => ({ meta: [{ title: "Operations Manager — SaaS Vala" }, { name: "description", content: "Operations management" }] }),
  component: Page,
});

function Page() {
  const { data: opsData, isLoading, error } = useQuery({
    queryKey: ["operations-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Operations Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Operations Manager" subtitle="Operations management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Operations Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Projects", value: "12", delta: "+2", up: true },
    { label: "Team Efficiency", value: "92%", delta: "+3%", up: true },
    { label: "On-Time Delivery", value: "95%", delta: "+2%", up: true },
    { label: "Resource Utilization", value: "85%", delta: "+5%", up: true },
  ];

  const columns = [
    { key: "project", label: "Project" },
    { key: "status", label: "Status" },
    { key: "deadline", label: "Deadline" },
    { key: "team", label: "Team" },
  ];

  const rows = [
    { project: "Q3 Expansion", status: "On Track", deadline: "Aug 15", team: "8" },
    { project: "Process Optimization", status: "In Progress", deadline: "Aug 30", team: "5" },
    { project: "Team Training", status: "Planning", deadline: "Sep 1", team: "12" },
    { project: "System Upgrade", status: "Complete", deadline: "Jul 31", team: "6" },
    { project: "Cost Reduction", status: "In Progress", deadline: "Aug 10", team: "4" },
  ];

  return (
    <AppShell>
      <ModulePage title="Operations Manager" subtitle="Operations management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
