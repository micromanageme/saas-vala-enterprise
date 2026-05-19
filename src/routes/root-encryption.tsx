import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-encryption")({
  head: () => ({ meta: [{ title: "Universal Encryption Center — Universal Access Admin" }, { name: "description", content: "Key rotation, HSM integration, vault orchestration" }] }),
  component: Page,
});

function Page() {
  const { data: encryptionData, isLoading, error, refetch } = useQuery({
    queryKey: ["root-encryption"],
    queryFn: async () => {
      const response = await fetch("/api/root/encryption-center?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch encryption center data");
      return response.json();
    },
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Universal Encryption Center" subtitle="Key rotation, HSM integration, vault orchestration" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Universal Encryption Center"
          subtitle="Key rotation, HSM integration, vault orchestration"
          message="We couldn't load Universal Encryption Center data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = encryptionData?.data;
  const keys = data?.encryptionKeys || [];
  const hsm = data?.hsmIntegration;

  const kpis = hsm ? [
    { label: "HSM Status", value: hsm.status, delta: "—", up: hsm.status === 'CONNECTED' },
    { label: "Keys in HSM", value: hsm.keysInHSM.toString(), delta: "—", up: true },
    { label: "Total Secrets", value: data?.vaultOrchestration?.totalSecrets.toString() || "0", delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "name", label: "Key" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "lastRotated", label: "Last Rotated" },
  ];

  const rows = keys.map((k: any) => ({
    name: k.name,
    type: k.type,
    status: k.status,
    lastRotated: new Date(k.lastRotated).toLocaleDateString(),
  }));

  return (
    <AppShell>
      <ModulePage title="Universal Encryption Center" subtitle="Key rotation, HSM integration, vault orchestration" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
