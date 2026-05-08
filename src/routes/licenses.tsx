import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/licenses")({
  head: () => ({ meta: [{ title: "License System — SaaS Vala" }, { name: "description", content: "Issue & manage product licenses" }] }),
  component: Page,
});

function Page() {
  const { data: licensesData, isLoading, error } = useQuery({
    queryKey: ["licenses"],
    queryFn: async () => {
      const response = await fetch("/api/licenses?type=all");
      if (!response.ok) throw new Error("Failed to fetch Licenses data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="License System" subtitle="Issue & manage product licenses" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Licenses data</div>
      </AppShell>
    );
  }

  const data = licensesData?.data;
  const kpis = data?.kpis ? [
    { label: "Active", value: data.kpis.active.toString(), delta: `+${data.kpis.activeDelta}`, up: data.kpis.activeDelta > 0 },
    { label: "Total", value: data.kpis.total.toString(), delta: `+${data.kpis.totalDelta}`, up: data.kpis.totalDelta > 0 },
    { label: "Revoked", value: data.kpis.revoked.toString(), delta: `${data.kpis.revokedDelta}`, up: data.kpis.revokedDelta < 0 },
    { label: "Expiring", value: data.kpis.expiring.toString(), delta: `${data.kpis.expiringDelta}`, up: data.kpis.expiringDelta < 0 }
  ] : [];

  const columns = [{ key: "key", label: "License Key" }, { key: "product", label: "Product" }, { key: "status", label: "Status" }, { key: "expires", label: "Expires" }];
  const rows = data?.licenses?.slice(0, 10).map((l: any) => ({
    key: l.licenseKey,
    product: l.product?.name || 'Unknown',
    status: l.status,
    expires: l.expiresAt ? new Date(l.expiresAt).toLocaleDateString() : 'Never'
  })) || [];

  return (
    <AppShell>
      <ModulePage title="License System" subtitle="Issue & manage product licenses" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
