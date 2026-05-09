import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/security-manager")({
  head: () => ({ meta: [{ title: "Security Manager — SaaS Vala" }, { name: "description", content: "Security operations management" }] }),
  component: Page,
});

function Page() {
  const { data: secData, isLoading, error } = useQuery({
    queryKey: ["security-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Security Manager data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Security Manager" subtitle="Security operations management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Security Manager data</div>
      </AppShell>
    );
  }

  const data = secData?.data;
  const security = data?.security;
  const kpis = security ? [
    { label: "Security Score", value: "92/100", delta: "+3", up: true },
    { label: "Vulnerabilities", value: security.activeThreats.toString(), delta: "-5", up: security.activeThreats < 5 },
    { label: "Failed Logins", value: security.failedLogins.toString(), delta: "-12%", up: security.failedLogins < 10 },
    { label: "Compliance", value: "98%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "check", label: "Security Check" },
    { key: "status", label: "Status" },
    { key: "lastRun", label: "Last Run" },
    { key: "nextRun", label: "Next Run" },
  ];

  const rows = [
    { check: "Vulnerability Scan", status: "Passed", lastRun: "2h ago", nextRun: "22h" },
    { check: "Penetration Test", status: "Passed", lastRun: "3d ago", nextRun: "4d" },
    { check: "Compliance Audit", status: "Passed", lastRun: "1w ago", nextRun: "1w" },
    { check: "Access Review", status: "In Progress", lastRun: "—", nextRun: "—" },
    { check: "Security Training", status: "Pending", lastRun: "2w ago", nextRun: "2w" },
  ];

  return (
    <AppShell>
      <ModulePage title="Security Manager" subtitle="Security operations management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
