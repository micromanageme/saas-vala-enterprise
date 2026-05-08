import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/smart-contract-auditor")({
  head: () => ({ meta: [{ title: "Smart Contract Auditor — SaaS Vala" }, { name: "description", content: "Smart contract auditing workspace" }] }),
  component: Page,
});

function Page() {
  const { data: auditData, isLoading, error } = useQuery({
    queryKey: ["smart-contract-auditor-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Smart Contract Auditor data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Smart Contract Auditor" subtitle="Smart contract auditing workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Smart Contract Auditor data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Contracts Audited", value: "125", delta: "+15", up: true },
    { label: "Vulnerabilities Found", value: "8", delta: "-2", up: true },
    { label: "Audit Score", value: "94%", delta: "+2%", up: true },
    { label: "Pending Reviews", value: "12", delta: "-3", up: true },
  ];

  const columns = [
    { key: "contract", label: "Smart Contract" },
    { key: "network", label: "Network" },
    { key: "issues", label: "Issues Found" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { contract: "SC-001", network: "Ethereum", issues: "0", status: "Passed" },
    { contract: "SC-002", network: "Polygon", issues: "2", status: "Review" },
    { contract: "SC-003", network: "BSC", issues: "0", status: "Passed" },
    { contract: "SC-004", network: "Arbitrum", issues: "1", status: "In Progress" },
    { contract: "SC-005", network: "Solana", issues: "0", status: "Passed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Smart Contract Auditor" subtitle="Smart contract auditing workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
