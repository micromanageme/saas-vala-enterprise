import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/experiment-validation-officer")({
  head: () => ({ meta: [{ title: "Experiment Validation Officer — SaaS Vala" }, { name: "description", content: "Experiment validation workspace" }] }),
  component: Page,
});

function Page() {
  const { data: validationData, isLoading, error, refetch } = useQuery({
    queryKey: ["experiment-validation-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Experiment Validation Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Experiment Validation Officer" subtitle="Experiment validation workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Experiment Validation Officer"
          subtitle="Experiment validation workspace"
          message="We couldn't load Experiment Validation Officer data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Experiments Validated", value: "85", delta: "+10", up: true },
    { label: "Pass Rate", value: "92%", delta: "+2%", up: true },
    { key: "reviews", label: "Peer Reviews", value: "45", delta: "+5", up: true },
    { label: "Quality Score", value: "4.7/5", delta: "+0.1", up: true },
  ];

  const columns = [
    { key: "experiment", label: "Experiment" },
    { key: "type", label: "Type" },
    { key: "criteria", label: "Validation Criteria" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { experiment: "EXP-001", type: "Clinical", criteria: "GCP", status: "Validated" },
    { experiment: "EXP-002", type: "Preclinical", criteria: "GLP", status: "In Review" },
    { experiment: "EXP-003", type: "In Vitro", criteria: "SOP", status: "Validated" },
    { experiment: "EXP-004", type: "In Vivo", criteria: "IACUC", status: "Pending" },
    { experiment: "EXP-005", type: "Field", criteria: "GCP", status: "Validated" },
  ];

  return (
    <AppShell>
      <ModulePage title="Experiment Validation Officer" subtitle="Experiment validation workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
