import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/community-spiritual-lead")({
  head: () => ({ meta: [{ title: "Community Spiritual Lead — SaaS Vala" }, { name: "description", content: "Community spiritual leadership workspace" }] }),
  component: Page,
});

function Page() {
  const { data: spiritualLeadData, isLoading, error } = useQuery({
    queryKey: ["community-spiritual-lead-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Community Spiritual Lead data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Community Spiritual Lead" subtitle="Community spiritual leadership workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Community Spiritual Lead data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Community Members", value: "1.2K", delta: "+100", up: true },
    { label: "Programs", value: "15", delta: "+2", up: true },
    { label: "Engagement", value: "85%", delta: "+5%", up: true },
    { label: "Volunteers", value: "50", delta: "+8", up: true },
  ];

  const columns = [
    { key: "program", label: "Spiritual Program" },
    { key: "focus", label: "Focus Area" },
    { key: "participants", label: "Participants" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { program: "PRG-001", focus: "Meditation", participants: "80", status: "Active" },
    { program: "PRG-002", focus: "Youth", participants: "60", status: "Active" },
    { program: "PRG-003", focus: "Elderly", participants: "45", status: "Active" },
    { program: "PRG-004", focus: "Outreach", participants: "100", status: "In Progress" },
    { program: "PRG-005", focus: "Education", participants: "70", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Community Spiritual Lead" subtitle="Community spiritual leadership workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
