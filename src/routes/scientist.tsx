import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/scientist")({
  head: () => ({ meta: [{ title: "Scientist — SaaS Vala" }, { name: "description", content: "Scientist workspace" }] }),
  component: Page,
});

function Page() {
  const { data: scientistData, isLoading, error } = useQuery({
    queryKey: ["scientist-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Scientist data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Scientist" subtitle="Scientist workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Scientist data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Experiments Conducted", value: "125", delta: "+15", up: true },
    { label: "Data Points Collected", value: "2.5M", delta: "+300K", up: true },
    { label: "Publications", value: "8", delta: "+2", up: true },
    { label: "Citations", value: "45", delta: "+8", up: true },
  ];

  const columns = [
    { key: "experiment", label: "Scientific Experiment" },
    { key: "phase", label: "Phase" },
    { key: "samples", label: "Samples" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { experiment: "EXP-2024-001", phase: "Data Collection", samples: "250", status: "Active" },
    { experiment: "EXP-2024-002", phase: "Analysis", samples: "180", status: "In Progress" },
    { experiment: "EXP-2024-003", phase: "Review", samples: "320", status: "Completed" },
    { experiment: "EXP-2024-004", phase: "Planning", samples: "0", status: "Scheduled" },
    { experiment: "EXP-2024-005", phase: "Validation", samples: "95", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Scientist" subtitle="Scientist workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
