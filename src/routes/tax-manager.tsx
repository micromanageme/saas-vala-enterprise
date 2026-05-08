import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/tax-manager")({
  head: () => ({ meta: [{ title: "Tax Manager — SaaS Vala" }, { name: "description", content: "Tax management" }] }),
  component: Page,
});

function Page() {
  const { data: taxData, isLoading, error } = useQuery({
    queryKey: ["tax-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/executive?type=all");
      if (!response.ok) throw new Error("Failed to fetch Tax Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Tax Manager" subtitle="Tax management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Tax Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Tax Liability", value: "$125K", delta: "+5%", up: false },
    { label: "Filings Due", value: "2", delta: "-1", up: true },
    { label: "Compliance Score", value: "98%", delta: "+1%", up: true },
    { label: "Savings Identified", value: "$12.5K", delta: "+$2.5K", up: true },
  ];

  const columns = [
    { key: "filing", label: "Filing" },
    { key: "type", label: "Type" },
    { key: "dueDate", label: "Due Date" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { filing: "Q2 Sales Tax", type: "Sales Tax", dueDate: "Jul 31", status: "In Progress" },
    { filing: "Q2 Payroll Tax", type: "Payroll Tax", dueDate: "Jul 31", status: "Pending" },
    { filing: "Annual Return", type: "Income Tax", dueDate: "Dec 31", status: "Scheduled" },
    { filing: "VAT Return", type: "VAT", dueDate: "Aug 15", status: "Pending" },
    { filing: "Property Tax", type: "Property Tax", dueDate: "Nov 1", status: "Scheduled" },
  ];

  return (
    <AppShell>
      <ModulePage title="Tax Manager" subtitle="Tax management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
