import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/access-control-admin")({
  head: () => ({ meta: [{ title: "Access Control Admin — SaaS Vala" }, { name: "description", content: "Access control administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: accessData, isLoading, error } = useQuery({
    queryKey: ["access-control-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Access Control Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Access Control Admin" subtitle="Access control administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Access Control Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Policies Enforced", value: "250", delta: "+25", up: true },
    { label: "Access Requests", value: "150", delta: "+15", up: true },
    { label: "Denials", value: "5%", delta: "-1%", up: true },
    { label: "Compliance", value: "98%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "policy", label: "Access Policy" },
    { key: "resource", label: "Resource" },
    { key: "users", label: "Users" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { policy: "POL-001", resource: "Database", users: "50", status: "Active" },
    { policy: "POL-002", resource: "API", users: "100", status: "Active" },
    { policy: "POL-003", resource: "File System", users: "75", status: "Active" },
    { policy: "POL-004", resource: "Network", users: "25", status: "In Review" },
    { policy: "POL-005", resource: "Application", users: "60", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Access Control Admin" subtitle="Access control administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
