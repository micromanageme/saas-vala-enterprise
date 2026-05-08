import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/corporate-law-advisor")({
  head: () => ({ meta: [{ title: "Corporate Law Advisor — SaaS Vala" }, { name: "description", content: "Corporate law advisory workspace" }] }),
  component: Page,
});

function Page() {
  const { data: lawData, isLoading, error } = useQuery({
    queryKey: ["corporate-law-advisor-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Corporate Law Advisor data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Corporate Law Advisor" subtitle="Corporate law advisory workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Corporate Law Advisor data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Advisory Cases", value: "18", delta: "+2", up: true },
    { label: "Contract Reviews", value: "25", delta: "+3", up: true },
    { label: "Compliance Issues", value: "3", delta: "-1", up: true },
    { label: "Risk Score", value: "Low", delta: "—", up: true },
  ];

  const columns = [
    { key: "matter", label: "Legal Matter" },
    { key: "client", label: "Client" },
    { key: "status", label: "Status" },
    { key: "deadline", label: "Deadline" },
  ];

  const rows = [
    { matter: "Merger Agreement Review", client: "Acme Corp", status: "In Progress", deadline: "2024-06-25" },
    { matter: "IP Portfolio Analysis", client: "Tech Solutions", status: "Review", deadline: "2024-06-30" },
    { matter: "Regulatory Compliance", client: "Global Retail", status: "Active", deadline: "2024-07-01" },
    { matter: "Shareholder Agreement", client: "StartUp Inc", status: "Draft", deadline: "2024-07-15" },
    { matter: "Tax Advisory", client: "Enterprise LLC", status: "Pending", deadline: "2024-07-20" },
  ];

  return (
    <AppShell>
      <ModulePage title="Corporate Law Advisor" subtitle="Corporate law advisory workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
