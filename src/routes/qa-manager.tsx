import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/qa-manager")({
  head: () => ({ meta: [{ title: "QA Manager — SaaS Vala" }, { name: "description", content: "Quality assurance management" }] }),
  component: Page,
});

function Page() {
  const { data: qaData, isLoading, error } = useQuery({
    queryKey: ["qa-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch QA Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="QA Manager" subtitle="Quality assurance management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load QA Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Test Cases", value: "456", delta: "+23", up: true },
    { label: "Pass Rate", value: "98.5%", delta: "+1.2%", up: true },
    { label: "Open Bugs", value: "12", delta: "-5", up: true },
    { label: "Coverage", value: "92%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "suite", label: "Test Suite" },
    { key: "tests", label: "Tests" },
    { key: "passRate", label: "Pass Rate" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { suite: "Unit Tests", tests: "234", passRate: "99.2%", status: "Passing" },
    { suite: "Integration Tests", tests: "123", passRate: "98.5%", status: "Passing" },
    { suite: "E2E Tests", tests: "67", passRate: "97.8%", status: "Passing" },
    { suite: "Performance Tests", tests: "32", passRate: "95.5%", status: "Warning" },
  ];

  return (
    <AppShell>
      <ModulePage title="QA Manager" subtitle="Quality assurance management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
