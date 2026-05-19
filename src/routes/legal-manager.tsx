import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/legal-manager")({
  head: () => ({ meta: [{ title: "Legal Manager — SaaS Vala" }, { name: "description", content: "Legal management" }] }),
  component: Page,
});

function Page() {
  const { data: legalData, isLoading, error, refetch } = useQuery({
    queryKey: ["legal-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Legal Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Legal Manager" subtitle="Legal management" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Legal Manager"
          subtitle="Legal management"
          message="We couldn't load Legal Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Contracts", value: "23", delta: "+2", up: true },
    { label: "Pending Reviews", value: "5", delta: "-1", up: true },
    { label: "Compliance Score", value: "96%", delta: "+2%", up: true },
    { label: "Legal Spend", value: "$45K", delta: "+5%", up: false },
  ];

  const columns = [
    { key: "contract", label: "Contract" },
    { key: "type", label: "Type" },
    { key: "expiry", label: "Expiry" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { contract: "CTR-001234", type: "Vendor", expiry: "2025-12-31", status: "Active" },
    { contract: "CTR-001235", type: "Employment", expiry: "2024-12-31", status: "Renewal" },
    { contract: "CTR-001236", type: "Partnership", expiry: "2025-06-30", status: "Active" },
    { contract: "CTR-001237", type: "License", expiry: "2024-09-30", status: "Review" },
    { contract: "CTR-001238", type: "Service", expiry: "2025-03-31", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Legal Manager" subtitle="Legal management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
