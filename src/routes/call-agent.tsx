import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/call-agent")({
  head: () => ({ meta: [{ title: "Call Agent — SaaS Vala" }, { name: "description", content: "Call agent workspace" }] }),
  component: Page,
});

function Page() {
  const { data: callData, isLoading, error } = useQuery({
    queryKey: ["call-agent-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Call Agent data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Call Agent" subtitle="Call agent workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Call Agent data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Calls Today", value: "23", delta: "+5", up: true },
    { label: "Avg Duration", value: "8min", delta: "-1min", up: true },
    { label: "Resolution Rate", value: "88%", delta: "+3%", up: true },
    { label: "CSAT Score", value: "4.4/5", delta: "+0.2", up: true },
  ];

  const columns = [
    { key: "call", label: "Call" },
    { key: "customer", label: "Customer" },
    { key: "duration", label: "Duration" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { call: "CALL-001234", customer: "John Smith", duration: "5min", status: "Completed" },
    { call: "CALL-001235", customer: "Sarah Johnson", duration: "12min", status: "Completed" },
    { call: "CALL-001236", customer: "Mike Brown", duration: "3min", status: "In Progress" },
    { call: "CALL-001237", customer: "Emily Davis", duration: "8min", status: "Completed" },
    { call: "CALL-001238", customer: "Alex Wilson", duration: "15min", status: "Completed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Call Agent" subtitle="Call agent workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
