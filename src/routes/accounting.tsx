import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/accounting")({
  head: () => ({ meta: [{ title: "Accounting — SaaS Vala" }, { name: "description", content: "Ledger, taxes & reports" }] }),
  component: Page,
});

function Page() {
  const { data: accountingData, isLoading, error } = useQuery({
    queryKey: ["accounting"],
    queryFn: async () => {
      const response = await fetch("/api/accounting?type=all");
      if (!response.ok) throw new Error("Failed to fetch Accounting data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Accounting" subtitle="Ledger, taxes & reports" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Accounting data</div>
      </AppShell>
    );
  }

  const data = accountingData?.data;
  const kpis = data?.kpis ? [
    { label: "Cash", value: `$${(data.kpis.cash / 1000000).toFixed(2)}M`, delta: `+${data.kpis.cashDelta}%`, up: data.kpis.cashDelta > 0 },
    { label: "AR", value: `$${(data.kpis.ar / 1000).toFixed(0)}K`, delta: `${data.kpis.arDelta}%`, up: data.kpis.arDelta > 0 },
    { label: "AP", value: `$${(data.kpis.ap / 1000).toFixed(0)}K`, delta: `+${data.kpis.apDelta}%`, up: data.kpis.apDelta > 0 },
    { label: "Net Income", value: `$${(data.kpis.netIncome / 1000).toFixed(0)}K`, delta: `+${data.kpis.netIncomeDelta}%`, up: data.kpis.netIncomeDelta > 0 }
  ] : [];

  const columns = [{ key: "journal", label: "Journal" }, { key: "ref", label: "Ref" }, { key: "debit", label: "Debit" }, { key: "credit", label: "Credit" }];
  const rows = data?.journalEntries?.map((entry: any) => ({
    journal: entry.journal,
    ref: entry.ref,
    debit: entry.debit > 0 ? `$${entry.debit.toLocaleString()}` : "$0",
    credit: entry.credit > 0 ? `$${entry.credit.toLocaleString()}` : "$0"
  })) || [];

  return (
    <AppShell>
      <ModulePage title="Accounting" subtitle="Ledger, taxes & reports" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
