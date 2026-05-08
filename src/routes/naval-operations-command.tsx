import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/naval-operations-command")({
  head: () => ({ meta: [{ title: "Naval Operations Command — SaaS Vala" }, { name: "description", content: "Naval operations command workspace" }] }),
  component: Page,
});

function Page() {
  const { data: navalData, isLoading, error } = useQuery({
    queryKey: ["naval-operations-command-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Naval Operations Command data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Naval Operations Command" subtitle="Naval operations command workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Naval Operations Command data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Vessels Deployed", value: "18", delta: "+2", up: true },
    { label: "Patrol Hours", value: "2.5K", delta: "+300", up: true },
    { label: "Maritime Security", value: "95%", delta: "+2%", up: true },
    { label: "Rescue Operations", value: "5", delta: "+1", up: true },
  ];

  const columns = [
    { key: "vessel", label: "Naval Vessel" },
    { key: "type", label: "Type" },
    { key: "location", label: "Location" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { vessel: "NV-DESTROYER-01", type: "Destroyer", location: "Northern Fleet", status: "Deployed" },
    { vessel: "NV-FRIGATE-02", type: "Frigate", location: "Southern Fleet", status: "Active" },
    { vessel: "NV-PATROL-03", type: "Patrol", location: "Eastern Fleet", status: "Deployed" },
    { vessel: "NV-SUBMARINE-04", type: "Submarine", location: "Western Fleet", status: "Standby" },
    { vessel: "NV-CARRIER-05", type: "Carrier", location: "Central Fleet", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Naval Operations Command" subtitle="Naval operations command workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
