import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/digital-twin-manager")({
  head: () => ({ meta: [{ title: "Digital Twin Manager — SaaS Vala" }, { name: "description", content: "Digital twin management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: twinData, isLoading, error } = useQuery({
    queryKey: ["digital-twin-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Digital Twin Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Digital Twin Manager" subtitle="Digital twin management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Digital Twin Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Digital Twins", value: "18", delta: "+2", up: true },
    { label: "Sync Accuracy", value: "99.5%", delta: "+0.3%", up: true },
    { label: "Simulation Runs", value: "250", delta: "+45", up: true },
    { label: "Prediction Accuracy", value: "94%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "twin", label: "Digital Twin" },
    { key: "asset", label: "Physical Asset" },
    { key: "sync", label: "Sync Status" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { twin: "DT-FACTORY-01", asset: "Production Line A", sync: "Real-time", status: "Active" },
    { twin: "DT-MACHINE-02", asset: "CNC Machine 05", sync: "Real-time", status: "Active" },
    { twin: "DT-WAREHOUSE-03", asset: "Warehouse B", sync: "Near Real-time", status: "Active" },
    { twin: "DT-ROBOT-04", asset: "Robot Arm 12", sync: "Real-time", status: "Active" },
    { twin: "DT-PLANT-05", asset: "Entire Plant", sync: "Batch", status: "Syncing" },
  ];

  return (
    <AppShell>
      <ModulePage title="Digital Twin Manager" subtitle="Digital twin management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
