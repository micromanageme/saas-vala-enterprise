import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/wallet-security-admin")({
  head: () => ({ meta: [{ title: "Wallet Security Admin — SaaS Vala" }, { name: "description", content: "Wallet security administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: walletData, isLoading, error } = useQuery({
    queryKey: ["wallet-security-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Wallet Security Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Wallet Security Admin" subtitle="Wallet security administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Wallet Security Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Wallets Protected", value: "125K", delta: "+5K", up: true },
    { label: "Security Alerts", value: "8", delta: "-2", up: true },
    { label: "Threats Blocked", value: "450", delta: "+50", up: true },
    { label: "Compliance Score", value: "98%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "threat", label: "Security Threat" },
    { key: "type", label: "Type" },
    { key: "severity", label: "Severity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { threat: "THREAT-001", type: "Phishing", severity: "High", status: "Blocked" },
    { threat: "THREAT-002", type: "Malware", severity: "Critical", status: "Blocked" },
    { threat: "THREAT-003", type: "Unauthorized Access", severity: "Medium", status: "Investigating" },
    { threat: "THREAT-004", type: "Suspicious Activity", severity: "Low", status: "Monitoring" },
    { threat: "THREAT-005", type: "Social Engineering", severity: "High", status: "Blocked" },
  ];

  return (
    <AppShell>
      <ModulePage title="Wallet Security Admin" subtitle="Wallet security administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
