// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/connectivity-manager")({
  head: () => ({ meta: [{ title: "Connectivity Manager — SaaS Vala" }, { name: "description", content: "Connectivity management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: connectivityData, isLoading, error } = useQuery({
    queryKey: ["connectivity-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Connectivity Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Connectivity Manager" subtitle="Connectivity management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Connectivity Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Connections Active", value: "45K", delta: "+5K", up: true },
    { label: "SLA Compliance", value: "99.5%", delta: "+0.3%", up: true },
    { label: "Latency", value: "20ms", delta: "-2ms", up: true },
    { label: "Packet Loss", value: "0.01%", delta: "-0.005%", up: true },
  ];

  const columns = [
    { key: "link", label: "Connectivity Link" },
    { key: "type", label: "Type" },
    { key: "speed", label: "Speed" },
    { key: "status", label: "Status" },
  ];

  rows = [
    { link: "LINK-001", type: "Fiber", speed: "10 Gbps", status: "Active" },
    { link: "LINK-002", type: "Microwave", speed: "1 Gbps", status: "Active" },
    { link: "LINK-003", type: "Satellite", speed: "500 Mbps", status: "Active" },
    { link: "LINK-004", type: "Copper", speed: "100 Mbps", status: "Active" },
    { link: "LINK-005", type: "Fiber", speed: "10 Gbps", status: "Standby" },
  ];

  return (
    <AppShell>
      <ModulePage title="Connectivity Manager" subtitle="Connectivity management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
