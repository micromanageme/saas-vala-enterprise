import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-nanotenant")({
  head: () => ({ meta: [{ title: "Nano Tenant Isolation Matrix — Universal Access Admin" }, { name: "description", content: "Cross-tenant leakage detection, tenant-state quarantine, permission bleed prevention" }] }),
  component: Page,
});

function Page() {
  const { data: tenantData, isLoading, error } = useQuery({
    queryKey: ["root-nanotenant"],
    queryFn: async () => {
      const response = await fetch("/api/root/nano-tenant-isolation?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch nano tenant isolation data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Nano Tenant Isolation Matrix" subtitle="Cross-tenant leakage detection, tenant-state quarantine, permission bleed prevention" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Nano Tenant Isolation Matrix data</div>
      </AppShell>
    );
  }

  const data = tenantData?.data;
  const leakage = data?.crossTenantLeakageDetection;
  const quarantine = data?.tenantStateQuarantine;

  const kpis = [
    { label: "Leakage Rate", value: leakage?.detectionRate || "0%", delta: "—", up: leakage?.detectionRate === '0' },
    { label: "Quarantine Rate", value: quarantine?.quarantineRate || "0%", delta: "—", up: quarantine?.quarantineRate === '0' },
    { label: "Isolation Accuracy", value: data?.isolatedCacheBoundaries?.isolationAccuracy || "0%", delta: "—", up: data?.isolatedCacheBoundaries?.isolationAccuracy === '100%' },
  ] : [];

  const rows = [
    { metric: "Total Checks", value: leakage?.totalChecks.toLocaleString() || "0", status: "OK" },
    { metric: "Total Tenants", value: quarantine?.totalTenants.toString() || "0", status: "OK" },
    { metric: "Isolated Permissions", value: data?.permissionBleedPrevention?.isolatedPermissions.toLocaleString() || "0", status: "OK" },
    { metric: "Isolated Keys", value: data?.isolatedCacheBoundaries?.isolatedKeys.toLocaleString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Nano Tenant Isolation Matrix" subtitle="Cross-tenant leakage detection, tenant-state quarantine, permission bleed prevention" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
