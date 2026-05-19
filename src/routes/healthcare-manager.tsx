import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/healthcare-manager")({
  head: () => ({ meta: [{ title: "Healthcare Manager — SaaS Vala" }, { name: "description", content: "Healthcare management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: healthcareData, isLoading, error, refetch } = useQuery({
    queryKey: ["healthcare-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Healthcare Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Healthcare Manager" subtitle="Healthcare management workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Healthcare Manager"
          subtitle="Healthcare management workspace"
          message="We couldn't load Healthcare Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Patients Served", value: "2.5K", delta: "+150", up: true },
    { label: "Patient Satisfaction", value: "92%", delta: "+3%", up: true },
    { label: "Readmission Rate", value: "5%", delta: "-1%", up: true },
    { label: "Avg Length of Stay", value: "4.2 days", delta: "-0.3 days", up: true },
  ];

  const columns = [
    { key: "department", label: "Healthcare Department" },
    { key: "patients", label: "Patients" },
    { key: "capacity", label: "Capacity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { department: "Emergency", patients: "250", capacity: "85%", status: "Active" },
    { department: "ICU", patients: "45", capacity: "90%", status: "Active" },
    { department: "Surgery", patients: "120", capacity: "75%", status: "Active" },
    { department: "Pediatrics", patients: "180", capacity: "70%", status: "Active" },
    { department: "Outpatient", patients: "850", capacity: "65%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Healthcare Manager" subtitle="Healthcare management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
