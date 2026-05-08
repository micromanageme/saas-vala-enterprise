import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/meta-role-engine-admin")({
  head: () => ({ meta: [{ title: "Meta Role Engine Admin — SaaS Vala" }, { name: "description", content: "Meta role engine administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: metaRoleData, isLoading, error } = useQuery({
    queryKey: ["meta-role-engine-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Meta Role Engine Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Meta Role Engine Admin" subtitle="Meta role engine administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Meta Role Engine Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Roles Engineered", value: "125", delta: "+15", up: true },
    { label: "Templates Created", value: "45", delta: "+5", up: true },
    { label: "Success Rate", value: "98%", delta: "+1%", up: true },
    { label: "Adaptability Score", value: "92%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "role", label: "Meta Role" },
    { key: "domain", label: "Domain" },
    { key: "complexity", label: "Complexity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { role: "META-001", domain: "Finance", complexity: "High", status: "Active" },
    { role: "META-002", domain: "Healthcare", complexity: "Medium", status: "Active" },
    { role: "META-003", domain: "Retail", complexity: "Low", status: "Active" },
    { role: "META-004", domain: "Manufacturing", complexity: "High", status: "In Development" },
    { role: "META-005", domain: "Education", complexity: "Medium", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Meta Role Engine Admin" subtitle="Meta role engine administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
