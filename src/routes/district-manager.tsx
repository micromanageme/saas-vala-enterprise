import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/district-manager")({
  head: () => ({ meta: [{ title: "District Manager — SaaS Vala" }, { name: "description", content: "District-level management" }] }),
  component: Page,
});

function Page() {
  const { data: districtData, isLoading, error } = useQuery({
    queryKey: ["district-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch District Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="District Manager" subtitle="District-level management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load District Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Branches Managed", value: "8", delta: "+1", up: true },
    { label: "Total Users", value: "234", delta: "+12", up: true },
    { label: "District Revenue", value: "$450K", delta: "+8%", up: true },
    { label: "Team Satisfaction", value: "4.3/5", delta: "+0.2", up: true },
  ];

  const columns = [
    { key: "branch", label: "Branch" },
    { key: "manager", label: "Manager" },
    { key: "users", label: "Users" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { branch: "Manhattan", manager: "John Smith", users: "89", status: "Active" },
    { branch: "Brooklyn", manager: "Sarah Johnson", users: "56", status: "Active" },
    { branch: "Queens", manager: "Mike Brown", users: "45", status: "Active" },
    { branch: "Bronx", manager: "Emily Davis", users: "28", status: "Active" },
    { branch: "Staten Island", manager: "Alex Wilson", users: "16", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="District Manager" subtitle="District-level management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
