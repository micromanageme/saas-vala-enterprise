import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/telecom-manager")({
  head: () => ({ meta: [{ title: "Telecom Manager — SaaS Vala" }, { name: "description", content: "Telecom management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: telecomData, isLoading, error } = useQuery({
    queryKey: ["telecom-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Telecom Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Telecom Manager" subtitle="Telecom management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Telecom Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Subscribers", value: "125K", delta: "+5K", up: true },
    { label: "Network Uptime", value: "99.9%", delta: "+0.1%", up: true },
    { label: "Data Traffic", value: "45 PB", delta: "+5 PB", up: true },
    { label: "Churn Rate", value: "1.2%", delta: "-0.3%", up: true },
  ];

  const columns = [
    { key: "service", label: "Telecom Service" },
    { key: "users", label: "Active Users" },
    { key: "bandwidth", label: "Bandwidth" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { service: "Mobile 5G", users: "80K", bandwidth: "100 Gbps", status: "Active" },
    { service: "Fiber Broadband", users: "35K", bandwidth: "50 Gbps", status: "Active" },
    { service: "Landline", users: "10K", bandwidth: "5 Gbps", status: "Active" },
    { service: "VoIP", users: "20K", bandwidth: "10 Gbps", status: "Active" },
    { service: "IPTV", users: "15K", bandwidth: "20 Gbps", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Telecom Manager" subtitle="Telecom management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
