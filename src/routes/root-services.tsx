import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-services")({
  head: () => ({ meta: [{ title: "Universal Service Registry — Universal Access Admin" }, { name: "description", content: "Microservices, dependency registry, and service discovery" }] }),
  component: Page,
});

function Page() {
  const { data: serviceData, isLoading, error } = useQuery({
    queryKey: ["root-services"],
    queryFn: async () => {
      const response = await fetch("/api/root/service-registry?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch service registry data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Service Registry" subtitle="Microservices, dependency registry, and service discovery" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Service Registry data</div>
      </AppShell>
    );
  }

  const data = serviceData?.data;
  const microservices = data?.microservices || [];
  const discovery = data?.serviceDiscovery;

  const kpis = discovery ? [
    { label: "Total Services", value: discovery.totalServices.toString(), delta: "—", up: true },
    { label: "Healthy", value: discovery.healthyServices.toString(), delta: "—", up: true },
    { label: "Degraded", value: discovery.degradedServices.toString(), delta: "—", up: false },
    { label: "Failed", value: discovery.failedServices.toString(), delta: "—", up: discovery.failedServices === 0 },
  ] : [];

  const columns = [
    { key: "name", label: "Service" },
    { key: "version", label: "Version" },
    { key: "status", label: "Status" },
    { key: "dependencies", label: "Dependencies" },
    { key: "dependents", label: "Dependents" },
  ];

  const rows = microservices.map((ms: any) => ({
    name: ms.name,
    version: ms.version,
    status: ms.status,
    dependencies: ms.dependencies.join(", "),
    dependents: ms.dependents.join(", "),
  }));

  return (
    <AppShell>
      <ModulePage title="Universal Service Registry" subtitle="Microservices, dependency registry, and service discovery" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
