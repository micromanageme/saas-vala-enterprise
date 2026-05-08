import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/version-control-admin")({
  head: () => ({ meta: [{ title: "Version Control Admin — SaaS Vala" }, { name: "description", content: "Version control administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: versionData, isLoading, error } = useQuery({
    queryKey: ["version-control-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Version Control Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Version Control Admin" subtitle="Version control administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Version Control Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Repositories", value: "50", delta: "+5", up: true },
    { label: "Commits Today", value: "150", delta: "+20", up: true },
    { label: "PRs Merged", value: "25", delta: "+3", up: true },
    { label: "Branches", value: "100", delta: "+10", up: true },
  ];

  const columns = [
    { key: "repo", label: "Repository" },
    { key: "type", label: "Type" },
    { key: "commits", label: "Commits" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { repo: "REPO-001", type: "Main", commits: "50", status: "Active" },
    { repo: "REPO-002", type: "Feature", commits: "30", status: "Active" },
    { repo: "REPO-003", type: "Hotfix", commits: "15", status: "Merged" },
    { repo: "REPO-004", type: "Main", commits: "45", status: "Active" },
    { repo: "REPO-005", type: "Feature", commits: "25", status: "In Review" },
  ];

  return (
    <AppShell>
      <ModulePage title="Version Control Admin" subtitle="Version control administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
