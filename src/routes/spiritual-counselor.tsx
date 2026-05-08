import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/spiritual-counselor")({
  head: () => ({ meta: [{ title: "Spiritual Counselor — SaaS Vala" }, { name: "description", content: "Spiritual counseling workspace" }] }),
  component: Page,
});

function Page() {
  const { data: spiritualData, isLoading, error } = useQuery({
    queryKey: ["spiritual-counselor-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Spiritual Counselor data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Spiritual Counselor" subtitle="Spiritual counseling workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Spiritual Counselor data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Sessions", value: "85", delta: "+10", up: true },
    { label: "Counseling Hours", value: "150", delta: "+20", up: true },
    { label: "Satisfaction", value: "4.8/5", delta: "+0.1", up: true },
    { label: "Follow-ups", value: "45", delta: "+5", up: true },
  ];

  const columns = [
    { key: "session", label: "Counseling Session" },
    { key: "type", label: "Type" },
    { key: "duration", label: "Duration (min)" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { session: "SES-001", type: "Individual", duration: "60", status: "Completed" },
    { session: "SES-002", type: "Group", duration: "90", status: "In Progress" },
    { session: "SES-003", type: "Individual", duration: "45", status: "Scheduled" },
    { session: "SES-004", type: "Family", duration: "90", status: "Completed" },
    { session: "SES-005", type: "Individual", duration: "60", status: "Scheduled" },
  ];

  return (
    <AppShell>
      <ModulePage title="Spiritual Counselor" subtitle="Spiritual counseling workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
