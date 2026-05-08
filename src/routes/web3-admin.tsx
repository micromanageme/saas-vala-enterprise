import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/web3-admin")({
  head: () => ({ meta: [{ title: "Web3 Admin — SaaS Vala" }, { name: "description", content: "Web3 administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: web3Data, isLoading, error } = useQuery({
    queryKey: ["web3-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Web3 Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Web3 Admin" subtitle="Web3 administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Web3 Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "DApps Deployed", value: "25", delta: "+3", up: true },
    { label: "Wallets Connected", value: "45K", delta: "+5K", up: true },
    { label: "Gas Used", value: "250M", delta: "+30M", up: true },
    { label: "Smart Contracts", value: "85", delta: "+8", up: true },
  ];

  const columns = [
    { key: "dapp", label: "Decentralized App" },
    { key: "network", label: "Network" },
    { key: "users", label: "Active Users" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { dapp: "DEX Platform", network: "Ethereum", users: "12K", status: "Active" },
    { dapp: "NFT Marketplace", network: "Polygon", users: "8K", status: "Active" },
    { dapp: "DeFi Protocol", network: "Arbitrum", users: "15K", status: "Active" },
    { dapp: "Gaming Platform", network: "BSC", users: "5K", status: "Active" },
    { dapp: "Social Network", network: "Solana", users: "3K", status: "Beta" },
  ];

  return (
    <AppShell>
      <ModulePage title="Web3 Admin" subtitle="Web3 administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
