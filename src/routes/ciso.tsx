import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/ciso")({
  head: () => ({ meta: [{ title: "CISO Dashboard — SaaS Vala" }, { name: "description", content: "Chief Information Security Officer - Security oversight" }] }),
  component: Page,
});

function Page() {
  const { data: cisoData, isLoading, error } = useQuery({
    queryKey: ["ciso-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch CISO data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="CISO Dashboard" subtitle="Chief Information Security Officer - Security oversight" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load CISO data</div>
      </AppShell>
    );
  }

  const data = cisoData?.data;
  const security = data?.security;
  const kpis = security ? [
    { label: "Security Status", value: security.status, delta: "—", up: security.status === 'SECURE' },
    { label: "Failed Logins (24h)", value: security.failedLogins.toString(), delta: "-12%", up: security.failedLogins < 10 },
    { label: "Suspicious Activity", value: security.suspiciousActivity.toString(), delta: "-5%", up: security.suspiciousActivity < 5 },
    { label: "Active Threats", value: security.activeThreats.toString(), delta: "—", up: security.activeThreats === 0 },
  ] : [];

  const columns = [
    { key: "threat", label: "Threat Type" },
    { key: "severity", label: "Severity" },
    { key: "count", label: "Count" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { threat: "Phishing Attempts", severity: "High", count: "3", status: "Blocked" },
    { threat: "Brute Force", severity: "Medium", count: "12", status: "Blocked" },
    { threat: "SQL Injection", severity: "Critical", count: "0", status: "None" },
    { threat: "XSS Attacks", severity: "Medium", count: "5", status: "Blocked" },
    { threat: "DDoS", severity: "Low", count: "2", status: "Mitigated" },
  ];

  return (
    <AppShell>
      <ModulePage title="CISO Dashboard" subtitle="Chief Information Security Officer - Security oversight" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
