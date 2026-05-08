import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/community-outreach-lead")({
  head: () => ({ meta: [{ title: "Community Outreach Lead — SaaS Vala" }, { name: "description", content: "Community outreach leadership workspace" }] }),
  component: Page,
});

function Page() {
  const { data: outreachData, isLoading, error } = useQuery({
    queryKey: ["community-outreach-lead-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Community Outreach Lead data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Community Outreach Lead" subtitle="Community outreach leadership workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Community Outreach Lead data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Outreach Programs", value: "15", delta: "+2", up: true },
    { label: "Community Members", value: "2.5K", delta: "+300", up: true },
    { label: "Events Organized", value: "45", delta: "+5", up: true },
    { label: "Engagement Rate", value: "82%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "program", label: "Outreach Program" },
    { key: "focus", label: "Focus Area" },
    { key: "participants", label: "Participants" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { program: "OUT-001", focus: "Youth Development", participants: "300", status: "Active" },
    { program: "OUT-002", focus: "Senior Care", participants: "250", status: "Active" },
    { program: "OUT-003", focus: "Health Awareness", participants: "400", status: "Active" },
    { program: "OUT-004", focus: "Skill Training", participants: "200", status: "Planning" },
    { program: "OUT-005", focus: "Environmental", participants: "350", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Community Outreach Lead" subtitle="Community outreach leadership workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
