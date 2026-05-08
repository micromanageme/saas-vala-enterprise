import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/build-validation-engineer")({
  head: () => ({ meta: [{ title: "Build Validation Engineer — SaaS Vala" }, { name: "description", content: "Build validation engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: buildData, isLoading, error } = useQuery({
    queryKey: ["build-validation-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Build Validation Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Build Validation Engineer" subtitle="Build validation engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Build Validation Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Builds Validated", value: "85", delta: "+10", up: true },
    { label: "Pass Rate", value: "94%", delta: "+2%", up: true },
    { label: "Issues Found", value: "12", delta: "-3", up: true },
    { label: "Test Coverage", value: "88%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "build", label: "Build" },
    { key: "type", label: "Type" },
    { key: "tests", label: "Tests" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { build: "BLD-001", type: "CI", tests: "100", status: "Passed" },
    { build: "BLD-002", type: "CD", tests: "50", status: "Passed" },
    { build: "BLD-003", type: "CI", tests: "120", status: "Failed" },
    { build: "BLD-004", type: "CD", tests: "60", status: "Passed" },
    { build: "BLD-005", type: "CI", tests: "90", status: "In Progress" },
  ];

  return (
    <AppShell>
      <ModulePage title="Build Validation Engineer" subtitle="Build validation engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
