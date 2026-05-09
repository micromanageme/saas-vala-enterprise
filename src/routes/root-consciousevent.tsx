import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-consciousevent")({
  head: () => ({ meta: [{ title: "Universal Conscious Event Grid — Universal Access Admin" }, { name: "description", content: "Global event awareness, cross-service cognition, realtime impact propagation" }] }),
  component: Page,
});

function Page() {
  const { data: eventData, isLoading, error } = useQuery({
    queryKey: ["root-consciousevent"],
    queryFn: async () => {
      const response = await fetch("/api/root/conscious-event-grid?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch conscious event grid data");
      return response.json();
    },
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Conscious Event Grid" subtitle="Global event awareness, cross-service cognition, realtime impact propagation" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Conscious Event Grid data</div>
      </AppShell>
    );
  }

  const data = eventData?.data;
  const awareness = data?.globalEventAwareness;
  const propagation = data?.realtimeImpactPropagation;

  const kpis = [
    { label: "Awareness Coverage", value: awareness?.awarenessCoverage || "0%", delta: "—", up: awareness?.awarenessCoverage === '100%' },
    { label: "Active Links", value: data?.crossServiceCognition?.activeLinks.toString() || "0", delta: "—", up: true },
    { label: "Containment Rate", value: data?.chainReactionContainment?.containmentRate || "0%", delta: "—", up: data?.chainReactionContainment?.containmentRate === '100%' },
  ];

  const rows = [
    { metric: "Total Services", value: awareness?.totalServices.toString() || "0", status: "OK" },
    { metric: "Cognitive Links", value: data?.crossServiceCognition?.totalCognitiveLinks.toString() || "0", status: "OK" },
    { metric: "Total Impacts", value: propagation?.totalImpacts.toString() || "0", status: "OK" },
    { metric: "Chain Reactions", value: data?.chainReactionContainment?.totalChainReactions.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Universal Conscious Event Grid" subtitle="Global event awareness, cross-service cognition, realtime impact propagation" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
