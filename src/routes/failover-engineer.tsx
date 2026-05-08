import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/failover-engineer")({
  head: () => ({ meta: [{ title: "Failover Engineer — SaaS Vala" }, { name: "description", content: "Failover engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: failoverData, isLoading, error } = useQuery({
    queryKey: ["failover-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Failover Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Failover Engineer" subtitle="Failover engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Failover Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Failover Time", value: "30s", delta: "-10s", up: true },
    { label: "DR Readiness", value: "98%", delta: "+2%", up: true },
    { label: "Active Regions", value: "5", delta: "+1", up: true },
    { label: "RPO", value: "5min", delta: "-2min", up: true },
  ];

  const columns = [
    { key: "system", label: "System" },
    { key: "primary", label: "Primary Region" },
    { key: "secondary", label: "Secondary Region" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { system: "API Gateway", primary: "us-east-1", secondary: "us-west-2", status: "Active" },
    { system: "Database Cluster", primary: "us-east-1", secondary: "eu-west-1", status: "Active" },
    { system: "Cache Layer", primary: "us-east-1", secondary: "ap-southeast-1", status: "Active" },
    { system: "Object Storage", primary: "us-east-1", secondary: "Global", status: "Active" },
    { system: "Message Queue", primary: "us-east-1", secondary: "us-west-2", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Failover Engineer" subtitle="Failover engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
