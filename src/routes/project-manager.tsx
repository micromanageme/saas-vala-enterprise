import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/project-manager")({
  head: () => ({ meta: [{ title: "Project Manager — SaaS Vala" }, { name: "description", content: "Project management" }] }),
  component: Page,
});

function Page() {
  const { data: projData, isLoading, error } = useQuery({
    queryKey: ["project-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Project Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Project Manager" subtitle="Project management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Project Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Projects", value: "12", delta: "+2", up: true },
    { label: "On Schedule", value: "83%", delta: "+5%", up: true },
    { label: "Budget Utilized", value: "78%", delta: "-3%", up: true },
    { label: "Team Capacity", value: "85%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "project", label: "Project" },
    { key: "manager", label: "Manager" },
    { key: "progress", label: "Progress" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { project: "Q3 Product Launch", manager: "John Smith", progress: "85%", status: "On Track" },
    { project: "Mobile App v2", manager: "Sarah Johnson", progress: "62%", status: "On Track" },
    { project: "API Gateway Upgrade", manager: "Mike Brown", progress: "45%", status: "At Risk" },
    { project: "Security Audit", manager: "Emily Davis", progress: "100%", status: "Complete" },
    { project: "Data Migration", manager: "Alex Wilson", progress: "28%", status: "On Track" },
  ];

  return (
    <AppShell>
      <ModulePage title="Project Manager" subtitle="Project management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
