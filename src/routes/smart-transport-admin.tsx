import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/smart-transport-admin")({
  head: () => ({ meta: [{ title: "Smart Transport Admin — SaaS Vala" }, { name: "description", content: "Smart transport administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: smartTransportData, isLoading, error } = useQuery({
    queryKey: ["smart-transport-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Smart Transport Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Smart Transport Admin" subtitle="Smart transport administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Smart Transport Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Smart Routes", value: "45", delta: "+5", up: true },
    { label: "Traffic Optimization", value: "35%", delta: "+5%", up: true },
    { label: "Congestion Reduced", value: "25%", delta: "+3%", up: true },
    { label: "User Satisfaction", value: "4.5/5", delta: "+0.2", up: true },
  ];

  const columns = [
    { key: "route", label: "Smart Route" },
    { key: "type", label: "Transport Type" },
    { key: "users", label: "Daily Users" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { route: "RT-001", type: "Bus Rapid Transit", users: "5,200", status: "Active" },
    { route: "RT-002", type: "Metro", users: "8,500", status: "Active" },
    { route: "RT-003", type: "Bike Share", users: "2,300", status: "Active" },
    { route: "RT-004", type: "Ride Share", users: "3,800", status: "Active" },
    { route: "RT-005", type: "Electric Scooter", users: "1,500", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Smart Transport Admin" subtitle="Smart transport administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
