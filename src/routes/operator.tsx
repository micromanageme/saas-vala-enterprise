import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/operator")({
  head: () => ({ meta: [{ title: "Operator — SaaS Vala" }, { name: "description", content: "Operator workspace" }] }),
  component: Page,
});

function Page() {
  const { data: operatorData, isLoading, error } = useQuery({
    queryKey: ["operator-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/user/dashboard");
      if (!response.ok) throw new Error("Failed to fetch Operator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Operator" subtitle="Operator workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Operator data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Operations Handled", value: "45", delta: "+8", up: true },
    { label: "Success Rate", value: "98%", delta: "+1%", up: true },
    { label: "Avg Response Time", value: "2.5min", delta: "-0.5min", up: true },
    { label: "Quality Score", value: "4.8/5", delta: "+0.1", up: true },
  ];

  const columns = [
    { key: "operation", label: "Operation" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "time", label: "Time" },
  ];

  const rows = [
    { operation: "User Onboarding", type: "Manual", status: "Complete", time: "5min" },
    { operation: "System Check", type: "Automated", status: "Complete", time: "1min" },
    { operation: "Data Entry", type: "Manual", status: "In Progress", time: "3min" },
    { operation: "Report Generation", type: "Automated", status: "Pending", time: "2min" },
    { operation: "Approval Review", type: "Manual", status: "Pending", time: "4min" },
  ];

  return (
    <AppShell>
      <ModulePage title="Operator" subtitle="Operator workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
