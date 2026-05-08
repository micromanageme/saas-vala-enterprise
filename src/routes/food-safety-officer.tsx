import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/food-safety-officer")({
  head: () => ({ meta: [{ title: "Food Safety Officer — SaaS Vala" }, { name: "description", content: "Food safety workspace" }] }),
  component: Page,
});

function Page() {
  const { data: safetyData, isLoading, error } = useQuery({
    queryKey: ["food-safety-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Food Safety Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Food Safety Officer" subtitle="Food safety workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Food Safety Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Inspections", value: "125", delta: "+15", up: true },
    { label: "Compliance Rate", value: "96%", delta: "+2%", up: true },
    { label: "Violations Found", value: "8", delta: "-2", up: true },
    { label: "Safety Score", value: "98%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "facility", label: "Food Facility" },
    { key: "type", label: "Type" },
    { key: "rating", label: "Rating" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { facility: "FAC-001", type: "Processing", rating: "A", status: "Compliant" },
    { facility: "FAC-002", type: "Storage", rating: "A", status: "Compliant" },
    { facility: "FAC-003", type: "Distribution", rating: "B", status: "Review" },
    { facility: "FAC-004", type: "Retail", rating: "A", status: "Compliant" },
    { facility: "FAC-005", type: "Processing", rating: "A", status: "Compliant" },
  ];

  return (
    <AppShell>
      <ModulePage title="Food Safety Officer" subtitle="Food safety workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
