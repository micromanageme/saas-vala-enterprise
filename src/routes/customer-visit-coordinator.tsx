import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/customer-visit-coordinator")({
  head: () => ({ meta: [{ title: "Customer Visit Coordinator — SaaS Vala" }, { name: "description", content: "Customer visit coordination workspace" }] }),
  component: Page,
});

function Page() {
  const { data: visitData, isLoading, error } = useQuery({
    queryKey: ["customer-visit-coordinator-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Customer Visit Coordinator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Customer Visit Coordinator" subtitle="Customer visit coordination workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Customer Visit Coordinator data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Visits Scheduled", value: "45", delta: "+5", up: true },
    { label: "Visits Completed", value: "35", delta: "+4", up: true },
    { label: "Show Rate", value: "88%", delta: "+3%", up: true },
    { label: "Customer Rating", value: "4.6/5", delta: "+0.2", up: true },
  ];

  const columns = [
    { key: "visit", label: "Visit ID" },
    { key: "customer", label: "Customer" },
    { key: "date", label: "Date" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { visit: "VIS-001", customer: "John Smith", date: "2024-06-20", status: "Scheduled" },
    { visit: "VIS-002", customer: "Sarah Johnson", date: "2024-06-21", status: "Completed" },
    { visit: "VIS-003", customer: "Mike Brown", date: "2024-06-22", status: "Scheduled" },
    { visit: "VIS-004", customer: "Emily Davis", date: "2024-06-23", status: "Completed" },
    { visit: "VIS-005", customer: "Alex Wilson", date: "2024-06-24", status: "Cancelled" },
  ];

  return (
    <AppShell>
      <ModulePage title="Customer Visit Coordinator" subtitle="Customer visit coordination workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
