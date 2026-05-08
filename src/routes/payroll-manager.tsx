import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/payroll-manager")({
  head: () => ({ meta: [{ title: "Payroll Manager — SaaS Vala" }, { name: "description", content: "Payroll management" }] }),
  component: Page,
});

function Page() {
  const { data: payrollData, isLoading, error } = useQuery({
    queryKey: ["payroll-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Payroll Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Payroll Manager" subtitle="Payroll management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Payroll Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Total Payroll", value: "$450K", delta: "+5%", up: false },
    { label: "Employees Paid", value: "156", delta: "+3", up: true },
    { label: "On-Time Rate", value: "100%", delta: "—", up: true },
    { label: "Discrepancies", value: "0", delta: "-2", up: true },
  ];

  const columns = [
    { key: "run", label: "Payroll Run" },
    { key: "date", label: "Date" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { run: "Monthly Payroll", date: "Jun 30", amount: "$450K", status: "Complete" },
    { run: "Bonus Run", date: "Jun 15", amount: "$85K", status: "Complete" },
    { run: "Commission Run", date: "Jun 15", amount: "$45K", status: "Complete" },
    { run: "Monthly Payroll", date: "May 31", amount: "$445K", status: "Complete" },
    { run: "Bonus Run", date: "May 15", amount: "$80K", status: "Complete" },
  ];

  return (
    <AppShell>
      <ModulePage title="Payroll Manager" subtitle="Payroll management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
