import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/ethical-hacker")({
  head: () => ({ meta: [{ title: "Ethical Hacker — SaaS Vala" }, { name: "description", content: "Penetration testing and security assessment" }] }),
  component: Page,
});

function Page() {
  const { data: hackerData, isLoading, error } = useQuery({
    queryKey: ["ethical-hacker-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Ethical Hacker data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Ethical Hacker" subtitle="Penetration testing and security assessment" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Ethical Hacker data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Pen Tests Completed", value: "8", delta: "+2", up: true },
    { label: "Vulnerabilities Found", value: "23", delta: "+5", up: false },
    { label: "Critical Issues", value: "2", delta: "-1", up: true },
    { label: "Remediation Rate", value: "85%", delta: "+5%", up: true },
  ];

  const columns = [
    { key: "test", label: "Test" },
    { key: "target", label: "Target" },
    { key: "vulnerabilities", label: "Vulnerabilities" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { test: "External Pen Test", target: "Production API", vulnerabilities: "5", status: "Complete" },
    { test: "Internal Network Scan", target: "Internal Network", vulnerabilities: "8", status: "In Progress" },
    { test: "Web App Assessment", target: "Web Application", vulnerabilities: "6", status: "Complete" },
    { test: "Mobile App Test", target: "Mobile App", vulnerabilities: "3", status: "In Progress" },
    { test: "Social Engineering", target: "Employees", vulnerabilities: "1", status: "Complete" },
  ];

  return (
    <AppShell>
      <ModulePage title="Ethical Hacker" subtitle="Penetration testing and security assessment" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
