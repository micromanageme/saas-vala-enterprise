// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/command-authority-board")({
  head: () => ({ meta: [{ title: "Command Authority Board — SaaS Vala" }, { name: "description", content: "Command authority board workspace" }] }),
  component: Page,
});

function Page() {
  const { data: authorityData, isLoading, error, refetch } = useQuery({
    queryKey: ["command-authority-board-dashboard"],
    queryFn: async () => {
      const response = fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Command Authority Board data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Command Authority Board" subtitle="Command authority board workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Command Authority Board"
          subtitle="Command authority board workspace"
          message="We couldn't load Command Authority Board data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Commands Authorized", value: "75", delta: "+8", up: true },
    { label: "Approvals", value: "95%", delta: "+2%", up: true },
    { key: "veto", label: "Vetoes", value: "3", delta: "-1", up: true },
    { label: "Response Time", value: "1 hour", delta: "-15min", up: true },
  ];

  const columns = [
    { key: "command", label: "Command Authority" },
    { key: "type", label: "Type" },
    { key: "authority", label: "Authority Level" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { command: "CMD-001", type: "Emergency", authority: "Full", status: "Active" },
    { command: "CMD-002", type: "Standard", authority: "Partial", status: "Active" },
    { command: "CMD-003", type: "Emergency", authority: "Full", status: "In Review" },
    { command: "CMD-004", type: "Standard", authority: "Partial", status: "Active" },
    { command: "CMD-005", type: "Emergency", authority: "Full", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Command Authority Board" subtitle="Command authority board workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
