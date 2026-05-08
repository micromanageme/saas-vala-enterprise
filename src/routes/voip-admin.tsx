import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/voip-admin")({
  head: () => ({ meta: [{ title: "VoIP Admin — SaaS Vala" }, { name: "description", content: "VoIP administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: voipData, isLoading, error } = useQuery({
    queryKey: ["voip-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch VoIP Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="VoIP Admin" subtitle="VoIP administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load VoIP Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Calls Today", value: "5K", delta: "+500", up: true },
    { label: "Call Quality", value: "4.8/5", delta: "+0.1", up: true },
    { label: "Uptime", value: "99.9%", delta: "+0.1%", up: true },
    { label: "Active Lines", value: "200", delta: "+20", up: true },
  ];

  const columns = [
    { key: "extension", label: "Extension" },
    { key: "user", label: "User" },
    { key: "calls", label: "Calls Today" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { extension: "EXT-001", user: "User A", calls: "50", status: "Online" },
    { extension: "EXT-002", user: "User B", calls: "35", status: "Online" },
    { extension: "EXT-003", user: "User C", calls: "40", status: "In Call" },
    { extension: "EXT-004", user: "User D", calls: "25", status: "Offline" },
    { extension: "EXT-005", user: "User E", calls: "30", status: "Online" },
  ];

  return (
    <AppShell>
      <ModulePage title="VoIP Admin" subtitle="VoIP administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
