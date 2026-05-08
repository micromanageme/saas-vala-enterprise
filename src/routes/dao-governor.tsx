import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/dao-governor")({
  head: () => ({ meta: [{ title: "DAO Governor — SaaS Vala" }, { name: "description", content: "DAO governance workspace" }] }),
  component: Page,
});

function Page() {
  const { data: daoData, isLoading, error } = useQuery({
    queryKey: ["dao-governor-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch DAO Governor data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="DAO Governor" subtitle="DAO governance workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load DAO Governor data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "DAO Members", value: "2.5K", delta: "+150", up: true },
    { label: "Proposals Active", value: "12", delta: "+2", up: true },
    { label: "Voting Participation", value: "68%", delta: "+5%", up: true },
    { label: "Treasury Value", value: "$5.8M", delta: "+$300K", up: true },
  ];

  const columns = [
    { key: "proposal", label: "Governance Proposal" },
    { key: "votes", label: "Votes Cast" },
    { key: "quorum", label: "Quorum Met" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { proposal: "PROP-001", votes: "1,200", quorum: "Yes", status: "Passed" },
    { proposal: "PROP-002", votes: "950", quorum: "Yes", status: "Voting" },
    { proposal: "PROP-003", votes: "850", quorum: "Yes", status: "Voting" },
    { proposal: "PROP-004", votes: "1,500", quorum: "Yes", status: "Passed" },
    { proposal: "PROP-005", votes: "600", quorum: "No", status: "Failed" },
  ];

  return (
    <AppShell>
      <ModulePage title="DAO Governor" subtitle="DAO governance workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
