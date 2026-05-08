import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/relief-operations-manager")({
  head: () => ({ meta: [{ title: "Relief Operations Manager — SaaS Vala" }, { name: "description", content: "Relief operations management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: reliefData, isLoading, error } = useQuery({
    queryKey: ["relief-operations-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Relief Operations Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Relief Operations Manager" subtitle="Relief operations management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Relief Operations Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Relief Operations", value: "12", delta: "+2", up: true },
    { label: "People Assisted", value: "5.2K", delta: "+500", up: true },
    { label: "Supplies Distributed", value: "125 tons", delta: "+15 tons", up: true },
    { label: "Response Time", value: "4h", delta: "-1h", up: true },
  ];

  const columns = [
    { key: "operation", label: "Relief Operation" },
    { key: "type", label: "Type" },
    { key: "location", label: "Location" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { operation: "REL-001", type: "Flood Relief", location: "North Region", status: "Active" },
    { operation: "REL-002", type: "Earthquake Relief", location: "East Region", status: "Active" },
    { operation: "REL-003", type: "Drought Relief", location: "South Region", status: "Planning" },
    { operation: "REL-004", type: "Food Distribution", location: "West Region", status: "Active" },
    { operation: "REL-005", type: "Medical Aid", location: "Central", status: "Completed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Relief Operations Manager" subtitle="Relief operations management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
