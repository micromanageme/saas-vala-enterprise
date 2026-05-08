import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/ldap-admin")({
  head: () => ({ meta: [{ title: "LDAP Admin — SaaS Vala" }, { name: "description", content: "LDAP administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: ldapData, isLoading, error } = useQuery({
    queryKey: ["ldap-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch LDAP Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="LDAP Admin" subtitle="LDAP administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load LDAP Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "LDAP Servers", value: "5", delta: "+1", up: true },
    { label: "Entries", value: "30K", delta: "+3K", up: true },
    { label: "Queries/sec", value: "1.2K", delta: "+100", up: true },
    { label: "Uptime", value: "99.9%", delta: "+0.1%", up: true },
  ];

  const columns = [
    { key: "server", label: "LDAP Server" },
    { key: "type", label: "Type" },
    { key: "connections", label: "Connections" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { server: "LDAP-001", type: "Master", connections: "500", status: "Active" },
    { server: "LDAP-002", type: "Replica", connections: "300", status: "Active" },
    { server: "LDAP-003", type: "Replica", connections: "350", status: "Active" },
    { server: "LDAP-004", type: "Master", connections: "450", status: "Maintenance" },
    { server: "LDAP-005", type: "Replica", connections: "200", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="LDAP Admin" subtitle="LDAP administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
