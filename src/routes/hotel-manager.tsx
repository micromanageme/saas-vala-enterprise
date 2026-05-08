import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/hotel-manager")({
  head: () => ({ meta: [{ title: "Hotel Manager — SaaS Vala" }, { name: "description", content: "Hotel management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: hotelData, isLoading, error } = useQuery({
    queryKey: ["hotel-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Hotel Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Hotel Manager" subtitle="Hotel management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Hotel Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Rooms Available", value: "250", delta: "+25", up: true },
    { label: "Occupancy Rate", value: "85%", delta: "+5%", up: true },
    { label: "Guest Satisfaction", value: "4.6/5", delta: "+0.2", up: true },
    { label: "Revenue", value: "$125K", delta: "+$15K", up: true },
  ];

  const columns = [
    { key: "room", label: "Room Type" },
    { key: "available", label: "Available" },
    { key: "rate", label: "Nightly Rate" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { room: "Standard", available: "50", rate: "$150", status: "Available" },
    { room: "Deluxe", available: "30", rate: "$250", status: "Available" },
    { room: "Suite", available: "15", rate: "$400", status: "Available" },
    { room: "Presidential", available: "5", rate: "$800", status: "Occupied" },
    { room: "Family", available: "20", rate: "$200", status: "Available" },
  ];

  return (
    <AppShell>
      <ModulePage title="Hotel Manager" subtitle="Hotel management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
