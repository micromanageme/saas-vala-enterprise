import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/referee-panel")({
  head: () => ({ meta: [{ title: "Referee Panel — SaaS Vala" }, { name: "description", content: "Referee panel workspace" }] }),
  component: Page,
});

function Page() {
  const { data: refereeData, isLoading, error } = useQuery({
    queryKey: ["referee-panel-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Referee Panel data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Referee Panel" subtitle="Referee panel workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Referee Panel data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Referees Active", value: "45", delta: "+5", up: true },
    { label: "Matches Officiated", value: "250", delta: "+30", up: true },
    { label: "Accuracy Rating", value: "96%", delta: "+2%", up: true },
    { label: "Complaints", value: "3", delta: "-1", up: true },
  ];

  const columns = [
    { key: "referee", label: "Referee" },
    { key: "sport", label: "Sport" },
    { key: "certification", label: "Certification" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { referee: "John Smith", sport: "Football", certification: "FIFA", status: "Active" },
    { referee: "Sarah Johnson", sport: "Basketball", certification: "FIBA", status: "Active" },
    { referee: "Mike Brown", sport: "Tennis", certification: "ITF", status: "Active" },
    { referee: "Emily Davis", sport: "Swimming", certification: "FINA", status: "Standby" },
    { referee: "Alex Wilson", sport: "Cricket", certification: "ICC", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Referee Panel" subtitle="Referee panel workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
