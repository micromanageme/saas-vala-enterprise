import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/fishery-manager")({
  head: () => ({ meta: [{ title: "Fishery Manager — SaaS Vala" }, { name: "description", content: "Fishery management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: fisheryData, isLoading, error } = useQuery({
    queryKey: ["fishery-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Fishery Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Fishery Manager" subtitle="Fishery management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Fishery Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Fishing Vessels", value: "25", delta: "+3", up: true },
    { label: "Catch Volume", value: "450 tons", delta: "+50 tons", up: true },
    { label: "Sustainability", value: "92%", delta: "+2%", up: true },
    { label: "Market Value", value: "$2.5M", delta: "+$300K", up: true },
  ];

  const columns = [
    { key: "vessel", label: "Fishing Vessel" },
    { key: "type", label: "Type" },
    { key: "location", label: "Location" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { vessel: "FV-001", type: "Trawler", location: "North Sea", status: "Active" },
    { vessel: "FV-002", type: "Purse Seine", location: "Pacific", status: "Active" },
    { vessel: "FV-003", type: "Longline", location: "Atlantic", status: "Active" },
    { vessel: "FV-004", type: "Gillnet", location: "Indian Ocean", status: "Maintenance" },
    { vessel: "FV-005", type: "Trawler", location: "Mediterranean", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Fishery Manager" subtitle="Fishery management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
