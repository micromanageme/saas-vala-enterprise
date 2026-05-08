import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/message-delivery-analyst")({
  head: () => ({ meta: [{ title: "Message Delivery Analyst — SaaS Vala" }, { name: "description", content: "Message delivery analysis workspace" }] }),
  component: Page,
});

function Page() {
  const { data: deliveryData, isLoading, error } = useQuery({
    queryKey: ["message-delivery-analyst-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Message Delivery Analyst data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Message Delivery Analyst" subtitle="Message delivery analysis workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Message Delivery Analyst data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Messages Delivered", value: "200K", delta: "+20K", up: true },
    { label: "Delivery Success", value: "97%", delta: "+1%", up: true },
    { label: "Avg Latency", value: "500ms", delta: "-50ms", up: true },
    { label: "Failed Rate", value: "0.5%", delta: "-0.1%", up: true },
  ];

  const columns = [
    { key: "channel", label: "Delivery Channel" },
    { key: "volume", label: "Volume" },
    { key: "success", label: "Success Rate" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { channel: "CHN-001", volume: "50K", success: "98%", status: "Active" },
    { channel: "CHN-002", volume: "60K", success: "96%", status: "Active" },
    { channel: "CHN-003", volume: "40K", success: "99%", status: "Active" },
    { channel: "CHN-004", volume: "30K", success: "95%", status: "Degraded" },
    { channel: "CHN-005", volume: "20K", success: "97%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Message Delivery Analyst" subtitle="Message delivery analysis workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
