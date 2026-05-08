import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/civil-engineer")({
  head: () => ({ meta: [{ title: "Civil Engineer — SaaS Vala" }, { name: "description", content: "Civil engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: civilData, isLoading, error } = useQuery({
    queryKey: ["civil-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Civil Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Civil Engineer" subtitle="Civil engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Civil Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Projects Designed", value: "25", delta: "+3", up: true },
    { label: "Structural Analysis", value: "98%", delta: "+1%", up: true },
    { label: "Code Compliance", value: "100%", delta: "—", up: true },
    { label: "Approvals", value: "22", delta: "+2", up: true },
  ];

  const columns = [
    { key: "project", label: "Engineering Project" },
    { key: "type", label: "Type" },
    { key: "phase", label: "Phase" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { project: "ENG-001", type: "Bridge", phase: "Design", status: "In Progress" },
    { project: "ENG-002", type: "Road", phase: "Construction", status: "Active" },
    { project: "ENG-003", type: "Building", phase: "Review", status: "Pending" },
    { project: "ENG-004", type: "Dam", phase: "Design", status: "In Progress" },
    { project: "ENG-005", type: "Tunnel", phase: "Construction", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Civil Engineer" subtitle="Civil engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
