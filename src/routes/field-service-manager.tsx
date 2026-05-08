import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/field-service-manager")({
  head: () => ({ meta: [{ title: "Field Service Manager — SaaS Vala" }, { name: "description", content: "Field service management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: fieldData, isLoading, error } = useQuery({
    queryKey: ["field-service-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Field Service Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Field Service Manager" subtitle="Field service management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Field Service Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Technicians Active", value: "45", delta: "+5", up: true },
    { label: "Jobs Completed", value: "250", delta: "+30", up: true },
    { label: "Response Time", value: "2h", delta: "-30min", up: true },
    { label: "First-Time Fix", value: "88%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "technician", label: "Technician" },
    { key: "jobs", label: "Jobs Today" },
    { key: "region", label: "Region" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { technician: "TECH-001", jobs: "8", region: "North", status: "Active" },
    { technician: "TECH-002", jobs: "6", region: "South", status: "Active" },
    { technician: "TECH-003", jobs: "7", region: "East", status: "Active" },
    { technician: "TECH-004", jobs: "5", region: "West", status: "On Break" },
    { technician: "TECH-005", jobs: "9", region: "Central", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Field Service Manager" subtitle="Field service management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
