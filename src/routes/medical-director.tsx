import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/medical-director")({
  head: () => ({ meta: [{ title: "Medical Director — SaaS Vala" }, { name: "description", content: "Medical director workspace" }] }),
  component: Page,
});

function Page() {
  const { data: medicalData, isLoading, error } = useQuery({
    queryKey: ["medical-director-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Medical Director data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Medical Director" subtitle="Medical director workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Medical Director data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Medical Staff", value: "125", delta: "+8", up: true },
    { label: "Clinical Outcomes", value: "94%", delta: "+2%", up: true },
    { label: "Quality Score", value: "96%", delta: "+1%", up: true },
    { label: "Compliance Rate", value: "98%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "specialty", label: "Medical Specialty" },
    { key: "physicians", label: "Physicians" },
    { key: "procedures", label: "Procedures/Month" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { specialty: "Cardiology", physicians: "12", procedures: "180", status: "Active" },
    { specialty: "Oncology", physicians: "10", procedures: "120", status: "Active" },
    { specialty: "Neurology", physicians: "8", procedures: "95", status: "Active" },
    { specialty: "Orthopedics", physicians: "15", procedures: "250", status: "Active" },
    { specialty: "Pediatrics", physicians: "18", procedures: "320", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Medical Director" subtitle="Medical director workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
