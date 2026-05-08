import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/fitness-trainer")({
  head: () => ({ meta: [{ title: "Fitness Trainer — SaaS Vala" }, { name: "description", content: "Fitness training workspace" }] }),
  component: Page,
});

function Page() {
  const { data: trainerData, isLoading, error } = useQuery({
    queryKey: ["fitness-trainer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Fitness Trainer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Fitness Trainer" subtitle="Fitness training workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Fitness Trainer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Clients Trained", value: "45", delta: "+5", up: true },
    { label: "Sessions Completed", value: "250", delta: "+30", up: true },
    { label: "Client Satisfaction", value: "4.7/5", delta: "+0.1", up: true },
    { label: "Goal Achievement", value: "82%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "client", label: "Client" },
    { key: "program", label: "Program" },
    { key: "sessions", label: "Sessions/Week" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { client: "John Smith", program: "Weight Loss", sessions: "3", status: "Active" },
    { client: "Sarah Johnson", program: "Muscle Gain", sessions: "4", status: "Active" },
    { client: "Mike Brown", program: "Endurance", sessions: "5", status: "Active" },
    { client: "Emily Davis", program: "Flexibility", sessions: "2", status: "Active" },
    { client: "Alex Wilson", program: "Strength", sessions: "3", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Fitness Trainer" subtitle="Fitness training workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
