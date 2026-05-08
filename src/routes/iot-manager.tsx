import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/iot-manager")({
  head: () => ({ meta: [{ title: "IoT Manager — SaaS Vala" }, { name: "description", content: "IoT management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: iotData, isLoading, error } = useQuery({
    queryKey: ["iot-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch IoT Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="IoT Manager" subtitle="IoT management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load IoT Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Connected Devices", value: "5.8K", delta: "+250", up: true },
    { label: "Data Throughput", value: "45GB/day", delta: "+5GB", up: true },
    { label: "Device Uptime", value: "99.2%", delta: "+0.2%", up: true },
    { label: "Alerts Generated", value: "12", delta: "-3", up: true },
  ];

  const columns = [
    { key: "device", label: "IoT Device" },
    { key: "type", label: "Device Type" },
    { key: "location", label: "Location" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { device: "SENSOR-001", type: "Temperature", location: "Zone A", status: "Online" },
    { device: "SENSOR-002", type: "Humidity", location: "Zone B", status: "Online" },
    { device: "ACTUATOR-003", type: "Control", location: "Zone C", status: "Online" },
    { device: "GATEWAY-004", type: "Gateway", location: "Central", status: "Online" },
    { device: "SENSOR-005", type: "Pressure", location: "Zone D", status: "Offline" },
  ];

  return (
    <AppShell>
      <ModulePage title="IoT Manager" subtitle="IoT management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
