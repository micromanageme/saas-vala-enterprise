import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/welfare-manager")({
  head: () => ({ meta: [{ title: "Welfare Manager — SaaS Vala" }, { name: "description", content: "Employee welfare management" }] }),
  component: Page,
});

function Page() {
  const { data: welfareData, isLoading, error } = useQuery({
    queryKey: ["welfare-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Welfare Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Welfare Manager" subtitle="Employee welfare management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Welfare Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Wellness Score", value: "4.2/5", delta: "+0.2", up: true },
    { label: "Benefits Utilization", value: "78%", delta: "+5%", up: true },
    { label: "Open Requests", value: "12", delta: "-3", up: true },
    { label: "Employee Satisfaction", value: "88%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "benefit", label: "Benefit" },
    { key: "type", label: "Type" },
    { key: "utilization", label: "Utilization" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { benefit: "Health Insurance", type: "Health", utilization: "95%", status: "Active" },
    { benefit: "Gym Membership", type: "Wellness", utilization: "65%", status: "Active" },
    { benefit: "Mental Health", type: "Wellness", utilization: "45%", status: "Active" },
    { benefit: "Learning Budget", type: "Development", utilization: "72%", status: "Active" },
    { benefit: "Remote Setup", type: "Equipment", utilization: "88%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Welfare Manager" subtitle="Employee welfare management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
