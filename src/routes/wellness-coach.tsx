import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/wellness-coach")({
  head: () => ({ meta: [{ title: "Wellness Coach — SaaS Vala" }, { name: "description", content: "Wellness coaching workspace" }] }),
  component: Page,
});

function Page() {
  const { data: wellnessData, isLoading, error } = useQuery({
    queryKey: ["wellness-coach-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Wellness Coach data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Wellness Coach" subtitle="Wellness coaching workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Wellness Coach data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Clients Coached", value: "35", delta: "+5", up: true },
    { label: "Wellness Score", value: "85%", delta: "+3%", up: true },
    { label: "Session Rating", value: "4.8/5", delta: "+0.1", up: true },
    { label: "Retention Rate", value: "90%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "client", label: "Client" },
    { key: "focus", label: "Focus Area" },
    { key: "progress", label: "Progress" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { client: "John Smith", focus: "Stress Management", progress: "75%", status: "Active" },
    { client: "Sarah Johnson", focus: "Nutrition", progress: "80%", status: "Active" },
    { client: "Mike Brown", focus: "Sleep Quality", progress: "70%", status: "Active" },
    { client: "Emily Davis", focus: "Mental Health", progress: "85%", status: "Active" },
    { client: "Alex Wilson", focus: "Work-Life Balance", progress: "65%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Wellness Coach" subtitle="Wellness coaching workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
