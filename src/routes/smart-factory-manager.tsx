import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/smart-factory-manager")({
  head: () => ({ meta: [{ title: "Smart Factory Manager — SaaS Vala" }, { name: "description", content: "Smart factory management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: factoryData, isLoading, error } = useQuery({
    queryKey: ["smart-factory-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Smart Factory Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Smart Factory Manager" subtitle="Smart factory management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Smart Factory Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "IoT Devices", value: "2.5K", delta: "+150", up: true },
    { label: "Automation Rate", value: "88%", delta: "+3%", up: true },
    { label: "Predictive Maintenance", value: "95%", delta: "+2%", up: true },
    { label: "Energy Efficiency", value: "82%", delta: "+4%", up: true },
  ];

  const columns = [
    { key: "system", label: "Smart System" },
    { key: "devices", label: "Connected Devices" },
    { key: "uptime", label: "Uptime" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { system: "Automated Assembly", devices: "450", uptime: "99.5%", status: "Active" },
    { system: "Robotics Control", devices: "320", uptime: "99.2%", status: "Active" },
    { system: "Quality Sensors", devices: "580", uptime: "98.8%", status: "Active" },
    { system: "Energy Management", devices: "180", uptime: "99.8%", status: "Active" },
    { system: "Inventory Tracking", devices: "250", uptime: "99.0%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Smart Factory Manager" subtitle="Smart factory management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
