import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/machine-operations-supervisor")({
  head: () => ({ meta: [{ title: "Machine Operations Supervisor — SaaS Vala" }, { name: "description", content: "Machine operations supervision workspace" }] }),
  component: Page,
});

function Page() {
  const { data: opsData, isLoading, error } = useQuery({
    queryKey: ["machine-operations-supervisor-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Machine Operations Supervisor data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Machine Operations Supervisor" subtitle="Machine operations supervision workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Machine Operations Supervisor data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Machines", value: "45", delta: "+3", up: true },
    { label: "Production Rate", value: "92%", delta: "+2%", up: true },
    { label: "Downtime", value: "2.5%", delta: "-0.5%", up: true },
    { label: "OEE Score", value: "88%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "machine", label: "Machine" },
    { key: "operator", label: "Operator" },
    { key: "output", label: "Hourly Output" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { machine: "MC-001 (CNC)", operator: "John Smith", output: "120", status: "Running" },
    { machine: "MC-002 (Press)", operator: "Sarah Johnson", output: "95", status: "Running" },
    { machine: "MC-003 (Lathe)", operator: "Mike Brown", output: "110", status: "Running" },
    { machine: "MC-004 (Milling)", operator: "Emily Davis", output: "85", status: "Idle" },
    { machine: "MC-005 (Grinding)", operator: "Alex Wilson", output: "130", status: "Running" },
  ];

  return (
    <AppShell>
      <ModulePage title="Machine Operations Supervisor" subtitle="Machine operations supervision workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
