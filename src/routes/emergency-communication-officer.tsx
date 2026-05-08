import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/emergency-communication-officer")({
  head: () => ({ meta: [{ title: "Emergency Communication Officer — SaaS Vala" }, { name: "description", content: "Emergency communication workspace" }] }),
  component: Page,
});

function Page() {
  const { data: commData, isLoading, error } = useQuery({
    queryKey: ["emergency-communication-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Emergency Communication Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Emergency Communication Officer" subtitle="Emergency communication workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Emergency Communication Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Calls Handled", value: "250", delta: "+30", up: true },
    { label: "Alerts Sent", value: "5K", delta: "+500", up: true },
    { label: "System Uptime", value: "99.9%", delta: "+0.1%", up: true },
    { label: "Response Accuracy", value: "98%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "channel", label: "Communication Channel" },
    { key: "type", label: "Type" },
    { key: "volume", label: "Volume" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { channel: "CH-001", type: "Radio", volume: "80", status: "Active" },
    { channel: "CH-002", type: "Phone", volume: "120", status: "Active" },
    { channel: "CH-003", type: "SMS", volume: "2K", status: "Active" },
    { channel: "CH-004", type: "Satellite", volume: "50", status: "Standby" },
    { channel: "CH-005", type: "Email", volume: "30", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Emergency Communication Officer" subtitle="Emergency communication workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
