import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/training-manager")({
  head: () => ({ meta: [{ title: "Training Manager — SaaS Vala" }, { name: "description", content: "Training management" }] }),
  component: Page,
});

function Page() {
  const { data: trainingData, isLoading, error, refetch } = useQuery({
    queryKey: ["training-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Training Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Training Manager" subtitle="Training management" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Training Manager"
          subtitle="Training management"
          message="We couldn't load Training Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Programs", value: "8", delta: "+1", up: true },
    { label: "Enrolled", value: "45", delta: "+8", up: true },
    { label: "Completion Rate", value: "85%", delta: "+3%", up: true },
    { label: "Satisfaction", value: "4.5/5", delta: "+0.2", up: true },
  ];

  const columns = [
    { key: "program", label: "Program" },
    { key: "type", label: "Type" },
    { key: "enrolled", label: "Enrolled" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { program: "Onboarding", type: "Mandatory", enrolled: "12", status: "Active" },
    { program: "Leadership Training", type: "Professional", enrolled: "8", status: "Active" },
    { program: "Security Awareness", type: "Mandatory", enrolled: "45", status: "Active" },
    { program: "Technical Skills", type: "Technical", enrolled: "15", status: "Active" },
    { program: "Compliance", type: "Mandatory", enrolled: "45", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Training Manager" subtitle="Training management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
