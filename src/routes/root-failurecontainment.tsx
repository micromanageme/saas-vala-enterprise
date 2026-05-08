import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-failurecontainment")({
  head: () => ({ meta: [{ title: "Root Failure Containment — Universal Access Admin" }, { name: "description", content: "Fault isolation, blast-radius control, cascading failure prevention" }] }),
  component: Page,
});

function Page() {
  const { data: containmentData, isLoading, error } = useQuery({
    queryKey: ["root-failurecontainment"],
    queryFn: async () => {
      const response = await fetch("/api/root/failure-containment?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch failure containment data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Failure Containment" subtitle="Fault isolation, blast-radius control, cascading failure prevention" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Failure Containment data</div>
      </AppShell>
    );
  }

  const data = containmentData?.data;
  const isolation = data?.faultIsolation;
  const blast = data?.blastRadiusControl;
  const cascading = data?.cascadingFailurePrevention;

  const kpis = [
    { label: "Healthy Services", value: `${isolation?.healthyServices}/${isolation?.totalServices}`, delta: "—", up: true },
    { label: "Contained Failures", value: `${blast?.containedFailures}/${blast?.totalFailures}`, delta: "—", up: true },
    { label: "Protected Dependencies", value: `${cascading?.protectedDependencies}/${cascading?.totalDependencies}`, delta: "—", up: true },
  ] : [];

  const rows = [
    { metric: "Total Services", value: isolation?.totalServices.toString() || "0", status: "OK" },
    { metric: "Isolated Services", value: isolation?.isolatedServices.toString() || "0", status: "OK" },
    { metric: "Healthy Services", value: isolation?.healthyServices.toString() || "0", status: "OK" },
    { metric: "Total Failures", value: blast?.totalFailures.toString() || "0", status: "OK" },
    { metric: "Contained Failures", value: blast?.containedFailures.toString() || "0", status: "OK" },
    { metric: "Uncontained Failures", value: blast?.uncontainedFailures.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root Failure Containment" subtitle="Fault isolation, blast-radius control, cascading failure prevention" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
