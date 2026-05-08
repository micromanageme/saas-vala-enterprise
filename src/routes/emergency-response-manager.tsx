import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/emergency-response-manager")({
  head: () => ({ meta: [{ title: "Emergency Response Manager — SaaS Vala" }, { name: "description", content: "Emergency response management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: emergencyData, isLoading, error } = useQuery({
    queryKey: ["emergency-response-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Emergency Response Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Emergency Response Manager" subtitle="Emergency response management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Emergency Response Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Emergencies", value: "12", delta: "+2", up: true },
    { label: "Response Time", value: "8min", delta: "-1min", up: true },
    { label: "Teams Deployed", value: "25", delta: "+3", up: true },
    { label: "Resolution Rate", value: "92%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "incident", label: "Emergency Incident" },
    { key: "type", label: "Type" },
    { key: "severity", label: "Severity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { incident: "EMG-001", type: "Fire", severity: "High", status: "Active" },
    { incident: "EMG-002", type: "Medical", severity: "Critical", status: "Active" },
    { incident: "EMG-003", type: "Flood", severity: "Medium", status: "In Progress" },
    { incident: "EMG-004", type: "Accident", severity: "High", status: "Resolved" },
    { incident: "EMG-005", type: "Rescue", severity: "Critical", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Emergency Response Manager" subtitle="Emergency response management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
