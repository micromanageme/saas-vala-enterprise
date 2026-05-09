import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/country-admin")({
  head: () => ({ meta: [{ title: "Country Admin — SaaS Vala" }, { name: "description", content: "Country-level administration" }] }),
  component: Page,
});

function Page() {
  const { data: countryData, isLoading, error } = useQuery({
    queryKey: ["country-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Country Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Country Admin" subtitle="Country-level administration" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Country Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Total Branches", value: "12", delta: "+1", up: true },
    { label: "Total Users", value: "456", delta: "+23", up: true },
    { label: "Country Revenue", value: "$1.2M", delta: "+12%", up: true },
    { label: "Compliance Score", value: "98%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "branch", label: "Branch" },
    { key: "manager", label: "Manager" },
    { key: "users", label: "Users" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { branch: "New York", manager: "John Smith", users: "89", status: "Active" },
    { branch: "Los Angeles", manager: "Sarah Johnson", users: "78", status: "Active" },
    { branch: "Chicago", manager: "Mike Brown", users: "56", status: "Active" },
    { branch: "Houston", manager: "Emily Davis", users: "45", status: "Active" },
    { branch: "Miami", manager: "Alex Wilson", users: "67", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Country Admin" subtitle="Country-level administration" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
