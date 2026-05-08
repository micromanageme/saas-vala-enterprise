import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/cms-manager")({
  head: () => ({ meta: [{ title: "CMS Manager — SaaS Vala" }, { name: "description", content: "CMS management" }] }),
  component: Page,
});

function Page() {
  const { data: cmsData, isLoading, error } = useQuery({
    queryKey: ["cms-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch CMS Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="CMS Manager" subtitle="CMS management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load CMS Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Content Pages", value: "234", delta: "+12", up: true },
    { label: "Published", value: "198", delta: "+8", up: true },
    { label: "Drafts", value: "23", delta: "+3", up: false },
    { label: "Scheduled", value: "13", delta: "+2", up: true },
  ];

  const columns = [
    { key: "page", label: "Page" },
    { key: "author", label: "Author" },
    { key: "lastModified", label: "Last Modified" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { page: "Product Features", author: "John Smith", lastModified: "2h ago", status: "Published" },
    { page: "Pricing Update", author: "Sarah Johnson", lastModified: "4h ago", status: "Review" },
    { page: "Case Study", author: "Mike Brown", lastModified: "1d ago", status: "Published" },
    { page: "Blog Post", author: "Emily Davis", lastModified: "6h ago", status: "Draft" },
    { page: "Landing Page", author: "Alex Wilson", lastModified: "3h ago", status: "Scheduled" },
  ];

  return (
    <AppShell>
      <ModulePage title="CMS Manager" subtitle="CMS management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
