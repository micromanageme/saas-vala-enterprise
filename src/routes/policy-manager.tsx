import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/policy-manager")({
  head: () => ({ meta: [{ title: "Policy Manager — SaaS Vala" }, { name: "description", content: "Policy management" }] }),
  component: Page,
});

function Page() {
  const { data: policyData, isLoading, error } = useQuery({
    queryKey: ["policy-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Policy Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Policy Manager" subtitle="Policy management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Policy Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Policies", value: "23", delta: "+1", up: true },
    { label: "Pending Reviews", value: "4", delta: "-1", up: true },
    { label: "Compliance Rate", value: "94%", delta: "+2%", up: true },
    { label: "Training Complete", value: "88%", delta: "+5%", up: true },
  ];

  const columns = [
    { key: "policy", label: "Policy" },
    { key: "category", label: "Category" },
    { key: "lastUpdated", label: "Last Updated" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { policy: "Data Privacy Policy", category: "Privacy", lastUpdated: "2024-06-01", status: "Active" },
    { policy: "Security Policy", category: "Security", lastUpdated: "2024-05-15", status: "Active" },
    { policy: "Acceptable Use Policy", category: "IT", lastUpdated: "2024-04-01", status: "Review" },
    { policy: "Remote Work Policy", category: "HR", lastUpdated: "2024-06-15", status: "Active" },
    { policy: "Incident Response Policy", category: "Security", lastUpdated: "2024-03-01", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Policy Manager" subtitle="Policy management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
