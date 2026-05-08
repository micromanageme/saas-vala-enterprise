import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/attendance-manager")({
  head: () => ({ meta: [{ title: "Attendance Manager — SaaS Vala" }, { name: "description", content: "Attendance management" }] }),
  component: Page,
});

function Page() {
  const { data: attendanceData, isLoading, error } = useQuery({
    queryKey: ["attendance-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Attendance Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Attendance Manager" subtitle="Attendance management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Attendance Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Present Today", value: "142", delta: "+2", up: true },
    { label: "On Leave", value: "8", delta: "+1", up: false },
    { label: "Attendance Rate", value: "94%", delta: "+1%", up: true },
    { label: "Late Arrivals", value: "5", delta: "-2", up: true },
  ];

  const columns = [
    { key: "employee", label: "Employee" },
    { key: "department", label: "Department" },
    { key: "checkIn", label: "Check In" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { employee: "John Smith", department: "Engineering", checkIn: "8:45 AM", status: "Present" },
    { employee: "Sarah Johnson", department: "Marketing", checkIn: "9:00 AM", status: "Present" },
    { employee: "Mike Brown", department: "Sales", checkIn: "—", status: "On Leave" },
    { employee: "Emily Davis", department: "Support", checkIn: "9:15 AM", status: "Late" },
    { employee: "Alex Wilson", department: "Finance", checkIn: "8:55 AM", status: "Present" },
  ];

  return (
    <AppShell>
      <ModulePage title="Attendance Manager" subtitle="Attendance management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
