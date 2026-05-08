import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/network-admin")({
  head: () => ({ meta: [{ title: "Network Admin — SaaS Vala" }, { name: "description", content: "Network management" }] }),
  component: Page,
});

function Page() {
  const { data: netData, isLoading, error } = useQuery({
    queryKey: ["network-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Network Admin data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Network Admin" subtitle="Network management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Network Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Network Uptime", value: "99.99%", delta: "+0.01%", up: true },
    { label: "Bandwidth Usage", value: "45%", delta: "+2%", up: true },
    { label: "Active Connections", value: "12.5K", delta: "+1.2K", up: true },
    { label: "Security Events", value: "2", delta: "-3", up: true },
  ] : [];

  const columns = [
    { key: "network", label: "Network" },
    { key: "status", label: "Status" },
    { key: "bandwidth", label: "Bandwidth" },
    { key: "latency", label: "Latency" },
  ];

  const rows = [
    { network: "Primary Network", status: "Healthy", bandwidth: "2.4 Gbps", latency: "12ms" },
    { network: "Backup Network", status: "Healthy", bandwidth: "1.2 Gbps", latency: "15ms" },
    { network: "CDN Network", status: "Healthy", bandwidth: "8.5 Gbps", latency: "45ms" },
    { network: "VPN Network", status: "Healthy", bandwidth: "500 Mbps", latency: "25ms" },
  ];

  return (
    <AppShell>
      <ModulePage title="Network Admin" subtitle="Network management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
