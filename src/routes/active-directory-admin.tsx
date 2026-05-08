import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/active-directory-admin")({
  head: () => ({ meta: [{ title: "Active Directory Admin — SaaS Vala" }, { name: "description", content: "Active Directory administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: adData, isLoading, error } = useQuery({
    queryKey: ["active-directory-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Active Directory Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Active Directory Admin" subtitle="Active Directory administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Active Directory Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Domain Controllers", value: "8", delta: "+1", up: true },
    { label: "Users", value: "20K", delta: "+1K", up: true },
    { label: "Computers", value: "5K", delta: "+200", up: true },
    { label: "Health Score", value: "98%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "dc", label: "Domain Controller" },
    { key: "site", label: "Site" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { dc: "DC-001", site: "HQ", role: "Primary", status: "Active" },
    { dc: "DC-002", site: "Branch A", role: "Secondary", status: "Active" },
    { dc: "DC-003", site: "Branch B", role: "Secondary", status: "Active" },
    { dc: "DC-004", site: "HQ", role: "Backup", status: "Standby" },
    { dc: "DC-005", site: "Branch C", role: "Secondary", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Active Directory Admin" subtitle="Active Directory administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
