import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/master-controller")({
  head: () => ({ meta: [{ title: "Master Controller — SaaS Vala" }, { name: "description", content: "Master controller workspace" }] }),
  component: Page,
});

function Page() {
  const { data: controllerData, isLoading, error } = useQuery({
    queryKey: ["master-controller-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Master Controller data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Master Controller" subtitle="Master controller workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Master Controller data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Controllers Active", value: "25", delta: "+3", up: true },
    { label: "Commands Executed", value: "10K", delta: "+1K", up: true },
    { label: "Success Rate", value: "99%", delta: "+0.5%", up: true },
    { label: "Latency", value: "5ms", delta: "-1ms", up: true },
  ];

  const columns = [
    { key: "controller", label: "Controller" },
    { key: "domain", label: "Domain" },
    { key: "commands", label: "Commands" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { controller: "CTR-001", domain: "Infrastructure", commands: "500", status: "Active" },
    { controller: "CTR-002", domain: "Application", commands: "400", status: "Active" },
    { controller: "CTR-003", domain: "Network", commands: "350", status: "Active" },
    { controller: "CTR-004", domain: "Security", commands: "300", status: "Standby" },
    { controller: "CTR-005", domain: "Data", commands: "450", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Master Controller" subtitle="Master controller workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
