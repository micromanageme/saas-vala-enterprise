import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/lab-manager")({
  head: () => ({ meta: [{ title: "Lab Manager — SaaS Vala" }, { name: "description", content: "Laboratory management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: labData, isLoading, error } = useQuery({
    queryKey: ["lab-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Lab Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Lab Manager" subtitle="Laboratory management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Lab Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Tests Processed", value: "2.8K", delta: "+250", up: true },
    { label: "Turnaround Time", value: "4h", delta: "-0.5h", up: true },
    { label: "Accuracy Rate", value: "99.2%", delta: "+0.3%", up: true },
    { label: "Backlog", value: "45", delta: "-10", up: true },
  ];

  const columns = [
    { key: "test", label: "Laboratory Test" },
    { key: "volume", label: "Daily Volume" },
    { key: "tat", label: "Avg TAT" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { test: "Blood Chemistry", volume: "450", tat: "2h", status: "Active" },
    { test: "Hematology", volume: "380", tat: "3h", status: "Active" },
    { test: "Microbiology", volume: "120", tat: "48h", status: "Active" },
    { test: "Immunology", volume: "180", tat: "6h", status: "Active" },
    { test: "Pathology", volume: "95", tat: "24h", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Lab Manager" subtitle="Laboratory management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
