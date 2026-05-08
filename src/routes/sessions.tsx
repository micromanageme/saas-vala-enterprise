import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/sessions")({
  head: () => ({ meta: [{ title: "Sessions — SaaS Vala" }, { name: "description", content: "Active user sessions" }] }),
  component: Page,
});

function Page() {
  const { data: sessionsData, isLoading } = useQuery({
    queryKey: ["admin-sessions"],
    queryFn: async () => {
      const response = await fetch("/api/admin/sessions");
      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }
      return response.json();
    },
  });

  const sessions = sessionsData?.sessions || [];
  const activeSessions = sessions.filter((s: any) => s.isActive).length;
  const totalSessions = sessions.length;
  const uniqueUsers = new Set(sessions.map((s: any) => s.userId)).size;
  
  const kpis = [
    { label: "Active", value: activeSessions.toString(), delta: "—", up: true },
    { label: "Total", value: totalSessions.toString(), delta: "—", up: true },
    { label: "Unique Users", value: uniqueUsers.toString(), delta: "—", up: true },
    { label: "Devices", value: uniqueUsers.toString(), delta: "—", up: true }
  ];
  
  const columns = [{ key: "user", label: "User" }, { key: "device", label: "Device" }, { key: "ip", label: "IP" }, { key: "since", label: "Since" }];
  const rows = sessions.slice(0, 10).map((s: any) => ({
    "user": s.user?.displayName || "Unknown",
    "device": s.device?.deviceName || s.userAgent?.substring(0, 20) || "Unknown",
    "ip": s.ipAddress,
    "since": new Date(s.createdAt).toLocaleString()
  }));

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Sessions" subtitle="Active user sessions" kpis={kpis} columns={columns} rows={[]} />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ModulePage title="Sessions" subtitle="Active user sessions" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
