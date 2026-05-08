import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/vice-chairman")({
  head: () => ({ meta: [{ title: "Vice Chairman — SaaS Vala" }, { name: "description", content: "Board Vice Chairman oversight" }] }),
  component: Page,
});

function Page() {
  const { data: viceChairData, isLoading, error } = useQuery({
    queryKey: ["vice-chairman-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/root/dashboard?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch Vice Chairman data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Vice Chairman" subtitle="Board Vice Chairman oversight" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Vice Chairman data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Committee Meetings", value: "8", delta: "+1", up: true },
    { label: "Governance Reviews", value: "5", delta: "+1", up: true },
    { label: "Audit Oversight", value: "100%", delta: "—", up: true },
    { label: "Risk Assessment", value: "Low", delta: "—", up: true },
  ];

  const columns = [
    { key: "committee", label: "Committee" },
    { key: "chair", label: "Chair" },
    { key: "meetings", label: "Meetings" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { committee: "Audit Committee", chair: "John Smith", meetings: "4", status: "Active" },
    { committee: "Compensation Committee", chair: "Sarah Johnson", meetings: "3", status: "Active" },
    { committee: "Governance Committee", chair: "Mike Brown", meetings: "4", status: "Active" },
    { committee: "Nominating Committee", chair: "Emily Davis", meetings: "2", status: "Active" },
    { committee: "Risk Committee", chair: "Alex Wilson", meetings: "3", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Vice Chairman" subtitle="Board Vice Chairman oversight" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
