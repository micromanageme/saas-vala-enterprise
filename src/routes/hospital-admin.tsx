import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/hospital-admin")({
  head: () => ({ meta: [{ title: "Hospital Admin — SaaS Vala" }, { name: "description", content: "Hospital administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: hospitalData, isLoading, error } = useQuery({
    queryKey: ["hospital-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Hospital Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Hospital Admin" subtitle="Hospital administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Hospital Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Bed Occupancy", value: "78%", delta: "+5%", up: false },
    { label: "Daily Admissions", value: "85", delta: "+8", up: true },
    { label: "Discharges", value: "92", delta: "+5", up: true },
    { label: "ER Wait Time", value: "25min", delta: "-5min", up: true },
  ];

  const columns = [
    { key: "ward", label: "Hospital Ward" },
    { key: "beds", label: "Total Beds" },
    { key: "occupied", label: "Occupied" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { ward: "ICU", beds: "20", occupied: "18", status: "Critical" },
    { ward: "Emergency", beds: "30", occupied: "25", status: "Active" },
    { ward: "Surgery", beds: "25", occupied: "20", status: "Active" },
    { ward: "General", beds: "100", occupied: "75", status: "Active" },
    { ward: "Pediatrics", beds: "40", occupied: "30", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Hospital Admin" subtitle="Hospital administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
