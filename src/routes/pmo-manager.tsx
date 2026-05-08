import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/pmo-manager")({
  head: () => ({ meta: [{ title: "PMO Manager — SaaS Vala" }, { name: "description", content: "Project Management Office" }] }),
  component: Page,
});

function Page() {
  const { data: pmoData, isLoading, error } = useQuery({
    queryKey: ["pmo-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch PMO Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="PMO Manager" subtitle="Project Management Office" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load PMO Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Projects", value: "23", delta: "+3", up: true },
    { label: "On-Time Delivery", value: "88%", delta: "+5%", up: true },
    { label: "Budget Variance", value: "-3%", delta: "+2%", up: true },
    { label: "Resource Utilization", value: "82%", delta: "+4%", up: true },
  ];

  const columns = [
    { key: "project", label: "Project" },
    { key: "manager", label: "Manager" },
    { key: "progress", label: "Progress" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { project: "Platform V2", manager: "John Smith", progress: "75%", status: "On Track" },
    { project: "Mobile App", manager: "Sarah Johnson", progress: "45%", status: "At Risk" },
    { project: "Data Migration", manager: "Mike Brown", progress: "90%", status: "On Track" },
    { project: "Security Upgrade", manager: "Emily Davis", progress: "60%", status: "On Track" },
    { project: "AI Integration", manager: "Alex Wilson", progress: "30%", status: "Delayed" },
  ];

  return (
    <AppShell>
      <ModulePage title="PMO Manager" subtitle="Project Management Office" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
