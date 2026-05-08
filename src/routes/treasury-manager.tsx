import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/treasury-manager")({
  head: () => ({ meta: [{ title: "Treasury Manager — SaaS Vala" }, { name: "description", content: "Treasury management" }] }),
  component: Page,
});

function Page() {
  const { data: treasuryData, isLoading, error } = useQuery({
    queryKey: ["treasury-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/executive?type=all");
      if (!response.ok) throw new Error("Failed to fetch Treasury Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Treasury Manager" subtitle="Treasury management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Treasury Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Cash Position", value: "$2.5M", delta: "+$0.5M", up: true },
    { label: "Investments", value: "$1.2M", delta: "+$0.2M", up: true },
    { label: "Yield", value: "4.5%", delta: "+0.3%", up: true },
    { label: "Liquidity Ratio", value: "1.8", delta: "+0.2", up: true },
  ];

  const columns = [
    { key: "account", label: "Account" },
    { key: "balance", label: "Balance" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { account: "Operating Account", balance: "$1.5M", type: "Checking", status: "Active" },
    { account: "Reserve Account", balance: "$0.8M", type: "Savings", status: "Active" },
    { account: "Investment Account", balance: "$1.2M", type: "Investment", status: "Active" },
    { account: "Payroll Account", balance: "$0.2M", type: "Checking", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Treasury Manager" subtitle="Treasury management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
