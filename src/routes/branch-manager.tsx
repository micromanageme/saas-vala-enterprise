import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/branch-manager")({
  head: () => ({ meta: [{ title: "Branch Manager — SaaS Vala" }, { name: "description", content: "Branch-level management" }] }),
  component: Page,
});

function Page() {
  const { data: branchData, isLoading, error } = useQuery({
    queryKey: ["branch-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Branch Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Branch Manager" subtitle="Branch-level management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Branch Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Branch Users", value: "45", delta: "+3", up: true },
    { label: "Branch Revenue", value: "$125K", delta: "+8%", up: true },
    { label: "Active Projects", value: "8", delta: "+1", up: true },
    { label: "Team Satisfaction", value: "4.3/5", delta: "+0.2", up: true },
  ];

  const columns = [
    { key: "employee", label: "Employee" },
    { key: "department", label: "Department" },
    { key: "performance", label: "Performance" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { employee: "John Smith", department: "Sales", performance: "92%", status: "Active" },
    { employee: "Sarah Johnson", department: "Engineering", performance: "88%", status: "Active" },
    { employee: "Mike Brown", department: "Support", performance: "95%", status: "Active" },
    { employee: "Emily Davis", department: "Marketing", performance: "85%", status: "Active" },
    { employee: "Alex Wilson", department: "Operations", performance: "90%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Branch Manager" subtitle="Branch-level management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
