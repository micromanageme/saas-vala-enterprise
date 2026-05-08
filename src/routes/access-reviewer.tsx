import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/access-reviewer")({
  head: () => ({ meta: [{ title: "Access Reviewer — SaaS Vala" }, { name: "description", content: "Access review workspace" }] }),
  component: Page,
});

function Page() {
  const { data: accessData, isLoading, error } = useQuery({
    queryKey: ["access-reviewer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Access Reviewer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Access Reviewer" subtitle="Access review workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Access Reviewer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Reviews Pending", value: "45", delta: "-8", up: true },
    { label: "Reviews Completed", value: "234", delta: "+23", up: true },
    { label: "Access Revoked", value: "12", delta: "+3", up: true },
    { label: "Compliance Rate", value: "98%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "review", label: "Access Review" },
    { key: "user", label: "User" },
    { key: "access", label: "Access Level" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { review: "AR-001234", user: "John Smith", access: "Admin", status: "Pending" },
    { review: "AR-001235", user: "Sarah Johnson", access: "Read Only", status: "Approved" },
    { review: "AR-001236", user: "Mike Brown", access: "Editor", status: "Pending" },
    { review: "AR-001237", user: "Emily Davis", access: "Admin", status: "Revoked" },
    { review: "AR-001238", user: "Alex Wilson", access: "Read Only", status: "Approved" },
  ];

  return (
    <AppShell>
      <ModulePage title="Access Reviewer" subtitle="Access review workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
