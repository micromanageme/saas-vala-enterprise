import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/brand-manager")({
  head: () => ({ meta: [{ title: "Brand Manager — SaaS Vala" }, { name: "description", content: "Brand management" }] }),
  component: Page,
});

function Page() {
  const { data: brandData, isLoading, error, refetch } = useQuery({
    queryKey: ["brand-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Brand Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Brand Manager" subtitle="Brand management" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Brand Manager"
          subtitle="Brand management"
          message="We couldn't load Brand Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Brand Awareness", value: "78%", delta: "+5%", up: true },
    { label: "Brand Sentiment", value: "Positive", delta: "+3%", up: true },
    { label: "Brand Assets", value: "234", delta: "+12", up: true },
    { label: "Mentions", value: "1.2K", delta: "+150", up: true },
  ];

  const columns = [
    { key: "asset", label: "Asset" },
    { key: "type", label: "Type" },
    { key: "usage", label: "Usage" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { asset: "Logo Pack", type: "Visual", usage: "High", status: "Approved" },
    { asset: "Brand Guidelines", type: "Document", usage: "High", status: "Approved" },
    { asset: "Color Palette", type: "Visual", usage: "High", status: "Approved" },
    { asset: "Typography", type: "Visual", usage: "Medium", status: "Approved" },
    { asset: "Voice Guide", type: "Document", usage: "Medium", status: "Review" },
  ];

  return (
    <AppShell>
      <ModulePage title="Brand Manager" subtitle="Brand management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
