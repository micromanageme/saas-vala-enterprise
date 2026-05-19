import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-nanosession")({
  head: () => ({ meta: [{ title: "Nano Session Fingerprinting — Universal Access Admin" }, { name: "description", content: "Browser fingerprint mesh, hardware entropy validation, behavioral session verification" }] }),
  component: Page,
});

function Page() {
  const { data: sessionData, isLoading, error, refetch } = useQuery({
    queryKey: ["root-nanosession"],
    queryFn: async () => {
      const response = await fetch("/api/root/nano-session-fingerprinting?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch nano session fingerprinting data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Nano Session Fingerprinting" subtitle="Browser fingerprint mesh, hardware entropy validation, behavioral session verification" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Nano Session Fingerprinting"
          subtitle="Browser fingerprint mesh, hardware entropy validation, behavioral session verification"
          message="We couldn't load Nano Session Fingerprinting data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const data = sessionData?.data;
  const fingerprint = data?.browserFingerprintMesh;
  const entropy = data?.hardwareEntropyValidation;

  const kpis = [
    { label: "Fingerprint Accuracy", value: fingerprint?.fingerprintAccuracy || "0%", delta: "—", up: parseFloat(fingerprint?.fingerprintAccuracy || '0') > 99 },
    { label: "Valid Entropy", value: `${entropy?.validEntropy}/${entropy?.totalValidations}`, delta: "—", up: entropy?.invalidEntropy === 0 },
    { label: "Cloned Sessions", value: data?.clonedSessionDetection?.clonedSessionsFound.toString() || "0", delta: "—", up: data?.clonedSessionDetection?.clonedSessionsFound === 0 },
  ];

  const rows = [
    { metric: "Total Fingerprints", value: fingerprint?.totalFingerprints.toString() || "0", status: "OK" },
    { metric: "Avg Entropy Score", value: entropy?.avgEntropyScore || "—", status: "OK" },
    { metric: "Verified Sessions", value: data?.behavioralSessionVerification?.verifiedSessions.toString() || "0", status: "OK" },
    { metric: "Detection Rate", value: data?.clonedSessionDetection?.detectionRate || "0%", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Nano Session Fingerprinting" subtitle="Browser fingerprint mesh, hardware entropy validation, behavioral session verification" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
