// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/port-authority-manager")({
  head: () => ({ meta: [{ title: "Port Authority Manager — SaaS Vala" }, { name: "description", content: "Port authority management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: portData, isLoading, error } = useQuery({
    queryKey: ["port-authority-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Port Authority Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Port Authority Manager" subtitle="Port authority management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Port Authority Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Ships Berthed", value: "45", delta: "+3", up: true },
    { label: "Containers Handled", value: "8.5K", delta: "+500", up: true },
    { label: "Berth Utilization", value: "88%", delta: "+2%", up: true },
    { label: "Avg Turnaround", value: "18h", delta: "-2h", up: true },
  ];

  const columns = [
    { key: "vessel", label: "Vessel" },
    { key: "origin", label: "Origin" },
    { key: "cargo", label: "Cargo Type" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { vessel: "VS-001", origin: "Shanghai", cargo: "Containers", status: "Berthed" },
    { vessel: "VS-002", origin: "Rotterdam", cargo: "Bulk", status: "Loading" },
    { vessel: "VS-003", origin: "Singapore", cargo: "Containers", status: "Unloading" },
    { vessel: "VS-004", origin: "Los Angeles", cargo: "Liquid", status: "Arriving" },
    { vehicle: "VS-005", origin: "Dubai", cargo: "Containers", status: "Departing" },
  ];

  return (
    <AppShell>
      <ModulePage title="Port Authority Manager" subtitle="Port authority management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
