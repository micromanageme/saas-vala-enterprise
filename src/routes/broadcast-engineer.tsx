import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/broadcast-engineer")({
  head: () => ({ meta: [{ title: "Broadcast Engineer — SaaS Vala" }, { name: "description", content: "Broadcast engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: broadcastData, isLoading, error } = useQuery({
    queryKey: ["broadcast-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Broadcast Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Broadcast Engineer" subtitle="Broadcast engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Broadcast Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Transmissions", value: "450", delta: "+25", up: true },
    { label: "Signal Quality", value: "99.2%", delta: "+0.3%", up: true },
    { label: "Equipment Uptime", value: "99.8%", delta: "+0.1%", up: true },
    { label: "Technical Issues", value: "2", delta: "-1", up: true },
  ];

  const columns = [
    { key: "equipment", label: "Broadcast Equipment" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "location", label: "Location" },
  ];

  const rows = [
    { equipment: "TX-001", type: "Transmitter", status: "Online", location: "Main Tower" },
    { equipment: "TX-002", type: "Transmitter", status: "Standby", location: "Backup Tower" },
    { equipment: "MX-003", type: "Mixer", status: "Online", location: "Control Room" },
    { equipment: "SR-004", type: "Satellite Receiver", status: "Online", location: "Satellite Farm" },
    { equipment: "EN-005", type: "Encoder", status: "Maintenance", location: "Server Room" },
  ];

  return (
    <AppShell>
      <ModulePage title="Broadcast Engineer" subtitle="Broadcast engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
