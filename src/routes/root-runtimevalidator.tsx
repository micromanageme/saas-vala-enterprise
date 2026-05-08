import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-runtimevalidator")({
  head: () => ({ meta: [{ title: "Root Runtime Validator — Universal Access Admin" }, { name: "description", content: "Runtime integrity scan, hot module verification, unstable isolation" }] }),
  component: Page,
});

function Page() {
  const { data: validatorData, isLoading, error } = useQuery({
    queryKey: ["root-runtimevalidator"],
    queryFn: async () => {
      const response = await fetch("/api/root/runtime-validator?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch runtime validator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Runtime Validator" subtitle="Runtime integrity scan, hot module verification, unstable isolation" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Runtime Validator data</div>
      </AppShell>
    );
  }

  const data = validatorData?.data;
  const integrity = data?.runtimeIntegrity;
  const hotModules = data?.hotModuleVerification;

  const kpis = [
    { label: "Verified Modules", value: `${integrity?.verifiedModules}/${integrity?.totalModules}`, delta: "—", up: true },
    { label: "Corrupted Modules", value: integrity?.corruptedModules.toString() || "0", delta: "—", up: integrity?.corruptedModules === 0 },
    { label: "Unstable Modules", value: data?.unstableModuleIsolation?.unstableModules.toString() || "0", delta: "—", up: true },
  ] : [];

  const rows = [
    { metric: "Total Modules", value: integrity?.totalModules.toString() || "0", status: "OK" },
    { metric: "Verified Modules", value: integrity?.verifiedModules.toString() || "0", status: "OK" },
    { metric: "Corrupted Modules", value: integrity?.corruptedModules.toString() || "0", status: "OK" },
    { metric: "Verified Hot Modules", value: hotModules?.verifiedHotModules.toString() || "0", status: "OK" },
    { metric: "Stable Modules", value: data?.unstableModuleIsolation?.stableModules.toString() || "0", status: "OK" },
    { metric: "Isolated Modules", value: data?.unstableModuleIsolation?.isolatedModules.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root Runtime Validator" subtitle="Runtime integrity scan, hot module verification, unstable isolation" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
