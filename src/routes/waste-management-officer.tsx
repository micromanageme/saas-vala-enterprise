import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/waste-management-officer")({
  head: () => ({ meta: [{ title: "Waste Management Officer — SaaS Vala" }, { name: "description", content: "Waste management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: wasteData, isLoading, error } = useQuery({
    queryKey: ["waste-management-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Waste Management Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Waste Management Officer" subtitle="Waste management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Waste Management Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Waste Collected", value: "450 tons", delta: "+30 tons", up: true },
    { label: "Recycling Rate", value: "72%", delta: "+3%", up: true },
    { label: "Landfill Diversion", value: "65%", delta: "+4%", up: true },
    { label: "Complaints", value: "8", delta: "-2", up: true },
  ];

  const columns = [
    { key: "facility", label: "Waste Facility" },
    { key: "type", label: "Type" },
    { key: "capacity", label: "Daily Capacity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { facility: "WF-001", type: "Recycling", capacity: "150 tons", status: "Active" },
    { facility: "WF-002", type: "Landfill", capacity: "300 tons", status: "Active" },
    { facility: "WF-003", type: "Composting", capacity: "80 tons", status: "Active" },
    { facility: "WF-004", type: "Incineration", capacity: "200 tons", status: "Standby" },
    { facility: "WF-005", type: "Hazardous", capacity: "50 tons", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Waste Management Officer" subtitle="Waste management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
