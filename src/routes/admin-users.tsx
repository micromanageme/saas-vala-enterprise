import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin-users")({
  head: () => ({ meta: [{ title: "User Management — Super Admin" }, { name: "description", content: "Global user management" }] }),
  component: Page,
});

function Page() {
  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="User Management" subtitle="Global user management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load users</div>
      </AppShell>
    );
  }

  const users = usersData?.users || [];
  const pagination = usersData?.pagination;

  const kpis = [
    { label: "Total Users", value: pagination?.totalCount.toLocaleString() || "0", delta: "—", up: true },
    { label: "Page", value: `${pagination?.page || 1}/${pagination?.totalPages || 1}`, delta: "—", up: true },
    { label: "Per Page", value: pagination?.limit?.toString() || "50", delta: "—", up: true },
  ];

  const columns = [
    { key: "displayName", label: "Name" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" },
    { key: "company", label: "Company" },
    { key: "roles", label: "Roles" },
    { key: "sessions", label: "Sessions" },
    { key: "licenses", label: "Licenses" },
  ];

  const rows = users.map((u: any) => ({
    displayName: u.displayName || "—",
    email: u.email,
    status: u.status,
    company: u.company?.name || "—",
    roles: u.roles.map((r: any) => r.name).join(", ") || "—",
    sessions: u._count?.sessions?.toString() || "0",
    licenses: u._count?.licenses?.toString() || "0",
  }));

  return (
    <AppShell>
      <ModulePage title="User Management" subtitle="Global user management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
