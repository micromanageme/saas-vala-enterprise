import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/disaster-response-officer")({
  head: () => ({ meta: [{ title: "Disaster Response Officer — SaaS Vala" }, { name: "description", content: "Disaster response workspace" }] }),
  component: Page,
});

function Page() {
  const { data: disasterData, isLoading, error } = useQuery({
    queryKey: ["disaster-response-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Disaster Response Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Disaster Response Officer" subtitle="Disaster response workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Disaster Response Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Disasters", value: "3", delta: "+1", up: true },
    { label: "People Evacuated", value: "1.2K", delta: "+200", up: true },
    { label: "Shelters Open", value: "8", delta: "+2", up: true },
    { label: "Resources Deployed", value: "95%", delta: "+5%", up: true },
  ];

  const columns = [
    { key: "disaster", label: "Disaster Event" },
    { key: "type", label: "Type" },
    { key: "affected", label: "Affected" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { disaster: "DSR-001", type: "Flood", affected: "500", status: "Active" },
    { disaster: "DSR-002", type: "Earthquake", affected: "300", status: "Active" },
    { disaster: "DSR-003", type: "Storm", affected: "400", status: "Monitoring" },
    { disaster: "DSR-004", type: "Wildfire", affected: "200", status: "Contained" },
    { disaster: "DSR-005", type: "Landslide", affected: "100", status: "Resolved" },
  ];

  return (
    <AppShell>
      <ModulePage title="Disaster Response Officer" subtitle="Disaster response workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
