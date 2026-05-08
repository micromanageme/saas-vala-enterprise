import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/customs-broker")({
  head: () => ({ meta: [{ title: "Customs Broker — SaaS Vala" }, { name: "description", content: "Customs brokerage workspace" }] }),
  component: Page,
});

function Page() {
  const { data: customsData, isLoading, error } = useQuery({
    queryKey: ["customs-broker-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Customs Broker data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Customs Broker" subtitle="Customs brokerage workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Customs Broker data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Declarations Filed", value: "200", delta: "+25", up: true },
    { label: "Clearance Time", value: "2 days", delta: "-0.5 days", up: true },
    { label: "Duties Collected", value: "$250K", delta: "+$30K", up: true },
    { label: "Compliance Rate", value: "99%", delta: "+0.5%", up: true },
  ];

  const columns = [
    { key: "declaration", label: "Customs Declaration" },
    { key: "type", label: "Type" },
    { key: "duty", label: "Duty Amount" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { declaration: "CUS-001", type: "Import", duty: "$5,000", status: "Cleared" },
    { declaration: "CUS-002", type: "Export", duty: "$0", status: "Cleared" },
    { declaration: "CUS-003", type: "Import", duty: "$8,500", status: "In Review" },
    { declaration: "CUS-004", type: "Import", duty: "$3,200", status: "Cleared" },
    { declaration: "CUS-005", type: "Export", duty: "$0", status: "Cleared" },
  ];

  return (
    <AppShell>
      <ModulePage title="Customs Broker" subtitle="Customs brokerage workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
