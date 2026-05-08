import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/program-manager")({
  head: () => ({ meta: [{ title: "Program Manager — SaaS Vala" }, { name: "description", content: "Program management" }] }),
  component: Page,
});

function Page() {
  const { data: programData, isLoading, error } = useQuery({
    queryKey: ["program-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Program Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Program Manager" subtitle="Program management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Program Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Programs", value: "5", delta: "+1", up: true },
    { label: "Projects in Program", value: "18", delta: "+3", up: true },
    { label: "Program Budget", value: "$2.5M", delta: "+$0.5M", up: false },
    { label: "Milestone Completion", value: "85%", delta: "+5%", up: true },
  ];

  const columns = [
    { key: "program", label: "Program" },
    { key: "projects", label: "Projects" },
    { key: "budget", label: "Budget" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { program: "Digital Transformation", projects: "8", budget: "$1.2M", status: "On Track" },
    { program: "Cloud Migration", projects: "5", budget: "$800K", status: "On Track" },
    { program: "AI Initiative", projects: "3", budget: "$500K", status: "In Progress" },
    { program: "Security Overhaul", projects: "4", budget: "$600K", status: "Planning" },
    { program: "Mobile Expansion", projects: "3", budget: "$400K", status: "On Track" },
  ];

  return (
    <AppShell>
      <ModulePage title="Program Manager" subtitle="Program management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
