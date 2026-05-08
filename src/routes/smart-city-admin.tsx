import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/smart-city-admin")({
  head: () => ({ meta: [{ title: "Smart City Admin — SaaS Vala" }, { name: "description", content: "Smart city administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: smartCityData, isLoading, error } = useQuery({
    queryKey: ["smart-city-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Smart City Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Smart City Admin" subtitle="Smart city administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Smart City Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "IoT Devices", value: "12.5K", delta: "+1.2K", up: true },
    { label: "Smart Services", value: "25", delta: "+3", up: true },
    { label: "Data Points/Day", value: "45M", delta: "+5M", up: true },
    { label: "City Efficiency", value: "89%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "service", label: "Smart Service" },
    { key: "devices", label: "Active Devices" },
    { key: "uptime", label: "Uptime" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { service: "Smart Traffic", devices: "2,500", uptime: "99.5%", status: "Active" },
    { service: "Smart Lighting", devices: "3,200", uptime: "99.8%", status: "Active" },
    { service: "Smart Parking", devices: "1,800", uptime: "98.5%", status: "Active" },
    { service: "Smart Waste", devices: "1,200", uptime: "97.8%", status: "Active" },
    { service: "Smart Water", devices: "950", uptime: "99.2%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Smart City Admin" subtitle="Smart city administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
