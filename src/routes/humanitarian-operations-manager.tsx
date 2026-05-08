import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/humanitarian-operations-manager")({
  head: () => ({ meta: [{ title: "Humanitarian Operations Manager — SaaS Vala" }, { name: "description", content: "Humanitarian operations management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: humanitarianData, isLoading, error } = useQuery({
    queryKey: ["humanitarian-operations-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Humanitarian Operations Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Humanitarian Operations Manager" subtitle="Humanitarian operations management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Humanitarian Operations Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Missions Active", value: "8", delta: "+1", up: true },
    { label: "Aid Workers", value: "250", delta: "+25", up: true },
    { label: "Countries Served", value: "12", delta: "+2", up: true },
    { label: "Budget Utilized", value: "$1.5M", delta: "+$200K", up: true },
  ];

  const columns = [
    { key: "mission", label: "Humanitarian Mission" },
    { key: "country", label: "Country" },
    { key: "workers", label: "Workers" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { mission: "MISS-001", country: "Syria", workers: "50", status: "Active" },
    { mission: "MISS-002", country: "Yemen", workers: "35", status: "Active" },
    { mission: "MISS-003", country: "South Sudan", workers: "40", status: "Active" },
    { mission: "MISS-004", country: "Afghanistan", workers: "45", status: "Planning" },
    { mission: "MISS-005", country: "Somalia", workers: "30", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Humanitarian Operations Manager" subtitle="Humanitarian operations management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
