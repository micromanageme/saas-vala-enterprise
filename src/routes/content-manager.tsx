import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/content-manager")({
  head: () => ({ meta: [{ title: "Content Manager — SaaS Vala" }, { name: "description", content: "Content management" }] }),
  component: Page,
});

function Page() {
  const { data: contentData, isLoading, error } = useQuery({
    queryKey: ["content-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Content Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Content Manager" subtitle="Content management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Content Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Articles Published", value: "45", delta: "+8", up: true },
    { label: "Page Views", value: "125K", delta: "+22%", up: true },
    { label: "Avg Read Time", value: "4.5min", delta: "+0.5min", up: true },
    { label: "Content Score", value: "92", delta: "+3", up: true },
  ];

  const columns = [
    { key: "content", label: "Content" },
    { key: "type", label: "Type" },
    { key: "views", label: "Views" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { content: "Product Launch Guide", type: "Blog", views: "12,500", status: "Published" },
    { content: "How-to Tutorial", type: "Tutorial", views: "8,200", status: "Published" },
    { content: "Case Study", type: "Case Study", views: "5,600", status: "Review" },
    { content: "Industry Report", type: "Whitepaper", views: "3,400", status: "Draft" },
    { content: "Video Script", type: "Video", views: "1,200", status: "In Production" },
  ];

  return (
    <AppShell>
      <ModulePage title="Content Manager" subtitle="Content management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
