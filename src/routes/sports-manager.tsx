import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/sports-manager")({
  head: () => ({ meta: [{ title: "Sports Manager — SaaS Vala" }, { name: "description", content: "Sports management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: sportsData, isLoading, error } = useQuery({
    queryKey: ["sports-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Sports Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Sports Manager" subtitle="Sports management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Sports Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Sports Programs", value: "25", delta: "+3", up: true },
    { label: "Active Athletes", value: "450", delta: "+50", up: true },
    { label: "Tournaments Hosted", value: "15", delta: "+2", up: true },
    { label: "Facility Utilization", value: "88%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "program", label: "Sports Program" },
    { key: "participants", label: "Participants" },
    { key: "coaches", label: "Coaches" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { program: "Basketball", participants: "80", coaches: "5", status: "Active" },
    { program: "Football", participants: "120", coaches: "8", status: "Active" },
    { program: "Swimming", participants: "60", coaches: "4", status: "Active" },
    { program: "Tennis", participants: "40", coaches: "3", status: "Active" },
    { program: "Athletics", participants: "70", coaches: "5", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Sports Manager" subtitle="Sports management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
