import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/housekeeping-supervisor")({
  head: () => ({ meta: [{ title: "Housekeeping Supervisor — SaaS Vala" }, { name: "description", content: "Housekeeping supervision workspace" }] }),
  component: Page,
});

function Page() {
  const { data: housekeepingData, isLoading, error } = useQuery({
    queryKey: ["housekeeping-supervisor-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Housekeeping Supervisor data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Housekeeping Supervisor" subtitle="Housekeeping supervision workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Housekeeping Supervisor data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Rooms Cleaned", value: "180", delta: "+20", up: true },
    { label: "Cleanliness Score", value: "96%", delta: "+2%", up: true },
    { label: "Staff Utilization", value: "85%", delta: "+3%", up: true },
    { label: "Guest Complaints", value: "2", delta: "-1", up: true },
  ];

  const columns = [
    { key: "staff", label: "Housekeeper" },
    { key: "rooms", label: "Rooms Assigned" },
    { key: "completed", label: "Completed" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { staff: "Mary Jones", rooms: "15", completed: "15", status: "Completed" },
    { staff: "Tom White", rooms: "12", completed: "10", status: "In Progress" },
    { staff: "Lisa Green", rooms: "14", completed: "14", status: "Completed" },
    { staff: "David Black", rooms: "13", completed: "13", status: "Completed" },
    { staff: "Anna Brown", rooms: "11", completed: "9", status: "In Progress" },
  ];

  return (
    <AppShell>
      <ModulePage title="Housekeeping Supervisor" subtitle="Housekeeping supervision workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
