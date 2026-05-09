import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — SaaS Vala" }, { name: "description", content: "Enterprise reports & exports" }] }),
  component: Page,
});

function Page() {
  const { data: reportsData, isLoading, error } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await fetch("/api/reports?type=all");
      if (!response.ok) throw new Error("Failed to fetch Reports data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Reports" subtitle="Enterprise reports & exports" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Reports data</div>
      </AppShell>
    );
  }

  const data = reportsData?.data;
  const kpis = data?.kpis ? [
    { label: "Total Reports", value: data.kpis.totalReports.toString(), delta: `+${data.kpis.totalReportsDelta}`, up: data.kpis.totalReportsDelta > 0 },
    { label: "Scheduled", value: data.kpis.scheduled.toString(), delta: `+${data.kpis.scheduledDelta}`, up: data.kpis.scheduledDelta > 0 },
    { label: "Subscribers", value: data.kpis.subscribers.toString(), delta: `+${data.kpis.subscribersDelta}`, up: data.kpis.subscribersDelta > 0 },
    { label: "Exports", value: data.kpis.exports.toString(), delta: `+${data.kpis.exportsDelta}`, up: data.kpis.exportsDelta > 0 }
  ] : [];

  const columns = [{ key: "name", label: "Report" }, { key: "type", label: "Type" }, { key: "lastRun", label: "Last Run" }, { key: "subscribers", label: "Subscribers" }];
  const rows = data?.reports?.map((r: any) => ({
    name: r.name,
    type: r.type,
    lastRun: new Date(r.lastRun).toLocaleDateString(),
    subscribers: r.subscribers.toString()
  })) || [];

  return (
    <AppShell>
      <ModulePage title="Reports" subtitle="Enterprise reports & exports" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
