import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/predictive-failure-engineer")({
  head: () => ({ meta: [{ title: "Predictive Failure Engineer — SaaS Vala" }, { name: "description", content: "Predictive failure engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: predictiveData, isLoading, error } = useQuery({
    queryKey: ["predictive-failure-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Predictive Failure Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Predictive Failure Engineer" subtitle="Predictive failure engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Predictive Failure Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Systems Monitored", value: "150", delta: "+15", up: true },
    { label: "Predictions Made", value: "85", delta: "+10", up: true },
    { label: "Accuracy", value: "94%", delta: "+2%", up: true },
    { label: "Failures Prevented", value: "25", delta: "+3", up: true },
  ];

  const columns = [
    { key: "system", label: "System" },
    { key: "risk", label: "Risk Level" },
    { key: "probability", label: "Failure Probability" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { system: "SYS-001", risk: "High", probability: "85%", status: "Monitoring" },
    { system: "SYS-002", risk: "Medium", probability: "45%", status: "Monitoring" },
    { system: "SYS-003", risk: "Low", probability: "15%", status: "Healthy" },
    { system: "SYS-004", risk: "Critical", probability: "95%", status: "Action Required" },
    { system: "SYS-005", risk: "Medium", probability: "50%", status: "Monitoring" },
  ];

  return (
    <AppShell>
      <ModulePage title="Predictive Failure Engineer" subtitle="Predictive failure engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
