import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/nft-manager")({
  head: () => ({ meta: [{ title: "NFT Manager — SaaS Vala" }, { name: "description", content: "NFT management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: nftData, isLoading, error } = useQuery({
    queryKey: ["nft-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch NFT Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="NFT Manager" subtitle="NFT management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load NFT Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "NFTs Minted", value: "12.5K", delta: "+1.5K", up: true },
    { label: "Collections", value: "45", delta: "+5", up: true },
    { label: "Trading Volume", value: "$2.5M", delta: "+$300K", up: true },
    { label: "Active Wallets", value: "8.5K", delta: "+500", up: true },
  ];

  const columns = [
    { key: "collection", label: "NFT Collection" },
    { key: "items", label: "Total Items" },
    { key: "floor", label: "Floor Price" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { collection: "Digital Art Series", items: "5,000", floor: "0.5 ETH", status: "Active" },
    { collection: "Gaming Assets", items: "3,500", floor: "0.2 ETH", status: "Active" },
    { collection: "Music NFTs", items: "2,000", floor: "0.1 ETH", status: "Active" },
    { collection: "Virtual Land", items: "1,500", floor: "2.0 ETH", status: "Active" },
    { collection: "Collectibles", items: "500", floor: "1.0 ETH", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="NFT Manager" subtitle="NFT management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
