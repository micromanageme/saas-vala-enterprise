import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/site-engineer")({
  head: () => ({ meta: [{ title: "Site Engineer — SaaS Vala" }, { name: "description", content: "Site engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: siteData, isLoading, error } = useQuery({
    queryKey: ["site-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Site Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Site Engineer" subtitle="Site engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Site Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Sites Supervised", value: "5", delta: "+1", up: true },
    { label: "Inspections", value: "45", delta: "+5", up: true },
    { label: "Quality Score", value: "96%", delta: "+2%", up: true },
    { label: "Issues Resolved", value: "25", delta: "+3", up: true },
  ];

  const columns = [
    { key: "site", label: "Construction Site" },
    { key: "location", label: "Location" },
    { key: "workers", label: "Workers" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { site: "SITE-001", location: "Downtown", workers: "150", status: "Active" },
    { site: "SITE-002", location: "Westside", workers: "100", status: "Active" },
    { site: "SITE-003", location: "North", workers: "200", status: "Active" },
    { site: "SITE-004", location: "East", workers: "75", status: "Standby" },
    { site: "SITE-005", location: "South", workers: "125", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Site Engineer" subtitle="Site engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
