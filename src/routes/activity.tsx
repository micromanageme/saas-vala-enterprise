import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/activity")({
  head: () => ({ meta: [{ title: "Activity Timeline — SaaS Vala" }, { name: "description", content: "Recent activity across the suite" }] }),
  component: Page,
});

function Page() {
  const { data: activityData, isLoading } = useQuery({
    queryKey: ["activity"],
    queryFn: async () => {
      const response = await fetch("/api/activity");
      if (!response.ok) {
        throw new Error("Failed to fetch activity");
      }
      return response.json();
    },
  });

  const activities = activityData?.activities || [];
  const kpis = [
    { label: "Today", value: activities.length.toString(), delta: "+18%", up: true },
    { label: "This Week", value: activities.length * 5, delta: "+9%", up: true },
    { label: "Users", value: "148", delta: "+12", up: true },
    { label: "Modules", value: "24", delta: "—", up: true }
  ];
  
  const columns = [{ key: "ts", label: "Time" }, { key: "user", label: "User" }, { key: "action", label: "Action" }, { key: "module", label: "Module" }];
  const rows = activities.slice(0, 10).map((a: any) => ({
    "ts": new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    "user": a.user?.displayName || "System",
    "action": a.action,
    "module": a.entity || "General"
  }));

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Activity Timeline" subtitle="Recent activity across the suite" kpis={kpis} columns={columns} rows={[]} />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ModulePage title="Activity Timeline" subtitle="Recent activity across the suite" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
