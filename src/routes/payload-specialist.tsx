import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/payload-specialist")({
  head: () => ({ meta: [{ title: "Payload Specialist — SaaS Vala" }, { name: "description", content: "Payload specialist workspace" }] }),
  component: Page,
});

function Page() {
  const { data: payloadData, isLoading, error } = useQuery({
    queryKey: ["payload-specialist-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Payload Specialist data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Payload Specialist" subtitle="Payload specialist workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Payload Specialist data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Payloads Managed", value: "45", delta: "+5", up: true },
    { label: "Deployments", value: "25", delta: "+3", up: true },
    { label: "Success Rate", value: "96%", delta: "+2%", up: true },
    { label: "Anomalies Detected", value: "2", delta: "-1", up: true },
  ];

  const columns = [
    { key: "payload", label: "Payload" },
    { key: "type", label: "Type" },
    { key: "mass", label: "Mass (kg)" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { payload: "PLD-001", type: "Satellite", mass: "1,200", status: "Deployed" },
    { payload: "PLD-002", type: "Experiment", mass: "450", status: "Active" },
    { payload: "PLD-003", type: "Cargo", mass: "5,000", status: "Delivered" },
    { payload: "PLD-004", type: "Probe", mass: "800", status: "In Transit" },
    { payload: "PLD-005", type: "Instrument", mass: "250", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Payload Specialist" subtitle="Payload specialist workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
