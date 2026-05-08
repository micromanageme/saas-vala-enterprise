import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/parole-officer")({
  head: () => ({ meta: [{ title: "Parole Officer — SaaS Vala" }, { name: "description", content: "Parole supervision workspace" }] }),
  component: Page,
});

function Page() {
  const { data: paroleData, isLoading, error } = useQuery({
    queryKey: ["parole-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Parole Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Parole Officer" subtitle="Parole supervision workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Parole Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Parolees Supervised", value: "65", delta: "+5", up: true },
    { label: "Compliance Rate", value: "88%", delta: "+3%", up: true },
    { label: "Check-ins", value: "250", delta: "+30", up: true },
    { label: "Violations", value: "5", delta: "-2", up: true },
  ];

  const columns = [
    { key: "parolee", label: "Parolee" },
    { key: "offense", label: "Original Offense" },
    { key: "term", label: "Term Remaining" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { parolee: "PAR-001", offense: "Theft", term: "12 months", status: "Compliant" },
    { parolee: "PAR-002", offense: "Fraud", term: "18 months", status: "Compliant" },
    { parolee: "PAR-003", offense: "Assault", term: "6 months", status: "Warning" },
    { parolee: "PAR-004", offense: "Drug", term: "24 months", status: "Compliant" },
    { parolee: "PAR-005", offense: "Robbery", term: "15 months", status: "Compliant" },
  ];

  return (
    <AppShell>
      <ModulePage title="Parole Officer" subtitle="Parole supervision workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
