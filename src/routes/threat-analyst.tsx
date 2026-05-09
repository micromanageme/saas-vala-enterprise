import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/threat-analyst")({
  head: () => ({ meta: [{ title: "Threat Analyst — SaaS Vala" }, { name: "description", content: "Threat analysis and detection" }] }),
  component: Page,
});

function Page() {
  const { data: threatData, isLoading, error } = useQuery({
    queryKey: ["threat-analyst-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Threat Analyst data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Threat Analyst" subtitle="Threat analysis and detection" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Threat Analyst data</div>
      </AppShell>
    );
  }

  const data = threatData?.data;
  const security = data?.security;
  const kpis = security ? [
    { label: "Threats Detected", value: security.suspiciousActivity.toString(), delta: "+3", up: false },
    { label: "Blocked Attacks", value: "234", delta: "+12", up: true },
    { label: "Analysis Time", value: "15min", delta: "-5min", up: true },
    { label: "False Positives", value: "5%", delta: "-2%", up: true },
  ] : [
    { label: "Threats Detected", value: "0", delta: "—", up: true },
    { label: "Blocked Attacks", value: "234", delta: "+12", up: true },
    { label: "Analysis Time", value: "15min", delta: "-5min", up: true },
    { label: "False Positives", value: "5%", delta: "-2%", up: true },
  ];

  const columns = [
    { key: "threat", label: "Threat Type" },
    { key: "source", label: "Source" },
    { key: "severity", label: "Severity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { threat: "DDoS Attack", source: "External", severity: "High", status: "Blocked" },
    { threat: "SQL Injection", source: "External", severity: "Critical", status: "Blocked" },
    { threat: "Brute Force", source: "External", severity: "Medium", status: "Blocked" },
    { threat: "XSS Attempt", source: "External", severity: "Medium", status: "Blocked" },
    { threat: "Malware Upload", source: "External", severity: "High", status: "Blocked" },
  ];

  return (
    <AppShell>
      <ModulePage title="Threat Analyst" subtitle="Threat analysis and detection" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
