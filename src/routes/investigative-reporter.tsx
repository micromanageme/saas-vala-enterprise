import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/investigative-reporter")({
  head: () => ({ meta: [{ title: "Investigative Reporter — SaaS Vala" }, { name: "description", content: "Investigative reporting workspace" }] }),
  component: Page,
});

function Page() {
  const { data: investigativeData, isLoading, error, refetch } = useQuery({
    queryKey: ["investigative-reporter-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Investigative Reporter data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Investigative Reporter" subtitle="Investigative reporting workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Investigative Reporter"
          subtitle="Investigative reporting workspace"
          message="We couldn't load Investigative Reporter data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Investigations", value: "5", delta: "+1", up: true },
    { label: "Sources Developed", value: "45", delta: "+8", up: true },
    { label: "Documents Reviewed", value: "2.5K", delta: "+300", up: true },
    { label: "Stories Published", value: "8", delta: "+2", up: true },
  ];

  const columns = [
    { key: "investigation", label: "Investigation" },
    { key: "duration", label: "Duration" },
    { key: "sources", label: "Sources" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { investigation: "INV-001", duration: "45 days", sources: "12", status: "Active" },
    { investigation: "INV-002", duration: "30 days", sources: "8", status: "Review" },
    { investigation: "INV-003", duration: "60 days", sources: "15", status: "Active" },
    { investigation: "INV-004", duration: "15 days", sources: "5", status: "Planning" },
    { investigation: "INV-005", duration: "90 days", sources: "20", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Investigative Reporter" subtitle="Investigative reporting workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
