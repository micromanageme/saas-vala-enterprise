import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/installation-engineer")({
  head: () => ({ meta: [{ title: "Installation Engineer — SaaS Vala" }, { name: "description", content: "Installation engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: installData, isLoading, error } = useQuery({
    queryKey: ["installation-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Installation Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Installation Engineer" subtitle="Installation engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Installation Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Installations Completed", value: "85", delta: "+10", up: true },
    { label: "Success Rate", value: "96%", delta: "+2%", up: true },
    { label: "Average Time", value: "4h", delta: "-30min", up: true },
    { label: "Customer Rating", value: "4.7/5", delta: "+0.1", up: true },
  ];

  const columns = [
    { key: "installation", label: "Installation ID" },
    { key: "type", label: "Type" },
    { key: "location", label: "Location" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { installation: "INST-001", type: "Equipment", location: "Site A", status: "Completed" },
    { installation: "INST-002", type: "Software", location: "Site B", status: "In Progress" },
    { installation: "INST-003", type: "Hardware", location: "Site C", status: "Scheduled" },
    { installation: "INST-004", type: "Network", location: "Site D", status: "Completed" },
    { installation: "INST-005", type: "Equipment", location: "Site E", status: "In Progress" },
  ];

  return (
    <AppShell>
      <ModulePage title="Installation Engineer" subtitle="Installation engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
