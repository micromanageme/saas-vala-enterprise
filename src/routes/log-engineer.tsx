import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/log-engineer")({
  head: () => ({ meta: [{ title: "Log Engineer — SaaS Vala" }, { name: "description", content: "Log engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: logData, isLoading, error } = useQuery({
    queryKey: ["log-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Log Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Log Engineer" subtitle="Log engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Log Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Logs/Day", value: "125M", delta: "+25M", up: true },
    { label: "Retention Period", value: "30 days", delta: "—", up: true },
    { label: "Index Health", value: "98%", delta: "+1%", up: true },
    { label: "Queries/Day", value: "45K", delta: "+8K", up: true },
  ];

  const columns = [
    { key: "source", label: "Log Source" },
    { key: "volume", label: "Volume/Day" },
    { key: "retention", label: "Retention" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { source: "Application Logs", volume: "85M", retention: "30 days", status: "Active" },
    { source: "Access Logs", volume: "25M", retention: "90 days", status: "Active" },
    { source: "Error Logs", volume: "5M", retention: "180 days", status: "Active" },
    { source: "Audit Logs", volume: "8M", retention: "365 days", status: "Active" },
    { source: "Security Logs", volume: "2M", retention: "365 days", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Log Engineer" subtitle="Log engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
