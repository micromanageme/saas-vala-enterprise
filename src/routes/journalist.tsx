import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/journalist")({
  head: () => ({ meta: [{ title: "Journalist — SaaS Vala" }, { name: "description", content: "Journalist workspace" }] }),
  component: Page,
});

function Page() {
  const { data: journalistData, isLoading, error } = useQuery({
    queryKey: ["journalist-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Journalist data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Journalist" subtitle="Journalist workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Journalist data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Articles Written", value: "45", delta: "+5", up: true },
    { label: "Interviews Conducted", value: "18", delta: "+3", up: true },
    { label: "Readership", value: "25K", delta: "+3K", up: true },
    { label: "Deadlines Met", value: "95%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "article", label: "Article" },
    { key: "topic", label: "Topic" },
    { key: "status", label: "Status" },
    { key: "due", label: "Due Date" },
  ];

  const rows = [
    { article: "ART-001", topic: "Local Politics", status: "Published", due: "2024-06-20" },
    { article: "ART-002", topic: "Community Event", status: "In Review", due: "2024-06-22" },
    { article: "ART-003", topic: "Business Profile", status: "Draft", due: "2024-06-25" },
    { article: "ART-004", topic: "Environmental Issue", status: "Research", due: "2024-06-28" },
    { article: "ART-005", topic: "Sports Feature", status: "Published", due: "2024-06-18" },
  ];

  return (
    <AppShell>
      <ModulePage title="Journalist" subtitle="Journalist workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
