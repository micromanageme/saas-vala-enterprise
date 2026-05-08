import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/role-reviewer")({
  head: () => ({ meta: [{ title: "Role Reviewer — SaaS Vala" }, { name: "description", content: "Role review workspace" }] }),
  component: Page,
});

function Page() {
  const { data: roleData, isLoading, error } = useQuery({
    queryKey: ["role-reviewer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Role Reviewer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Role Reviewer" subtitle="Role review workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Role Reviewer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Roles Reviewed", value: "85", delta: "+10", up: true },
    { label: "Certifications", value: "95%", delta: "+2%", up: true },
    { label: "Violations Found", value: "3", delta: "-1", up: true },
    { label: "Remediations", value: "90%", delta: "+5%", up: true },
  ];

  const columns = [
    { key: "role", label: "Role" },
    { key: "users", label: "Users" },
    { key: "permissions", label: "Permissions" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { role: "ROLE-001", users: "50", permissions: "10", status: "Certified" },
    { role: "ROLE-002", users: "30", permissions: "15", status: "In Review" },
    { role: "ROLE-003", users: "25", permissions: "8", status: "Certified" },
    { role: "ROLE-004", users: "40", permissions: "12", status: "Violation" },
    { role: "ROLE-005", users: "20", permissions: "6", status: "Certified" },
  ];

  return (
    <AppShell>
      <ModulePage title="Role Reviewer" subtitle="Role review workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
