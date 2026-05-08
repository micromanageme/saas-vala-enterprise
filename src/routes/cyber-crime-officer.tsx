import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/cyber-crime-officer")({
  head: () => ({ meta: [{ title: "Cyber Crime Officer — SaaS Vala" }, { name: "description", content: "Cyber crime investigation workspace" }] }),
  component: Page,
});

function Page() {
  const { data: cyberData, isLoading, error } = useQuery({
    queryKey: ["cyber-crime-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Cyber Crime Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Cyber Crime Officer" subtitle="Cyber crime investigation workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Cyber Crime Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Cases Investigated", value: "85", delta: "+10", up: true },
    { label: "Threats Blocked", value: "1.2K", delta: "+150", up: true },
    { label: "Arrests Made", value: "25", delta: "+3", up: true },
    { label: "Recovery Rate", value: "65%", delta: "+5%", up: true },
  ];

  const columns = [
    { key: "case", label: "Cyber Case" },
    { key: "type", label: "Type" },
    { key: "severity", label: "Severity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { case: "CYBER-001", type: "Phishing", severity: "High", status: "In Progress" },
    { case: "CYBER-002", type: "Malware", severity: "Critical", status: "In Progress" },
    { case: "CYBER-003", type: "DDoS", severity: "Medium", status: "Resolved" },
    { case: "CYBER-004", type: "Data Breach", severity: "Critical", status: "In Progress" },
    { case: "CYBER-005", type: "Identity Theft", severity: "High", status: "Pending" },
  ];

  return (
    <AppShell>
      <ModulePage title="Cyber Crime Officer" subtitle="Cyber crime investigation workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
