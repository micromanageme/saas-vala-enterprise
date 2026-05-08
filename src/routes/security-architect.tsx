import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/security-architect")({
  head: () => ({ meta: [{ title: "Security Architect — SaaS Vala" }, { name: "description", content: "Security architecture workspace" }] }),
  component: Page,
});

function Page() {
  const { data: secArchData, isLoading, error } = useQuery({
    queryKey: ["security-architect-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Security Architect data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Security Architect" subtitle="Security architecture workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Security Architect data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Security Domains", value: "8", delta: "+1", up: true },
    { label: "Threat Models", value: "12", delta: "+2", up: true },
    { label: "Security Score", value: "95%", delta: "+2%", up: true },
    { label: "Vulnerabilities", value: "3", delta: "-2", up: true },
  ];

  const columns = [
    { key: "control", label: "Security Control" },
    { key: "category", label: "Category" },
    { key: "status", label: "Status" },
    { key: "coverage", label: "Coverage" },
  ];

  const rows = [
    { control: "Zero Trust", category: "Access", status: "Implemented", coverage: "95%" },
    { control: "Encryption", category: "Data", status: "Implemented", coverage: "100%" },
    { control: "SIEM", category: "Monitoring", status: "Implemented", coverage: "90%" },
    { control: "IAM", category: "Identity", status: "Implemented", coverage: "98%" },
    { control: "DLP", category: "Data", status: "In Progress", coverage: "75%" },
  ];

  return (
    <AppShell>
      <ModulePage title="Security Architect" subtitle="Security architecture workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
