import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/probation-officer")({
  head: () => ({ meta: [{ title: "Probation Officer — SaaS Vala" }, { name: "description", content: "Probation supervision workspace" }] }),
  component: Page,
});

function Page() {
  const { data: probationData, isLoading, error } = useQuery({
    queryKey: ["probation-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Probation Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Probation Officer" subtitle="Probation supervision workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Probation Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Probationers Supervised", value: "85", delta: "+8", up: true },
    { label: "Program Completion", value: "75%", delta: "+5%", up: true },
    { label: "Drug Tests", value: "200", delta: "+25", up: true },
    { label: "Rehabilitation", value: "68%", delta: "+4%", up: true },
  ];

  const columns = [
    { key: "probationer", label: "Probationer" },
    { key: "program", label: "Program" },
    { key: "progress", label: "Progress" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { probationer: "PROB-001", program: "Drug Rehab", progress: "75%", status: "On Track" },
    { probationer: "PROB-002", program: "Community Service", progress: "60%", status: "On Track" },
    { probationer: "PROB-003", program: "Counseling", progress: "85%", status: "On Track" },
    { probationer: "PROB-004", program: "Education", progress: "50%", status: "Warning" },
    { probationer: "PROB-005", program: "Drug Rehab", progress: "90%", status: "On Track" },
  ];

  return (
    <AppShell>
      <ModulePage title="Probation Officer" subtitle="Probation supervision workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
