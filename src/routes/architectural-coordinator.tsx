import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/architectural-coordinator")({
  head: () => ({ meta: [{ title: "Architectural Coordinator — SaaS Vala" }, { name: "description", content: "Architectural coordination workspace" }] }),
  component: Page,
});

function Page() {
  const { data: architecturalData, isLoading, error } = useQuery({
    queryKey: ["architectural-coordinator-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Architectural Coordinator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Architectural Coordinator" subtitle="Architectural coordination workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Architectural Coordinator data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Design Projects", value: "20", delta: "+3", up: true },
    { label: "Approvals", value: "15", delta: "+2", up: true },
    { label: "Design Efficiency", value: "90%", delta: "+2%", up: true },
    { label: "Client Satisfaction", value: "4.8/5", delta: "+0.1", up: true },
  ];

  const columns = [
    { key: "project", label: "Architectural Project" },
    { key: "style", label: "Style" },
    { key: "area", label: "Area (sq ft)" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { project: "ARCH-001", style: "Modern", area: "50,000", status: "Design" },
    { project: "ARCH-002", style: "Contemporary", area: "25,000", status: "Review" },
    { project: "ARCH-003", style: "Traditional", area: "30,000", status: "Approved" },
    { project: "ARCH-004", style: "Industrial", area: "100,000", status: "Construction" },
    { project: "ARCH-005", style: "Sustainable", area: "40,000", status: "Design" },
  ];

  return (
    <AppShell>
      <ModulePage title="Architectural Coordinator" subtitle="Architectural coordination workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
