import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-filesystem")({
  head: () => ({ meta: [{ title: "Universal Filesystem Control — Universal Access Admin" }, { name: "description", content: "Storage explorer, object storage, CDN sync" }] }),
  component: Page,
});

function Page() {
  const { data: fsData, isLoading, error, refetch } = useQuery({
    queryKey: ["root-filesystem"],
    queryFn: async () => {
      const response = await fetch("/api/root/filesystem?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch filesystem data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Universal Filesystem Control" subtitle="Storage explorer, object storage, CDN sync" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Universal Filesystem Control"
          subtitle="Storage explorer, object storage, CDN sync"
          message="We couldn't load Universal Filesystem Control data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = fsData?.data;
  const storage = data?.storage || [];
  const cdn = data?.cdn;

  const kpis = cdn ? [
    { label: "CDN Status", value: cdn.status, delta: "—", up: cdn.status === 'SYNCED' },
    { label: "Pending Files", value: cdn.pendingFiles.toString(), delta: "—", up: cdn.pendingFiles === 0 },
    { label: "Distribution Points", value: cdn.distributionPoints.toString(), delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "name", label: "Storage" },
    { key: "type", label: "Type" },
    { key: "size", label: "Size" },
    { key: "used", label: "Used" },
    { key: "status", label: "Status" },
  ];

  const rows = storage.map((s: any) => ({
    name: s.name,
    type: s.type,
    size: s.size,
    used: s.used,
    status: s.status,
  }));

  return (
    <AppShell>
      <ModulePage title="Universal Filesystem Control" subtitle="Storage explorer, object storage, CDN sync" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
