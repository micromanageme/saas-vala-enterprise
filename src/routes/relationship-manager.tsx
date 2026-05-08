import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/relationship-manager")({
  head: () => ({ meta: [{ title: "Relationship Manager — SaaS Vala" }, { name: "description", content: "Relationship management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: rmData, isLoading, error } = useQuery({
    queryKey: ["relationship-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Relationship Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Relationship Manager" subtitle="Relationship management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Relationship Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Key Accounts", value: "12", delta: "+1", up: true },
    { label: "Relationship Score", value: "4.7/5", delta: "+0.1", up: true },
    { label: "Touchpoints", value: "45", delta: "+8", up: true },
    { label: "Deal Pipeline", value: "$2.5M", delta: "+$0.5M", up: true },
  ];

  const columns = [
    { key: "account", label: "Key Account" },
    { key: "value", label: "Account Value" },
    { key: "touchpoints", label: "Touchpoints" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { account: "Acme Corp", value: "$500K", touchpoints: "12", status: "Strategic" },
    { account: "Tech Solutions", value: "$350K", touchpoints: "10", status: "Strategic" },
    { account: "Global Retail", value: "$280K", touchpoints: "8", status: "Growing" },
    { account: "StartUp Inc", value: "$200K", touchpoints: "6", status: "Developing" },
    { account: "Enterprise LLC", value: "$150K", touchpoints: "9", status: "Strategic" },
  ];

  return (
    <AppShell>
      <ModulePage title="Relationship Manager" subtitle="Relationship management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
