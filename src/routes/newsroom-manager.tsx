import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/newsroom-manager")({
  head: () => ({ meta: [{ title: "Newsroom Manager — SaaS Vala" }, { name: "description", content: "Newsroom management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: newsroomData, isLoading, error } = useQuery({
    queryKey: ["newsroom-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Newsroom Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Newsroom Manager" subtitle="Newsroom management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Newsroom Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Stories Published", value: "250", delta: "+25", up: true },
    { label: "Journalists", value: "45", delta: "+3", up: true },
    { label: "Breaking News", value: "12", delta: "+2", up: true },
    { label: "Engagement Rate", value: "8.5%", delta: "+0.5%", up: true },
  ];

  const columns = [
    { key: "story", label: "News Story" },
    { key: "category", label: "Category" },
    { key: "author", label: "Author" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { story: "Local Election Results", category: "Politics", author: "John Smith", status: "Published" },
    { story: "Tech Breakthrough", category: "Technology", author: "Sarah Johnson", status: "In Review" },
    { story: "Sports Championship", category: "Sports", author: "Mike Brown", status: "Published" },
    { story: "Weather Alert", category: "Weather", author: "Emily Davis", status: "Breaking" },
    { story: "Business Report", category: "Business", author: "Alex Wilson", status: "Draft" },
  ];

  return (
    <AppShell>
      <ModulePage title="Newsroom Manager" subtitle="Newsroom management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
