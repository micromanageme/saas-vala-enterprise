import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/iam-engineer")({
  head: () => ({ meta: [{ title: "IAM Engineer — SaaS Vala" }, { name: "description", content: "Identity and Access Management" }] }),
  component: Page,
});

function Page() {
  const { data: iamData, isLoading, error } = useQuery({
    queryKey: ["iam-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch IAM Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="IAM Engineer" subtitle="Identity and Access Management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load IAM Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Identities Managed", value: "12.5K", delta: "+0.5K", up: true },
    { label: "MFA Adoption", value: "98%", delta: "+2%", up: true },
    { label: "Failed Logins", value: "0.5%", delta: "-0.2%", up: true },
    { label: "Policy Compliance", value: "96%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "policy", label: "Policy" },
    { key: "scope", label: "Scope" },
    { key: "users", label: "Users" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { policy: "Zero Trust Access", scope: "All", users: "12.5K", status: "Active" },
    { policy: "Role-Based Access", scope: "All", users: "12.5K", status: "Active" },
    { policy: "Just-In-Time Access", scope: "Privileged", users: "450", status: "Active" },
    { policy: "Session Timeout", scope: "All", users: "12.5K", status: "Active" },
    { policy: "Device Trust", scope: "All", users: "8.2K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="IAM Engineer" subtitle="Identity and Access Management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
