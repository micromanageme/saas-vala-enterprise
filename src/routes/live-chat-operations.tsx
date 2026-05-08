import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/live-chat-operations")({
  head: () => ({ meta: [{ title: "Live Chat Operations — SaaS Vala" }, { name: "description", content: "Live chat operations workspace" }] }),
  component: Page,
});

function Page() {
  const { data: chatData, isLoading, error } = useQuery({
    queryKey: ["live-chat-operations-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Live Chat Operations data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Live Chat Operations" subtitle="Live chat operations workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Live Chat Operations data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Chats", value: "50", delta: "+5", up: true },
    { label: "Response Time", value: "30sec", delta: "-5sec", up: true },
    { label: "Satisfaction", value: "4.6/5", delta: "+0.1", up: true },
    { label: "CSAT Score", value: "92%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "agent", label: "Chat Agent" },
    { key: "chats", label: "Active Chats" },
    { key: "avg_time", label: "Avg Response" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { agent: "AGT-001", chats: "8", avg_time: "25sec", status: "Online" },
    { agent: "AGT-002", chats: "6", avg_time: "30sec", status: "Online" },
    { agent: "AGT-003", chats: "7", avg_time: "28sec", status: "In Chat" },
    { agent: "AGT-004", chats: "5", avg_time: "35sec", status: "Online" },
    { agent: "AGT-005", chats: "4", avg_time: "32sec", status: "Away" },
  ];

  return (
    <AppShell>
      <ModulePage title="Live Chat Operations" subtitle="Live chat operations workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
