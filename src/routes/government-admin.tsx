import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/government-admin")({
  head: () => ({ meta: [{ title: "Government Admin — SaaS Vala" }, { name: "description", content: "Government administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: govData, isLoading, error } = useQuery({
    queryKey: ["government-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Government Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Government Admin" subtitle="Government administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Government Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Programs", value: "25", delta: "+3", up: true },
    { label: "Citizens Served", value: "125K", delta: "+5K", up: true },
    { label: "Service Efficiency", value: "92%", delta: "+2%", up: true },
    { label: "Budget Utilization", value: "78%", delta: "+3%", up: false },
  ];

  const columns = [
    { key: "program", label: "Government Program" },
    { key: "department", label: "Department" },
    { key: "budget", label: "Budget" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { program: "Public Housing Initiative", department: "Housing", budget: "$5M", status: "Active" },
    { program: "Healthcare Access", department: "Health", budget: "$8M", status: "Active" },
    { program: "Education Support", department: "Education", budget: "$6M", status: "In Progress" },
    { program: "Infrastructure Development", department: "Public Works", budget: "$12M", status: "Planning" },
    { program: "Social Welfare", department: "Social Services", budget: "$4M", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Government Admin" subtitle="Government administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
