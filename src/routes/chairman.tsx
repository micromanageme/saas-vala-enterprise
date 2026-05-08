import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/chairman")({
  head: () => ({ meta: [{ title: "Chairman — SaaS Vala" }, { name: "description", content: "Board Chairman oversight" }] }),
  component: Page,
});

function Page() {
  const { data: chairmanData, isLoading, error } = useQuery({
    queryKey: ["chairman-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/root/dashboard?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch Chairman data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Chairman" subtitle="Board Chairman oversight" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Chairman data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Board Meetings", value: "12", delta: "+2", up: true },
    { label: "Shareholder Value", value: "+25%", delta: "+5%", up: true },
    { label: "Governance Score", value: "98%", delta: "+2%", up: true },
    { label: "Strategic Initiatives", value: "8", delta: "+1", up: true },
  ];

  const columns = [
    { key: "initiative", label: "Initiative" },
    { key: "status", label: "Status" },
    { key: "owner", label: "Owner" },
    { key: "deadline", label: "Deadline" },
  ];

  const rows = [
    { initiative: "Digital Transformation", status: "On Track", owner: "CEO", deadline: "2024-12-31" },
    { initiative: "Market Expansion", status: "On Track", owner: "COO", deadline: "2025-03-31" },
    { initiative: "M&A Strategy", status: "Planning", owner: "CFO", deadline: "2024-09-30" },
    { initiative: "ESG Compliance", status: "In Progress", owner: "CHRO", deadline: "2024-10-31" },
    { initiative: "Technology Overhaul", status: "On Track", owner: "CTO", deadline: "2025-06-30" },
  ];

  return (
    <AppShell>
      <ModulePage title="Chairman" subtitle="Board Chairman oversight" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
