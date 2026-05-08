import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/air-traffic-manager")({
  head: () => ({ meta: [{ title: "Air Traffic Manager — SaaS Vala" }, { name: "description", content: "Air traffic management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: atcData, isLoading, error } = useQuery({
    queryKey: ["air-traffic-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Air Traffic Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Air Traffic Manager" subtitle="Air traffic management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Air Traffic Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Aircraft Controlled", value: "125", delta: "+15", up: true },
    { label: "Sector Capacity", value: "78%", delta: "+3%", up: false },
    { label: "Safety Incidents", value: "0", delta: "0", up: true },
    { label: "Response Time", value: "30s", delta: "-5s", up: true },
  ];

  const columns = [
    { key: "aircraft", label: "Aircraft" },
    { key: "altitude", label: "Altitude" },
    { key: "heading", label: "Heading" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { aircraft: "AC-001", altitude: "35,000 ft", heading: "270°", status: "Climbing" },
    { aircraft: "AC-002", altitude: "28,000 ft", heading: "090°", status: "Cruising" },
    { aircraft: "AC-003", altitude: "15,000 ft", heading: "180°", status: "Descending" },
    { aircraft: "AC-004", altitude: "40,000 ft", heading: "045°", status: "Cruising" },
    { aircraft: "AC-005", altitude: "8,000 ft", heading: "315°", status: "Approach" },
  ];

  return (
    <AppShell>
      <ModulePage title="Air Traffic Manager" subtitle="Air traffic management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
