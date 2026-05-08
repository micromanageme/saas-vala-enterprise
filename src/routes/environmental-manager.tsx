import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/environmental-manager")({
  head: () => ({ meta: [{ title: "Environmental Manager — SaaS Vala" }, { name: "description", content: "Environmental management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: envData, isLoading, error } = useQuery({
    queryKey: ["environmental-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Environmental Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Environmental Manager" subtitle="Environmental management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Environmental Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Compliance Score", value: "96%", delta: "+2%", up: true },
    { label: "Carbon Footprint", value: "125 tons", delta: "-15 tons", up: true },
    { label: "Waste Recycled", value: "78%", delta: "+5%", up: true },
    { label: "Emissions Reduced", value: "25%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "initiative", label: "Environmental Initiative" },
    { key: "target", label: "Target" },
    { key: "progress", label: "Progress" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { initiative: "Carbon Reduction", target: "30%", progress: "25%", status: "On Track" },
    { initiative: "Water Conservation", target: "20%", progress: "18%", status: "On Track" },
    { initiative: "Waste Management", target: "80%", progress: "78%", status: "On Track" },
    { initiative: "Renewable Energy", target: "70%", progress: "65%", status: "In Progress" },
    { initiative: "Biodiversity", target: "50%", progress: "42%", status: "In Progress" },
  ];

  return (
    <AppShell>
      <ModulePage title="Environmental Manager" subtitle="Environmental management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
