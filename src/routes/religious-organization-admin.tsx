import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/religious-organization-admin")({
  head: () => ({ meta: [{ title: "Religious Organization Admin — SaaS Vala" }, { name: "description", content: "Religious organization administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: religiousData, isLoading, error } = useQuery({
    queryKey: ["religious-organization-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Religious Organization Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Religious Organization Admin" subtitle="Religious organization administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Religious Organization Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Members", value: "5.2K", delta: "+300", up: true },
    { label: "Events", value: "25", delta: "+3", up: true },
    { label: "Donations", value: "$125K", delta: "+$15K", up: true },
    { label: "Volunteers", value: "150", delta: "+20", up: true },
  ];

  const columns = [
    { key: "center", label: "Religious Center" },
    { key: "type", label: "Type" },
    { key: "members", label: "Members" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { center: "CENTER-001", type: "Temple", members: "500", status: "Active" },
    { center: "CENTER-002", type: "Church", members: "800", status: "Active" },
    { center: "CENTER-003", type: "Mosque", members: "600", status: "Active" },
    { center: "CENTER-004", type: "Synagogue", members: "300", status: "Active" },
    { center: "CENTER-005", type: "Gurdwara", members: "400", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Religious Organization Admin" subtitle="Religious organization administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
