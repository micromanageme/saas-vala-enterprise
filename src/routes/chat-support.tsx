import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/chat-support")({
  head: () => ({ meta: [{ title: "Chat Support — SaaS Vala" }, { name: "description", content: "Chat support workspace" }] }),
  component: Page,
});

function Page() {
  const { data: chatData, isLoading, error } = useQuery({
    queryKey: ["chat-support-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Chat Support data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Chat Support" subtitle="Chat support workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Chat Support data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Chats", value: "5", delta: "+1", up: false },
    { label: "Chats Today", value: "45", delta: "+8", up: true },
    { label: "Avg Response", value: "30s", delta: "-5s", up: true },
    { label: "Satisfaction", value: "4.6/5", delta: "+0.1", up: true },
  ];

  const columns = [
    { key: "chat", label: "Chat" },
    { key: "customer", label: "Customer" },
    { key: "duration", label: "Duration" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { chat: "CHAT-001234", customer: "John Smith", duration: "5min", status: "Active" },
    { chat: "CHAT-001235", customer: "Sarah Johnson", duration: "12min", status: "Active" },
    { chat: "CHAT-001236", customer: "Mike Brown", duration: "3min", status: "Queued" },
    { chat: "CHAT-001237", customer: "Emily Davis", duration: "8min", status: "Active" },
    { chat: "CHAT-001238", customer: "Alex Wilson", duration: "15min", status: "Closed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Chat Support" subtitle="Chat support workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
