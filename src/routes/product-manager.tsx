import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/product-manager")({
  head: () => ({ meta: [{ title: "Product Manager — SaaS Vala" }, { name: "description", content: "Product management" }] }),
  component: Page,
});

function Page() {
  const { data: prodData, isLoading, error } = useQuery({
    queryKey: ["product-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/executive?type=all");
      if (!response.ok) throw new Error("Failed to fetch Product Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Product Manager" subtitle="Product management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Product Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Products", value: "8", delta: "+1", up: true },
    { label: "Feature Requests", value: "234", delta: "+18", up: true },
    { label: "NPS Score", value: "72", delta: "+5", up: true },
    { label: "Roadmap Progress", value: "68%", delta: "+8%", up: true },
  ];

  const columns = [
    { key: "feature", label: "Feature" },
    { key: "priority", label: "Priority" },
    { key: "votes", label: "Votes" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { feature: "AI Assistant", priority: "High", votes: "156", status: "In Development" },
    { feature: "Mobile App", priority: "Critical", votes: "234", status: "Planned" },
    { feature: "API v2", priority: "High", votes: "98", status: "In Development" },
    { feature: "Dark Mode", priority: "Medium", votes: "67", status: "Released" },
    { feature: "Export to PDF", priority: "Low", votes: "45", status: "Backlog" },
  ];

  return (
    <AppShell>
      <ModulePage title="Product Manager" subtitle="Product management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
