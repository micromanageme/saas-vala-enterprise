import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/clinical-operations-manager")({
  head: () => ({ meta: [{ title: "Clinical Operations Manager — SaaS Vala" }, { name: "description", content: "Clinical operations management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: clinicalData, isLoading, error } = useQuery({
    queryKey: ["clinical-operations-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Clinical Operations Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Clinical Operations Manager" subtitle="Clinical operations management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Clinical Operations Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Procedures Scheduled", value: "125", delta: "+15", up: true },
    { label: "Completion Rate", value: "96%", delta: "+2%", up: true },
    { label: "OR Utilization", value: "82%", delta: "+3%", up: true },
    { label: "Patient Flow", value: "88%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "procedure", label: "Clinical Procedure" },
    { key: "scheduled", label: "Scheduled" },
    { key: "completed", label: "Completed" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { procedure: "Surgery - General", scheduled: "45", completed: "42", status: "Active" },
    { procedure: "Diagnostic Imaging", scheduled: "80", completed: "78", status: "Active" },
    { procedure: "Laboratory Tests", scheduled: "250", completed: "245", status: "Active" },
    { procedure: "Therapy Sessions", scheduled: "120", completed: "115", status: "Active" },
    { procedure: "Emergency Response", scheduled: "35", completed: "35", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Clinical Operations Manager" subtitle="Clinical operations management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
