import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Support — SaaS Vala" }, { name: "description", content: "Tickets, SLA & live chat" }] }),
  component: Page,
});

function Page() {
  const { data: supportData, isLoading, error } = useQuery({
    queryKey: ["support"],
    queryFn: async () => {
      const response = await fetch("/api/support/tickets?type=all");
      if (!response.ok) throw new Error("Failed to fetch Support data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Support" subtitle="Tickets, SLA & live chat" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Support data</div>
      </AppShell>
    );
  }

  const data = supportData?.data;
  const kpis = data?.kpis ? [
    { label: "Open Tickets", value: data.kpis.openTickets.toString(), delta: `+${data.kpis.openTicketsDelta}`, up: data.kpis.openTicketsDelta > 0 },
    { label: "SLA Hit Rate", value: `${data.kpis.slaHitRate}%`, delta: `${data.kpis.slaHitRateDelta}%`, up: data.kpis.slaHitRateDelta > 0 },
    { label: "CSAT", value: data.kpis.csat.toString(), delta: `+${data.kpis.csatDelta}`, up: data.kpis.csatDelta > 0 },
    { label: "Avg Reply", value: `${data.kpis.avgReplyTime}h`, delta: `${data.kpis.avgReplyTimeDelta}h`, up: data.kpis.avgReplyTimeDelta < 0 }
  ] : [];

  const columns = [{ key: "id", label: "#" }, { key: "subject", label: "Subject" }, { key: "priority", label: "Priority" }, { key: "status", label: "Status" }];
  const rows = data?.tickets?.slice(0, 10).map((t: any) => ({
    id: `T-${t.id.substring(0, 6)}`,
    subject: t.subject,
    priority: t.priority,
    status: t.status
  })) || [];

  return (
    <AppShell>
      <ModulePage title="Support" subtitle="Tickets, SLA & live chat" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
