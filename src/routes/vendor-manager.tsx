import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/vendor-manager")({
  head: () => ({ meta: [{ title: "Vendor Manager — SaaS Vala" }, { name: "description", content: "Vendor management" }] }),
  component: Page,
});

function Page() {
  const { data: vendorMgrData, isLoading, error } = useQuery({
    queryKey: ["vendor-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Vendor Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Vendor Manager" subtitle="Vendor management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Vendor Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Total Vendors", value: "23", delta: "+3", up: true },
    { label: "Active Vendors", value: "21", delta: "+2", up: true },
    { label: "Vendor Spend", value: "$45K", delta: "+5%", up: false },
    { label: "On-Time Delivery", value: "94%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "vendor", label: "Vendor" },
    { key: "category", label: "Category" },
    { key: "spend", label: "Spend" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { vendor: "TechCorp Supplies", category: "IT Equipment", spend: "$12K", status: "Active" },
    { vendor: "OfficeDepot", category: "Office Supplies", spend: "$8K", status: "Active" },
    { vendor: "CloudProvider", category: "Cloud Services", spend: "$15K", status: "Active" },
    { vendor: "CleanTeam", category: "Facilities", spend: "$5K", status: "Active" },
    { vendor: "SecurityServices", category: "Security", spend: "$5K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Vendor Manager" subtitle="Vendor management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
