import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/anomaly-detection-engineer")({
  head: () => ({ meta: [{ title: "Anomaly Detection Engineer — SaaS Vala" }, { name: "description", content: "Anomaly detection engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: anomalyData, isLoading, error } = useQuery({
    queryKey: ["anomaly-detection-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Anomaly Detection Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Anomaly Detection Engineer" subtitle="Anomaly detection engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Anomaly Detection Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Anomalies Detected", value: "125", delta: "+15", up: true },
    { label: "False Positives", value: "5%", delta: "-1%", up: true },
    { label: "Response Time", value: "30sec", delta: "-5sec", up: true },
    { label: "Data Streams", value: "50", delta: "+5", up: true },
  ];

  const columns = [
    { key: "anomaly", label: "Anomaly ID" },
    { key: "type", label: "Type" },
    { key: "severity", label: "Severity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { anomaly: "ANM-001", type: "Behavioral", severity: "High", status: "Investigating" },
    { anomaly: "ANM-002", type: "Performance", severity: "Medium", status: "Resolved" },
    { anomaly: "ANM-003", type: "Security", severity: "Critical", status: "Investigating" },
    { anomaly: "ANM-004", type: "Data", severity: "Low", status: "Resolved" },
    { anomaly: "ANM-005", type: "Network", severity: "High", status: "Monitoring" },
  ];

  return (
    <AppShell>
      <ModulePage title="Anomaly Detection Engineer" subtitle="Anomaly detection engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
