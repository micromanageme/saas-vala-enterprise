import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/service-mesh-admin")({
  head: () => ({ meta: [{ title: "Service Mesh Admin — SaaS Vala" }, { name: "description", content: "Service mesh administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: meshData, isLoading, error } = useQuery({
    queryKey: ["service-mesh-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Service Mesh Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Service Mesh Admin" subtitle="Service mesh administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Service Mesh Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Mesh Services", value: "100", delta: "+10", up: true },
    { label: "mTLS Coverage", value: "95%", delta: "+2%", up: true },
    { label: "Traffic Managed", value: "50TB", delta: "+5TB", up: true },
    { label: "Observability", value: "98%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "service", label: "Mesh Service" },
    { key: "protocol", label: "Protocol" },
    { key: "rps", label: "RPS" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { service: "MESH-001", protocol: "HTTP", rps: "5000", status: "Healthy" },
    { service: "MESH-002", protocol: "gRPC", rps: "3000", status: "Healthy" },
    { service: "MESH-003", protocol: "HTTP", rps: "4000", status: "Healthy" },
    { service: "MESH-004", protocol: "TCP", rps: "2000", status: "Degraded" },
    { service: "MESH-005", protocol: "HTTP", rps: "3500", status: "Healthy" },
  ];

  return (
    <AppShell>
      <ModulePage title="Service Mesh Admin" subtitle="Service mesh administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
