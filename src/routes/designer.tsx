import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/designer")({
  head: () => ({ meta: [{ title: "Designer — SaaS Vala" }, { name: "description", content: "Design workspace" }] }),
  component: Page,
});

function Page() {
  const { data: designerData, isLoading, error } = useQuery({
    queryKey: ["designer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Designer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Designer" subtitle="Design workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Designer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Projects", value: "8", delta: "+1", up: true },
    { label: "Designs Created", value: "23", delta: "+5", up: true },
    { label: "Assets Delivered", value: "45", delta: "+8", up: true },
    { label: "Client Satisfaction", value: "4.6/5", delta: "+0.2", up: true },
  ];

  const columns = [
    { key: "project", label: "Project" },
    { key: "type", label: "Type" },
    { key: "progress", label: "Progress" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { project: "Homepage Redesign", type: "UI Design", progress: "75%", status: "In Progress" },
    { project: "Mobile App Icons", type: "Icon Set", progress: "100%", status: "Complete" },
    { project: "Marketing Assets", type: "Graphics", progress: "50%", status: "In Progress" },
    { project: "Brand Guidelines", type: "Branding", progress: "90%", status: "Review" },
    { project: "Email Templates", type: "Design", progress: "100%", status: "Complete" },
  ];

  return (
    <AppShell>
      <ModulePage title="Designer" subtitle="Design workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
