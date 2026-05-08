import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-users")({
  head: () => ({ meta: [{ title: "Root User Control — Universal Access Admin" }, { name: "description", content: "Universal user management at root level" }] }),
  component: Page,
});

function Page() {
  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ["root-users"],
    queryFn: async () => {
      const response = await fetch("/api/root/users?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch root user data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root User Control" subtitle="Universal user management at root level" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root User Control data</div>
      </AppShell>
    );
  }

  const data = usersData?.data;
  const users = data?.users || [];

  const kpis = [
    { label: "Total Users", value: users.length.toString(), delta: "—", up: true },
    { label: "Super Admins", value: users.filter((u: any) => u.isSuperAdmin).length.toString(), delta: "—", up: true },
    { label: "Active Sessions", value: data?.sessions?.length.toString() || "0", delta: "—", up: true },
    { label: "Total Roles", value: data?.roles?.length.toString() || "0", delta: "—", up: true },
  ];

  const columns = [
    { key: "displayName", label: "Name" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" },
    { key: "isSuperAdmin", label: "Super Admin" },
    { key: "company", label: "Company" },
    { key: "roles", label: "Roles" },
    { key: "sessions", label: "Sessions" },
    { key: "transactions", label: "Transactions" },
  ];

  const rows = users.map((u: any) => ({
    displayName: u.displayName || "—",
    email: u.email,
    status: u.status,
    isSuperAdmin: u.isSuperAdmin ? "Yes" : "No",
    company: u.company || "—",
    roles: u.roles.map((r: any) => `${r.name}(${r.level})`).join(", ") || "—",
    sessions: u.sessions.toString(),
    transactions: u.transactions.toString(),
  }));

  return (
    <AppShell>
      <ModulePage title="Root User Control" subtitle="Universal user management at root level" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
