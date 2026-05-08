import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/token-governance-officer")({
  head: () => ({ meta: [{ title: "Token Governance Officer — SaaS Vala" }, { name: "description", content: "Token governance workspace" }] }),
  component: Page,
});

function Page() {
  const { data: tokenData, isLoading, error } = useQuery({
    queryKey: ["token-governance-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Token Governance Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Token Governance Officer" subtitle="Token governance workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Token Governance Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Tokens Managed", value: "15", delta: "+2", up: true },
    { label: "Market Cap", value: "$125M", delta: "+$15M", up: true },
    { label: "Holders", value: "45K", delta: "+5K", up: true },
    { label: "Compliance Status", value: "Compliant", delta: "—", up: true },
  ];

  const columns = [
    { key: "token", label: "Token" },
    { key: "supply", label: "Total Supply" },
    { key: "price", label: "Price" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { token: "GOV-001", supply: "1B", price: "$0.50", status: "Trading" },
    { token: "GOV-002", supply: "500M", price: "$1.25", status: "Trading" },
    { token: "GOV-003", supply: "100M", price: "$5.00", status: "Trading" },
    { token: "GOV-004", supply: "250M", price: "$0.75", status: "Paused" },
    { token: "GOV-005", supply: "750M", price: "$0.30", status: "Trading" },
  ];

  return (
    <AppShell>
      <ModulePage title="Token Governance Officer" subtitle="Token governance workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
