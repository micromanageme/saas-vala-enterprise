import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/sample-processing-supervisor")({
  head: () => ({ meta: [{ title: "Sample Processing Supervisor — SaaS Vala" }, { name: "description", content: "Sample processing supervision workspace" }] }),
  component: Page,
});

function Page() {
  const { data: sampleData, isLoading, error } = useQuery({
    queryKey: ["sample-processing-supervisor-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Sample Processing Supervisor data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Sample Processing Supervisor" subtitle="Sample processing supervision workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Sample Processing Supervisor data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Samples Processed", value: "500", delta: "+50", up: true },
    { label: "Backlog", value: "25", delta: "-5", up: true },
    { label: "Quality Pass Rate", value: "95%", delta: "+2%", up: true },
    { label: "Throughput", value: "85%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "batch", label: "Processing Batch" },
    { key: "type", label: "Sample Type" },
    { key: "quantity", label: "Quantity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { batch: "BATCH-001", type: "Blood", quantity: "50", status: "Processing" },
    { batch: "BATCH-002", type: "Tissue", quantity: "30", status: "Completed" },
    { batch: "BATCH-003", type: "Urine", quantity: "40", status: "Processing" },
    { batch: "BATCH-004", type: "Swab", quantity: "60", status: "Queued" },
    { batch: "BATCH-005", type: "Blood", quantity: "45", status: "Completed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Sample Processing Supervisor" subtitle="Sample processing supervision workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
