import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin-branches")({
  head: () => ({ meta: [{ title: "Branch Management — Super Admin" }, { name: "description", content: "Global branch and location management" }] }),
  component: Page,
});

function Page() {
  const { data: branchesData, isLoading, error } = useQuery({
    queryKey: ["admin-branches"],
    queryFn: async () => {
      const response = await fetch("/api/admin/branches?type=all");
      if (!response.ok) throw new Error("Failed to fetch branches");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Branch Management" subtitle="Global branch and location management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load branches</div>
      </AppShell>
    );
  }

  const data = branchesData?.data;
  const kpis = data?.kpis ? [
    { label: "Total Branches", value: data.kpis.totalBranches.toString(), delta: `+${data.kpis.branchesDelta}`, up: data.kpis.branchesDelta > 0 },
    { label: "Active", value: data.kpis.activeBranches.toString(), delta: `+${data.kpis.branchesDelta}`, up: data.kpis.branchesDelta > 0 },
    { label: "Countries", value: data.kpis.totalCountries.toString(), delta: "+2", up: true },
    { label: "Cities", value: data.kpis.totalCities.toString(), delta: "+5", up: true },
  ] : [];

  const columns = [
    { key: "name", label: "Name" },
    { key: "code", label: "Code" },
    { key: "country", label: "Country" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "status", label: "Status" },
    { key: "company", label: "Company" },
    { key: "users", label: "Users" },
  ];

  const rows = data?.branches?.map((b: any) => ({
    name: b.name,
    code: b.code,
    country: b.country,
    city: b.city,
    state: b.state,
    status: b.status,
    company: b.company || "—",
    users: b.users.toString(),
  })) || [];

  return (
    <AppShell>
      <ModulePage title="Branch Management" subtitle="Global branch and location management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
