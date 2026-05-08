import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-microdeployment")({
  head: () => ({ meta: [{ title: "Micro Deployment Consistency Engine — Universal Access Admin" }, { name: "description", content: "Artifact checksum lineage, environment parity validation, deployment mutation diffing" }] }),
  component: Page,
});

function Page() {
  const { data: deploymentData, isLoading, error } = useQuery({
    queryKey: ["root-microdeployment"],
    queryFn: async () => {
      const response = await fetch("/api/root/micro-deployment-consistency?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch micro deployment consistency data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Micro Deployment Consistency Engine" subtitle="Artifact checksum lineage, environment parity validation, deployment mutation diffing" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Micro Deployment Consistency Engine data</div>
      </AppShell>
    );
  }

  const data = deploymentData?.data;
  const checksum = data?.artifactChecksumLineage;
  const parity = data?.environmentParityValidation;

  const kpis = [
    { label: "Checksum Accuracy", value: checksum?.checksumAccuracy || "0%", delta: "—", up: checksum?.checksumAccuracy === '100%' },
    { label: "Parity Rate", value: parity?.parityRate || "0%", delta: "—", up: parity?.parityRate === '100%' },
    { label: "Rollback Rate", value: data?.rollbackDeterminismVerification?.rollbackRate || "0%", delta: "—", up: data?.rollbackDeterminismVerification?.rollbackRate === '100%' },
  ] : [];

  const rows = [
    { metric: "Total Artifacts", value: checksum?.totalArtifacts.toString() || "0", status: "OK" },
    { metric: "Total Validations", value: parity?.totalValidations.toString() || "0", status: "OK" },
    { metric: "Detected Mutations", value: data?.deploymentMutationDiffing?.detectedMutations.toString() || "0", status: "OK" },
    { metric: "Deterministic Rollbacks", value: data?.rollbackDeterminismVerification?.deterministicRollbacks.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Micro Deployment Consistency Engine" subtitle="Artifact checksum lineage, environment parity validation, deployment mutation diffing" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
