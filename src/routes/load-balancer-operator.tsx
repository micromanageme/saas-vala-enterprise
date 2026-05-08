import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/load-balancer-operator")({
  head: () => ({ meta: [{ title: "Load Balancer Operator — SaaS Vala" }, { name: "description", content: "Load balancer operations workspace" }] }),
  component: Page,
});

function Page() {
  const { data: lbData, isLoading, error } = useQuery({
    queryKey: ["load-balancer-operator-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Load Balancer Operator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Load Balancer Operator" subtitle="Load balancer operations workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Load Balancer Operator data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Load Balancers", value: "25", delta: "+3", up: true },
    { label: "Requests/sec", value: "50K", delta: "+5K", up: true },
    { label: "Response Time", value: "25ms", delta: "-5ms", up: true },
    { label: "Health Check", value: "99%", delta: "+0.5%", up: true },
  ];

  const columns = [
    { key: "lb", label: "Load Balancer" },
    { key: "algorithm", label: "Algorithm" },
    { key: "backends", label: "Backends" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { lb: "LB-001", algorithm: "Round Robin", backends: "10", status: "Active" },
    { lb: "LB-002", algorithm: "Least Conn", backends: "8", status: "Active" },
    { lb: "LB-003", algorithm: "Weighted", backends: "12", status: "Active" },
    { lb: "LB-004", algorithm: "Round Robin", backends: "6", status: "Draining" },
    { lb: "LB-005", algorithm: "Least Conn", backends: "10", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Load Balancer Operator" subtitle="Load balancer operations workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
