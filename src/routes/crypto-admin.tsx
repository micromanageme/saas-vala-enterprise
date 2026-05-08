import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/crypto-admin")({
  head: () => ({ meta: [{ title: "Crypto Admin — SaaS Vala" }, { name: "description", content: "Cryptocurrency administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: cryptoData, isLoading, error } = useQuery({
    queryKey: ["crypto-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Crypto Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Crypto Admin" subtitle="Cryptocurrency administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Crypto Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Crypto Assets", value: "25", delta: "+3", up: true },
    { label: "Trading Volume", value: "$125M", delta: "+$15M", up: true },
    { label: "Wallet Balance", value: "$5.8M", delta: "+$500K", up: true },
    { label: "Portfolio Value", value: "$12.5M", delta: "+$2M", up: true },
  ];

  const columns = [
    { key: "asset", label: "Crypto Asset" },
    { key: "balance", label: "Balance" },
    { key: "value", label: "USD Value" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { asset: "Bitcoin (BTC)", balance: "125", value: "$5.2M", status: "Active" },
    { asset: "Ethereum (ETH)", balance: "2,500", value: "$4.5M", status: "Active" },
    { asset: "USDT", balance: "1.5M", value: "$1.5M", status: "Active" },
    { asset: "Polygon (MATIC)", balance: "500K", value: "450K", status: "Active" },
    { asset: "Solana (SOL)", balance: "25K", value: "$850K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Crypto Admin" subtitle="Cryptocurrency administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
