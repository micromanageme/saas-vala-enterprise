import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — SaaS Vala" }, { name: "description", content: "System alerts & inbox" }] }),
  component: Page,
});

function Page() {
  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await fetch("/api/notifications");
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      return response.json();
    },
  });

  const notifications = notificationsData?.notifications || [];
  const unreadCount = notificationsData?.unreadCount || 0;
  
  const kpis = [
    { label: "Unread", value: unreadCount.toString(), delta: "—", up: true },
    { label: "Today", value: notifications.length.toString(), delta: "+22", up: true },
    { label: "Channels", value: "5", delta: "—", up: true },
    { label: "Failed", value: "0", delta: "—", up: true }
  ];
  
  const columns = [{ key: "ts", label: "Time" }, { key: "title", label: "Title" }, { key: "type", label: "Type" }, { key: "status", label: "Status" }];
  const rows = notifications.slice(0, 10).map((n: any) => ({
    "ts": new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    "title": n.title,
    "type": n.type,
    "status": n.readAt ? "Read" : "Unread"
  }));

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Notifications" subtitle="System alerts & inbox" kpis={kpis} columns={columns} rows={[]} />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ModulePage title="Notifications" subtitle="System alerts & inbox" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
