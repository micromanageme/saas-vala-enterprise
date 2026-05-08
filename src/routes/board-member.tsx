import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/board-member")({
  head: () => ({ meta: [{ title: "Board Member — SaaS Vala" }, { name: "description", content: "Board member workspace" }] }),
  component: Page,
});

function Page() {
  const { data: boardMemberData, isLoading, error } = useQuery({
    queryKey: ["board-member-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/root/dashboard?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch Board Member data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Board Member" subtitle="Board member workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Board Member data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Board Meetings Attended", value: "11/12", delta: "+1", up: true },
    { label: "Committees", value: "2", delta: "—", up: true },
    { label: "Votes Cast", value: "45", delta: "+8", up: true },
    { label: "Proposals Submitted", value: "3", delta: "+1", up: true },
  ];

  const columns = [
    { key: "meeting", label: "Meeting" },
    { key: "date", label: "Date" },
    { key: "attendance", label: "Attendance" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { meeting: "Q2 Board Meeting", date: "2024-06-15", attendance: "Present", status: "Complete" },
    { meeting: "Audit Committee", date: "2024-06-10", attendance: "Present", status: "Complete" },
    { meeting: "Governance Committee", date: "2024-06-05", attendance: "Present", status: "Complete" },
    { meeting: "Strategy Session", date: "2024-05-20", attendance: "Present", status: "Complete" },
    { meeting: "Q1 Board Meeting", date: "2024-03-15", attendance: "Absent", status: "Complete" },
  ];

  return (
    <AppShell>
      <ModulePage title="Board Member" subtitle="Board member workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
