import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/feature-store-admin")({
  head: () => ({ meta: [{ title: "Feature Store Admin — SaaS Vala" }, { name: "description", content: "Feature store administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: featureData, isLoading, error } = useQuery({
    queryKey: ["feature-store-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Feature Store Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Feature Store Admin" subtitle="Feature store administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Feature Store Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Features Stored", value: "2.5K", delta: "+250", up: true },
    { label: "Daily Reads", value: "50K", delta: "+5K", up: true },
    { label: "Freshness", value: "99%", delta: "+1%", up: true },
    { label: "Data Quality", value: "96%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "feature", label: "Feature" },
    { key: "group", label: "Feature Group" },
    { key: "version", label: "Version" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { feature: "FT-001", group: "Customer", version: "v2.0", status: "Active" },
    { feature: "FT-002", group: "Product", version: "v1.5", status: "Active" },
    { feature: "FT-003", group: "Transaction", version: "v3.0", status: "Active" },
    { feature: "FT-004", group: "Behavior", version: "v1.0", status: "Deprecated" },
    { feature: "FT-005", group: "Demographic", version: "v2.5", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Feature Store Admin" subtitle="Feature store administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
