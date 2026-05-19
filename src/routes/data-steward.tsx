// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/data-steward")({
  head: () => ({ meta: [{ title: "Data Steward — SaaS Vala" }, { name: "description", content: "Data stewardship workspace" }] }),
  component: Page,
});

function Page() {
  const { data: stewardData, isLoading, error, refetch } = useQuery({
    queryKey: ["data-steward-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Data Steward data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Data Steward" subtitle="Data stewardship workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Data Steward"
          subtitle="Data stewardship workspace"
          message="We couldn't load Data Steward data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Data Domains Owned", value: "3", delta: "—", up: true },
    { label: "Data Issues", value: "12", delta: "-3", up: true },
    { label: "Quality Score", value: "94%", delta: "+2%", up: true },
    { label: "Requests Processed", value: "45", delta:+8, up: true },
  ];

  const columns = [
    { key: "dataset", label: "Dataset" },
    { key: "quality", label: "Quality" },
    { key: "issues", label: "Issues" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { dataset: "Customer Master", quality: "96%", issues: "2", status: "Healthy" },
    { dataset: "Product Catalog", quality: "92%", issues: "5", status: "Needs Attention" },
    { dataset: "Sales Data", quality: "95%", issues: "1", status: "Healthy" },
    { dataset: "Inventory Data", quality: "93%", issues: "3", status: "Healthy" },
    { dataset: "Financial Data", quality: "98%", issues: "1", status: "Healthy" },
  ];

  return (
    <AppShell>
      <ModulePage title="Data Steward" subtitle="Data stewardship workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
