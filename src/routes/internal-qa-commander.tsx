import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/internal-qa-commander")({
  head: () => ({ meta: [{ title: "Internal QA Commander — SaaS Vala" }, { name: "description", content: "Internal QA command workspace" }] }),
  component: Page,
});

function Page() {
  const { data: qaData, isLoading, error } = useQuery({
    queryKey: ["internal-qa-commander-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Internal QA Commander data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Internal QA Commander" subtitle="Internal QA command workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Internal QA Commander data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Test Runs", value: "125", delta: "+15", up: true },
    { label: "Bugs Found", value: "25", delta: "+3", up: true },
    { label: "Coverage", value: "90%", delta: "+2%", up: true },
    { label: "Automation", value: "85%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "test", label: "Test Suite" },
    { key: "type", label: "Type" },
    { key: "cases", label: "Test Cases" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { test: "TST-001", type: "Unit", cases: "200", status: "Passed" },
    { test: "TST-002", type: "Integration", cases: "150", status: "Passed" },
    { test: "TST-003", type: "E2E", cases: "50", status: "Failed" },
    { test: "TST-004", type: "Performance", cases: "30", status: "Passed" },
    { test: "TST-005", type: "Security", cases: "40", status: "In Progress" },
  ];

  return (
    <AppShell>
      <ModulePage title="Internal QA Commander" subtitle="Internal QA command workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
