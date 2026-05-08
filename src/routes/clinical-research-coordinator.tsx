import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/clinical-research-coordinator")({
  head: () => ({ meta: [{ title: "Clinical Research Coordinator — SaaS Vala" }, { name: "description", content: "Clinical research coordination workspace" }] }),
  component: Page,
});

function Page() {
  const { data: clinicalData, isLoading, error } = useQuery({
    queryKey: ["clinical-research-coordinator-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Clinical Research Coordinator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Clinical Research Coordinator" subtitle="Clinical research coordination workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Clinical Research Coordinator data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Trials", value: "15", delta: "+2", up: true },
    { label: "Patients Enrolled", value: "450", delta: "+50", up: true },
    { label: "Protocol Compliance", value: "94%", delta: "+2%", up: true },
    { label: "Data Quality", value: "97%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "trial", label: "Clinical Trial" },
    { key: "phase", label: "Phase" },
    { key: "patients", label: "Patients" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { trial: "CTR-001", phase: "Phase III", patients: "150", status: "Active" },
    { trial: "CTR-002", phase: "Phase II", patients: "80", status: "Active" },
    { trial: "CTR-003", phase: "Phase I", patients: "30", status: "Completed" },
    { trial: "CTR-004", phase: "Phase III", patients: "120", status: "In Progress" },
    { trial: "CTR-005", phase: "Phase II", patients: "70", status: "Pending" },
  ];

  return (
    <AppShell>
      <ModulePage title="Clinical Research Coordinator" subtitle="Clinical research coordination workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
