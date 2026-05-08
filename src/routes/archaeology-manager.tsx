import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/archaeology-manager")({
  head: () => ({ meta: [{ title: "Archaeology Manager — SaaS Vala" }, { name: "description", content: "Archaeology management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: archaeologyData, isLoading, error } = useQuery({
    queryKey: ["archaeology-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Archaeology Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Archaeology Manager" subtitle="Archaeology management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Archaeology Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Excavation Sites", value: "15", delta: "+2", up: true },
    { label: "Artifacts Found", value: "350", delta: "+50", up: true },
    { label: "Research Papers", value: "25", delta: "+3", up: true },
    { label: "Funding", value: "$500K", delta: "+$50K", up: true },
  ];

  const columns = [
    { key: "site", label: "Excavation Site" },
    { key: "period", label: "Historical Period" },
    { key: "finds", label: "Finds" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { site: "EXC-001", period: "Bronze Age", finds: "50", status: "Active" },
    { site: "EXC-002", period: "Iron Age", finds: "75", status: "Active" },
    { site: "EXC-003", period: "Medieval", finds: "100", status: "Completed" },
    { site: "EXC-004", period: "Roman", finds: "60", status: "Active" },
    { site: "EXC-005", period: "Neolithic", finds: "45", status: "Planning" },
  ];

  return (
    <AppShell>
      <ModulePage title="Archaeology Manager" subtitle="Archaeology management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
