import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/court-admin")({
  head: () => ({ meta: [{ title: "Court Admin — SaaS Vala" }, { name: "description", content: "Court administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: courtData, isLoading, error } = useQuery({
    queryKey: ["court-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Court Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Court Admin" subtitle="Court administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Court Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Scheduled Hearings", value: "45", delta: "+5", up: true },
    { label: "Pending Judgments", value: "12", delta: "-2", up: true },
    { label: "Court Utilization", value: "85%", delta: "+3%", up: true },
    { label: "Average Wait Time", value: "14 days", delta: "-3 days", up: true },
  ];

  const columns = [
    { key: "hearing", label: "Hearing" },
    { key: "courtroom", label: "Courtroom" },
    { key: "date", label: "Date" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { hearing: "Civil Case #2024-001", courtroom: "Room A", date: "2024-06-22", status: "Scheduled" },
    { hearing: "Criminal Case #2024-003", courtroom: "Room B", date: "2024-06-23", status: "Scheduled" },
    { hearing: "Family Case #2024-005", courtroom: "Room C", date: "2024-06-24", status: "Pending" },
    { hearing: "Corporate Case #2024-007", courtroom: "Room A", date: "2024-06-25", status: "Scheduled" },
    { hearing: "Labor Case #2024-009", courtroom: "Room D", date: "2024-06-26", status: "Review" },
  ];

  return (
    <AppShell>
      <ModulePage title="Court Admin" subtitle="Court administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
