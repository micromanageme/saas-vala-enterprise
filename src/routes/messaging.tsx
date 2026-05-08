import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/messaging")({
  head: () => ({ meta: [{ title: "Messaging — SaaS Vala" }, { name: "description", content: "WhatsApp · SMS · Email" }] }),
  component: Page,
});

function Page() {
  const { data: messagingData, isLoading, error } = useQuery({
    queryKey: ["messaging"],
    queryFn: async () => {
      const response = await fetch("/api/messaging?type=all");
      if (!response.ok) throw new Error("Failed to fetch Messaging data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Messaging" subtitle="WhatsApp · SMS · Email" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Messaging data</div>
      </AppShell>
    );
  }

  const data = messagingData?.data;
  const kpis = data?.kpis ? [
    { label: "Sent (24h)", value: data.kpis.sent24h.toLocaleString(), delta: `+${data.kpis.sent24hDelta}%`, up: data.kpis.sent24hDelta > 0 },
    { label: "Delivered", value: `${data.kpis.delivered}%`, delta: `+${data.kpis.deliveredDelta}%`, up: data.kpis.deliveredDelta > 0 },
    { label: "Open Rate", value: `${data.kpis.openRate}%`, delta: `+${data.kpis.openRateDelta}%`, up: data.kpis.openRateDelta > 0 },
    { label: "Templates", value: data.kpis.templates.toString(), delta: `+${data.kpis.templatesDelta}`, up: data.kpis.templatesDelta > 0 }
  ] : [];

  const columns = [{ key: "channel", label: "Channel" }, { key: "template", label: "Template" }, { key: "sent", label: "Sent" }, { key: "deliveryRate", label: "Delivery" }];
  const rows = data?.campaigns?.map((c: any) => ({
    channel: c.channel,
    template: c.template,
    sent: c.sent.toLocaleString(),
    deliveryRate: `${c.deliveryRate}%`
  })) || [];

  return (
    <AppShell>
      <ModulePage title="Messaging" subtitle="WhatsApp · SMS · Email" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
