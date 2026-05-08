import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/platform-superuser")({
  head: () => ({ meta: [{ title: "Platform Superuser — SaaS Vala" }, { name: "description", content: "Platform superuser access" }] }),
  component: Page,
});

function Page() {
  const { data: superuserData, isLoading, error } = useQuery({
    queryKey: ["platform-superuser-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/root/dashboard?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch Platform Superuser data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Platform Superuser" subtitle="Platform superuser access" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Platform Superuser data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Platform Modules", value: "23", delta: "+2", up: true },
    { label: "Active Tenants", value: "156", delta: "+12", up: true },
    { label: "System Load", value: "68%", delta: "+5%", up: false },
    { label: "Uptime", value: "99.9%", delta: "—", up: true },
  ];

  const columns = [
    { key: "module", label: "Platform Module" },
    { key: "tenants", label: "Active Tenants" },
    { key: "status", label: "Status" },
    { key: "version", label: "Version" },
  ];

  const rows = [
    { module: "Core Platform", tenants: "156", status: "Active", version: "v2.3.1" },
    { module: "Authentication", tenants: "156", status: "Active", version: "v1.8.5" },
    { module: "Database Service", tenants: "156", status: "Active", version: "v3.2.0" },
    { module: "File Storage", tenants: "156", status: "Active", version: "v2.1.3" },
    { module: "Messaging", tenants: "156", status: "Active", version: "v1.5.2" },
  ];

  return (
    <AppShell>
      <ModulePage title="Platform Superuser" subtitle="Platform superuser access" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
