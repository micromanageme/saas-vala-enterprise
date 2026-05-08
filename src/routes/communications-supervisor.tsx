import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/communications-supervisor")({
  head: () => ({ meta: [{ title: "Communications Supervisor — SaaS Vala" }, { name: "description", content: "Communications supervision workspace" }] }),
  component: Page,
});

function Page() {
  const { data: commData, isLoading, error } = useQuery({
    queryKey: ["communications-supervisor-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Communications Supervisor data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Communications Supervisor" subtitle="Communications supervision workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Communications Supervisor data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Channels Managed", value: "45", delta: "+5", up: true },
    { label: "Messages Processed", value: "1.2M", delta: "+150K", up: true },
    { label: "Quality Score", value: "96%", delta: "+2%", up: true },
    { label: "Latency", value: "25ms", delta: "-5ms", up: true },
  ];

  const columns = [
    { key: "channel", label: "Communication Channel" },
    { key: "type", label: "Type" },
    { key: "volume", label: "Daily Volume" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { channel: "CH-001", type: "Voice", volume: "500K", status: "Active" },
    { channel: "CH-002", type: "Data", volume: "700K", status: "Active" },
    { channel: "CH-003", type: "Video", volume: "300K", status: "Active" },
    { channel: "CH-004", type: "SMS", volume: "100K", status: "Active" },
    { channel: "CH-005", type: "Email", volume: "50K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Communications Supervisor" subtitle="Communications supervision workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
