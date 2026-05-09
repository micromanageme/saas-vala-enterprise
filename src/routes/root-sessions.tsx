import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-sessions")({
  head: () => ({ meta: [{ title: "Global Session Command Center — Universal Access Admin" }, { name: "description", content: "Active sessions, forced logout, hijack detection" }] }),
  component: Page,
});

function Page() {
  const { data: sessionData, isLoading, error } = useQuery({
    queryKey: ["root-sessions"],
    queryFn: async () => {
      const response = await fetch("/api/root/session-command?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch session command data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Global Session Command Center" subtitle="Active sessions, forced logout, hijack detection" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Global Session Command Center data</div>
      </AppShell>
    );
  }

  const data = sessionData?.data;
  const sessions = data?.sessions || [];
  const hijack = data?.hijackDetection;

  const kpis = hijack ? [
    { label: "Active Sessions", value: sessions.length.toString(), delta: "—", up: true },
    { label: "Suspicious Logins", value: hijack.suspiciousLogins.toString(), delta: "—", up: hijack.suspiciousLogins === 0 },
    { label: "Concurrent", value: hijack.concurrentSessions.toString(), delta: "—", up: true },
    { label: "Unusual Locations", value: hijack.unusualLocations.toString(), delta: "—", up: hijack.unusualLocations === 0 },
  ];

  const columns = [
    { key: "user", label: "User" },
    { key: "ipAddress", label: "IP Address" },
    { key: "device", label: "Device" },
    { key: "isActive", label: "Active" },
    { key: "createdAt", label: "Created" },
  ];

  const rows = sessions.slice(0, 20).map((s: any) => ({
    user: s.user,
    ipAddress: s.ipAddress,
    device: s.device,
    isActive: s.isActive ? "Yes" : "No",
    createdAt: new Date(s.createdAt).toLocaleString(),
  }));

  return (
    <AppShell>
      <ModulePage title="Global Session Command Center" subtitle="Active sessions, forced logout, hijack detection" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
