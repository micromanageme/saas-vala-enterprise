import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/universal-access-admin")({
  head: () => ({ meta: [{ title: "Universal Access Admin — SaaS Vala" }, { name: "description", content: "Universal access administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: accessData, isLoading, error } = useQuery({
    queryKey: ["universal-access-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Universal Access Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Access Admin" subtitle="Universal access administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Access Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Global Users", value: "1M", delta: "+100K", up: true },
    { label: "Access Granted", value: "98%", delta: "+1%", up: true },
    { label: "Regions", value: "50", delta: "+5", up: true },
    { label: "Uptime", value: "99.99%", delta: "+0.01%", up: true },
  ];

  const columns = [
    { key: "region", label: "Global Region" },
    { key: "users", label: "Active Users" },
    { key: "access", label: "Access Rate" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { region: "REG-001", users: "200K", access: "98%", status: "Active" },
    { region: "REG-002", users: "150K", access: "97%", status: "Active" },
    { region: "REG-003", users: "180K", access: "99%", status: "Active" },
    { region: "REG-004", users: "220K", access: "96%", status: "Degraded" },
    { region: "REG-005", users: "250K", access: "98%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Universal Access Admin" subtitle="Universal access administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
