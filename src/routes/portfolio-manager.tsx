import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/portfolio-manager")({
  head: () => ({ meta: [{ title: "Portfolio Manager — SaaS Vala" }, { name: "description", content: "Portfolio management" }] }),
  component: Page,
});

function Page() {
  const { data: portfolioData, isLoading, error } = useQuery({
    queryKey: ["portfolio-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Portfolio Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Portfolio Manager" subtitle="Portfolio management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Portfolio Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Total Portfolio Value", value: "$5.8M", delta: "+$1.2M", up: true },
    { label: "ROI", value: "125%", delta: "+15%", up: true },
    { label: "Active Investments", value: "12", delta: "+2", up: true },
    { label: "Risk Score", value: "Medium", delta: "—", up: true },
  ];

  const columns = [
    { key: "project", label: "Project" },
    { key: "investment", label: "Investment" },
    { key: "return", label: "Return" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { project: "Platform V2", investment: "$1.2M", return: "150%", status: "Active" },
    { project: "Mobile App", investment: "$800K", return: "180%", status: "Active" },
    { project: "AI Platform", investment: "$1.5M", return: "200%", status: "Active" },
    { project: "Cloud Migration", investment: "$600K", return: "90%", status: "Active" },
    { project: "Security Suite", investment: "$500K", return: "110%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Portfolio Manager" subtitle="Portfolio management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
