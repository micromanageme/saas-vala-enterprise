import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/shadow-system-detector")({
  head: () => ({ meta: [{ title: "Shadow System Detector — SaaS Vala" }, { name: "description", content: "Shadow system detection workspace" }] }),
  component: Page,
});

function Page() {
  const { data: shadowData, isLoading, error } = useQuery({
    queryKey: ["shadow-system-detector-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Shadow System Detector data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Shadow System Detector" subtitle="Shadow system detection workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Shadow System Detector data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Systems Scanned", value: "250", delta: "+25", up: true },
    { label: "Shadow Systems Found", value: "8", delta: "+2", up: true },
    { label: "Migration Rate", value: "75%", delta: "+5%", up: true },
    { label: "Risk Reduction", value: "85%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "system", label: "Shadow System" },
    { key: "owner", label: "Owner" },
    { key: "risk", label: "Risk Level" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { system: "SHD-001", owner: "Dept A", risk: "High", status: "In Migration" },
    { system: "SHD-002", owner: "Dept B", risk: "Medium", status: "Planning" },
    { system: "SHD-003", owner: "Dept C", risk: "High", status: "In Migration" },
    { system: "SHD-004", owner: "Dept D", risk: "Low", status: "Approved" },
    { system: "SHD-005", owner: "Dept E", risk: "Medium", status: "Planning" },
  ];

  return (
    <AppShell>
      <ModulePage title="Shadow System Detector" subtitle="Shadow system detection workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
