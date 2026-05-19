import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/booking-manager")({
  head: () => ({ meta: [{ title: "Booking Manager — SaaS Vala" }, { name: "description", content: "Booking management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: bookingData, isLoading, error, refetch } = useQuery({
    queryKey: ["booking-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Booking Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Booking Manager" subtitle="Booking management workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Booking Manager"
          subtitle="Booking management workspace"
          message="We couldn't load Booking Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Bookings Today", value: "125", delta: "+15", up: true },
    { label: "Confirmation Rate", value: "92%", delta: "+2%", up: true },
    { label: "Cancellation Rate", value: "8%", delta: "-2%", up: true },
    { label: "Revenue", value: "$35K", delta: "+$5K", up: true },
  ];

  const columns = [
    { key: "booking", label: "Booking ID" },
    { key: "guest", label: "Guest" },
    { key: "checkIn", label: "Check-in Date" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { booking: "BK-001", guest: "John Smith", checkIn: "2024-06-20", status: "Confirmed" },
    { booking: "BK-002", guest: "Sarah Johnson", checkIn: "2024-06-21", status: "Pending" },
    { booking: "BK-003", guest: "Mike Brown", checkIn: "2024-06-22", status: "Confirmed" },
    { booking: "BK-004", guest: "Emily Davis", checkIn: "2024-06-23", status: "Checked In" },
    { booking: "BK-005", guest: "Alex Wilson", checkIn: "2024-06-24", status: "Confirmed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Booking Manager" subtitle="Booking management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
