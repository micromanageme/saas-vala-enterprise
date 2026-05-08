import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/travel-operations-manager")({
  head: () => ({ meta: [{ title: "Travel Operations Manager — SaaS Vala" }, { name: "description", content: "Travel operations management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: travelData, isLoading, error } = useQuery({
    queryKey: ["travel-operations-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Travel Operations Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Travel Operations Manager" subtitle="Travel operations management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Travel Operations Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Trips Organized", value: "250", delta: "+25", up: true },
    { label: "On-Time Performance", value: "94%", delta: "+2%", up: true },
    { label: "Customer Satisfaction", value: "4.5/5", delta: "+0.2", up: true },
    { label: "Partner Vendors", value: "45", delta: "+5", up: true },
  ];

  const columns = [
    { key: "trip", label: "Travel Trip" },
    { key: "destination", label: "Destination" },
    { key: "travelers", label: "Travelers" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { trip: "TRP-001", destination: "Paris", travelers: "25", status: "In Progress" },
    { trip: "TRP-002", destination: "Tokyo", travelers: "30", status: "Planning" },
    { trip: "TRP-003", destination: "New York", travelers: "20", status: "Completed" },
    { trip: "TRP-004", destination: "London", travelers: "35", status: "In Progress" },
    { trip: "TRP-005", destination: "Dubai", travelers: "40", status: "Planning" },
  ];

  return (
    <AppShell>
      <ModulePage title="Travel Operations Manager" subtitle="Travel operations management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
