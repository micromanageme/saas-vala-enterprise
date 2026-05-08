import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/launch-director")({
  head: () => ({ meta: [{ title: "Launch Director — SaaS Vala" }, { name: "description", content: "Launch direction workspace" }] }),
  component: Page,
});

function Page() {
  const { data: launchData, isLoading, error } = useQuery({
    queryKey: ["launch-director-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Launch Director data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Launch Director" subtitle="Launch direction workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Launch Director data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Launches Scheduled", value: "8", delta: "+2", up: true },
    { label: "Launch Success Rate", value: "98%", delta: "+1%", up: true },
    { label: "Pad Utilization", value: "75%", delta: "+5%", up: true },
    { label: "Safety Score", value: "100%", delta: "—", up: true },
  ];

  const columns = [
    { key: "launch", label: "Launch" },
    { key: "vehicle", label: "Launch Vehicle" },
    { key: "payload", label: "Payload" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { launch: "LCH-001", vehicle: "Falcon 9", payload: "Satellite", status: "Scheduled" },
    { launch: "LCH-002", vehicle: "Atlas V", payload: "Cargo", status: "In Progress" },
    { launch: "LCH-003", vehicle: "Ariane 5", payload: "Satellite", status: "Planning" },
    { launch: "LCH-004", vehicle: "Soyuz", payload: "Crew", status: "Standby" },
    { launch: "LCH-005", vehicle: "Electron", payload: "CubeSat", status: "Completed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Launch Director" subtitle="Launch direction workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
