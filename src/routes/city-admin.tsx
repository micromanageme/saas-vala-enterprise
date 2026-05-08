import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/city-admin")({
  head: () => ({ meta: [{ title: "City Admin — SaaS Vala" }, { name: "description", content: "City-level administration" }] }),
  component: Page,
});

function Page() {
  const { data: cityData, isLoading, error } = useQuery({
    queryKey: ["city-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch City Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="City Admin" subtitle="City-level administration" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load City Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "City Users", value: "89", delta: "+5", up: true },
    { label: "City Revenue", value: "$180K", delta: "+6%", up: true },
    { label: "Active Customers", value: "45", delta: "+3", up: true },
    { label: "Local Events", value: "3", delta: "+1", up: true },
  ] : [];

  const columns = [
    { key: "customer", label: "Customer" },
    { key: "plan", label: "Plan" },
    { key: "revenue", label: "Revenue" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { customer: "Acme Corp", plan: "Enterprise", revenue: "$45K", status: "Active" },
    { customer: "TechStart Inc", plan: "Pro", revenue: "$12K", status: "Active" },
    { customer: "Global Ltd", plan: "Enterprise", revenue: "$38K", status: "Active" },
    { customer: "Innovate Co", plan: "Basic", revenue: "$5K", status: "Active" },
    { customer: "Future Systems", plan: "Pro", revenue: "$15K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="City Admin" subtitle="City-level administration" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
