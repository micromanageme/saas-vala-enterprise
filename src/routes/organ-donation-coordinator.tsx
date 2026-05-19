import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/organ-donation-coordinator")({
  head: () => ({ meta: [{ title: "Organ Donation Coordinator — SaaS Vala" }, { name: "description", content: "Organ donation coordination workspace" }] }),
  component: Page,
});

function Page() {
  const { data: organData, isLoading, error, refetch } = useQuery({
    queryKey: ["organ-donation-coordinator-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Organ Donation Coordinator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Organ Donation Coordinator" subtitle="Organ donation coordination workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Organ Donation Coordinator"
          subtitle="Organ donation coordination workspace"
          message="We couldn't load Organ Donation Coordinator data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Donors Registered", value: "2.5K", delta: "+150", up: true },
    { label: "Transplants Performed", value: "45", delta: "+5", up: true },
    { label: "Match Success Rate", value: "92%", delta: "+2%", up: true },
    { label: "Waiting List", value: "125", delta: "-5", up: true },
  ];

  const columns = [
    { key: "organ", label: "Organ Type" },
    { key: "waiting", label: "Waiting Patients" },
    { key: "available", label: "Available" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { organ: "Kidney", waiting: "65", available: "12", status: "Critical" },
    { organ: "Liver", waiting: "25", available: "5", status: "High" },
    { organ: "Heart", waiting: "15", available: "3", status: "Critical" },
    { organ: "Lung", waiting: "12", available: "4", status: "High" },
    { organ: "Pancreas", waiting: "8", available: "2", status: "Medium" },
  ];

  return (
    <AppShell>
      <ModulePage title="Organ Donation Coordinator" subtitle="Organ donation coordination workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
