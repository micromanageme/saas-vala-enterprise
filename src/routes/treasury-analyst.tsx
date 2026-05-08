import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/treasury-analyst")({
  head: () => ({ meta: [{ title: "Treasury Analyst — SaaS Vala" }, { name: "description", content: "Treasury analysis workspace" }] }),
  component: Page,
});

function Page() {
  const { data: treasuryData, isLoading, error } = useQuery({
    queryKey: ["treasury-analyst-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Treasury Analyst data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Treasury Analyst" subtitle="Treasury analysis workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Treasury Analyst data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Cash Position", value: "$25M", delta: "+$3M", up: true },
    { label: "Liquidity Ratio", value: "1.5x", delta: "+0.2x", up: true },
    { label: "Investment Yield", value: "4.5%", delta: "+0.3%", up: true },
    { label: "FX Exposure", value: "$5M", delta: "-$1M", up: true },
  ];

  const columns = [
    { key: "instrument", label: "Treasury Instrument" },
    { key: "type", label: "Type" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { instrument: "T-Bill 3M", type: "Government", amount: "$5M", status: "Held" },
    { instrument: "T-Bond 10Y", type: "Government", amount: "$10M", status: "Held" },
    { instrument: "Corp Bond", type: "Corporate", amount: "$8M", status: "Held" },
    { instrument: "Money Market", type: "Cash Equivalent", amount: "$2M", status: "Held" },
    { instrument: "FX Forward", type: "Derivative", amount: "$5M", status: "Held" },
  ];

  return (
    <AppShell>
      <ModulePage title="Treasury Analyst" subtitle="Treasury analysis workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
