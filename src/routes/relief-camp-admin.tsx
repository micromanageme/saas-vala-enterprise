import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/relief-camp-admin")({
  head: () => ({ meta: [{ title: "Relief Camp Admin — SaaS Vala" }, { name: "description", content: "Relief camp administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: campData, isLoading, error } = useQuery({
    queryKey: ["relief-camp-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Relief Camp Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Relief Camp Admin" subtitle="Relief camp administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Relief Camp Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Camps Managed", value: "8", delta: "+1", up: true },
    { label: "Sheltered People", value: "2.5K", delta: "+300", up: true },
    { label: "Capacity Utilization", value: "85%", delta: "+5%", up: false },
    { label: "Supplies Status", value: "92%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "camp", label: "Relief Camp" },
    { key: "location", label: "Location" },
    { key: "occupants", label: "Occupants" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { camp: "CAMP-001", location: "North District", occupants: "400", status: "Active" },
    { camp: "CAMP-002", location: "South District", occupants: "350", status: "Active" },
    { camp: "CAMP-003", location: "East District", occupants: "300", status: "Active" },
    { camp: "CAMP-004", location: "West District", occupants: "250", status: "Active" },
    { camp: "CAMP-005", location: "Central", occupants: "200", status: "Standby" },
  ];

  return (
    <AppShell>
      <ModulePage title="Relief Camp Admin" subtitle="Relief camp administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
