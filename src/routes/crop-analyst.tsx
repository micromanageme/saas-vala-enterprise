import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/crop-analyst")({
  head: () => ({ meta: [{ title: "Crop Analyst — SaaS Vala" }, { name: "description", content: "Crop analysis workspace" }] }),
  component: Page,
});

function Page() {
  const { data: cropData, isLoading, error } = useQuery({
    queryKey: ["crop-analyst-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Crop Analyst data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Crop Analyst" subtitle="Crop analysis workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Crop Analyst data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Crops Monitored", value: "35", delta: "+3", up: true },
    { label: "Yield Forecast", value: "+12%", delta: "+2%", up: true },
    { label: "Disease Detection", value: "95%", delta: "+3%", up: true },
    { label: "Soil Health", value: "88%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "crop", label: "Crop" },
    { key: "variety", label: "Variety" },
    { key: "health", label: "Health Score" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { crop: "Wheat", variety: "Winter", health: "92%", status: "Healthy" },
    { crop: "Corn", variety: "Sweet", health: "88%", status: "Healthy" },
    { crop: "Rice", variety: "Basmati", health: "85%", status: "Monitoring" },
    { crop: "Soybeans", variety: "GMO", health: "90%", status: "Healthy" },
    { crop: "Barley", variety: "Malt", health: "82%", status: "Warning" },
  ];

  return (
    <AppShell>
      <ModulePage title="Crop Analyst" subtitle="Crop analysis workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
