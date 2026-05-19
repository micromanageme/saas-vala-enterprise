import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-forensiccore")({
  head: () => ({ meta: [{ title: "Root Immutable Forensic Core — Universal Access Admin" }, { name: "description", content: "Tamper-proof activity chain, cryptographic audit sealing, forensic reconstruction" }] }),
  component: Page,
});

function Page() {
  const { data: forensicData, isLoading, error, refetch } = useQuery({
    queryKey: ["root-forensiccore"],
    queryFn: async () => {
      const response = await fetch("/api/root/immutable-forensic-core?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch immutable forensic core data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Root Immutable Forensic Core" subtitle="Tamper-proof activity chain, cryptographic audit sealing, forensic reconstruction" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Root Immutable Forensic Core"
          subtitle="Tamper-proof activity chain, cryptographic audit sealing, forensic reconstruction"
          message="We couldn't load Root Immutable Forensic Core data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = forensicData?.data;
  const chain = data?.tamperProofActivityChain;
  const sealing = data?.cryptographicAuditSealing;

  const kpis = [
    { label: "Sealed Events", value: `${chain?.sealedEvents.toLocaleString()}/${chain?.totalEvents.toLocaleString()}`, delta: "—", up: chain?.tamperedEvents === 0 },
    { label: "Valid Seals", value: `${sealing?.validSeals.toLocaleString()}/${sealing?.totalSeals.toLocaleString()}`, delta: "—", up: sealing?.brokenSeals === 0 },
    { label: "Retention Years", value: data?.irreversibleEvidencePreservation?.retentionYears.toString() || "0", delta: "—", up: true },
  ];

  const rows = [
    { metric: "Chain Length", value: chain?.chainLength.toLocaleString() || "0", status: "OK" },
    { metric: "Seal Algorithm", value: sealing?.sealAlgorithm || "—", status: "OK" },
    { metric: "Total Reconstructions", value: data?.forensicReconstructionEngine?.totalReconstructions.toString() || "0", status: "OK" },
    { metric: "Total Evidence", value: data?.irreversibleEvidencePreservation?.totalEvidence.toLocaleString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root Immutable Forensic Core" subtitle="Tamper-proof activity chain, cryptographic audit sealing, forensic reconstruction" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
