import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/forensic-lead")({
  head: () => ({ meta: [{ title: "Forensic Lead — SaaS Vala" }, { name: "description", content: "Forensic investigation workspace" }] }),
  component: Page,
});

function Page() {
  const { data: forensicData, isLoading, error, refetch } = useQuery({
    queryKey: ["forensic-lead-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Forensic Lead data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Forensic Lead" subtitle="Forensic investigation workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Forensic Lead"
          subtitle="Forensic investigation workspace"
          message="We couldn't load Forensic Lead data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Investigations", value: "3", delta: "-1", up: true },
    { label: "Evidence Collected", value: "234", delta: "+45", up: true },
    { label: "Cases Solved", value: "12", delta: "+2", up: true },
    { label: "Chain of Custody", value: "100%", delta: "—", up: true },
  ];

  const columns = [
    { key: "case", label: "Case" },
    { key: "type", label: "Type" },
    { key: "evidence", label: "Evidence Items" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { case: "FOR-001234", type: "Data Breach", evidence: "45", status: "Investigating" },
    { case: "FOR-001235", type: "Unauthorized Access", evidence: "23", status: "Review" },
    { case: "FOR-001236", type: "Insider Threat", evidence: "67", status: "Investigating" },
    { case: "FOR-001237", type: "Malware Analysis", evidence: "34", status: "Complete" },
    { case: "FOR-001238", type: "Fraud", evidence: "65", status: "Investigating" },
  ];

  return (
    <AppShell>
      <ModulePage title="Forensic Lead" subtitle="Forensic investigation workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
