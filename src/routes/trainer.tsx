import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/trainer")({
  head: () => ({ meta: [{ title: "Trainer — SaaS Vala" }, { name: "description", content: "Trainer workspace" }] }),
  component: Page,
});

function Page() {
  const { data: trainerData, isLoading, error } = useQuery({
    queryKey: ["trainer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Trainer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Trainer" subtitle="Trainer workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Trainer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Training Sessions", value: "45", delta: "+5", up: true },
    { label: "Trainees", value: "280", delta: "+30", up: true },
    { label: "Completion Rate", value: "92%", delta: "+2%", up: true },
    { label: "Satisfaction Score", value: "4.6/5", delta: "+0.1", up: true },
  ];

  const columns = [
    { key: "session", label: "Training Session" },
    { key: "participants", label: "Participants" },
    { key: "duration", label: "Duration" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { session: "Leadership Training", participants: "25", duration: "8 hours", status: "Active" },
    { session: "Technical Skills", participants: "40", duration: "16 hours", status: "Active" },
    { session: "Safety Training", participants: "60", duration: "4 hours", status: "Completed" },
    { session: "Compliance Training", participants: "35", duration: "6 hours", status: "In Progress" },
    { session: "Onboarding", participants: "50", duration: "12 hours", status: "Scheduled" },
  ];

  return (
    <AppShell>
      <ModulePage title="Trainer" subtitle="Trainer workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
