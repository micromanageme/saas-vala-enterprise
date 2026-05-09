import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-micropolicy")({
  head: () => ({ meta: [{ title: "Micro Policy Evaluation Pipeline — Universal Access Admin" }, { name: "description", content: "Pre-policy validation, chained policy execution, runtime policy rollback" }] }),
  component: Page,
});

function Page() {
  const { data: policyData, isLoading, error } = useQuery({
    queryKey: ["root-micropolicy"],
    queryFn: async () => {
      const response = await fetch("/api/root/micro-policy-pipeline?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch micro policy pipeline data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Micro Policy Evaluation Pipeline" subtitle="Pre-policy validation, chained policy execution, runtime policy rollback" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Micro Policy Evaluation Pipeline data</div>
      </AppShell>
    );
  }

  const data = policyData?.data;
  const validation = data?.prePolicyValidation;
  const execution = data?.chainedPolicyExecution;

  const kpis = [
    { label: "Validation Rate", value: validation?.validationRate || "0%", delta: "—", up: parseFloat(validation?.validationRate || '0') > 99 },
    { label: "Executed Chains", value: `${execution?.executedChains}/${execution?.totalChains}`, delta: "—", up: true },
    { label: "Rollback Success", value: `${data?.runtimePolicyRollback?.successfulRollbacks}/${data?.runtimePolicyRollback?.totalRollbacks}`, delta: "—", up: data?.runtimePolicyRollback?.failedRollbacks === 0 },
  ];

  const rows = [
    { metric: "Total Validations", value: validation?.totalValidations.toString() || "0", status: "OK" },
    { metric: "Avg Chain Length", value: execution?.avgChainLength.toString() || "0", status: "OK" },
    { metric: "Avg Rollback Time", value: data?.runtimePolicyRollback?.avgRollbackTime || "—", status: "OK" },
    { metric: "Traced Effects", value: data?.policySideEffectTracing?.tracedEffects.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Micro Policy Evaluation Pipeline" subtitle="Pre-policy validation, chained policy execution, runtime policy rollback" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
