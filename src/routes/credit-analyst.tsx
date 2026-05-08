import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/credit-analyst")({
  head: () => ({ meta: [{ title: "Credit Analyst — SaaS Vala" }, { name: "description", content: "Credit analysis workspace" }] }),
  component: Page,
});

function Page() {
  const { data: creditData, isLoading, error } = useQuery({
    queryKey: ["credit-analyst-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Credit Analyst data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Credit Analyst" subtitle="Credit analysis workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Credit Analyst data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Credit Reviews", value: "125", delta: "+15", up: true },
    { label: "Approvals", value: "85", delta: "+10", up: true },
    { label: "Rejections", value: "40", delta: "+5", up: false },
    { label: "Average Score", value: "720", delta: "+10", up: true },
  ];

  const columns = [
    { key: "application", label: "Credit Application" },
    { key: "applicant", label: "Applicant" },
    { key: "score", label: "Credit Score" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { application: "CR-001", applicant: "John Smith", score: "750", status: "Approved" },
    { application: "CR-002", applicant: "Sarah Johnson", score: "680", status: "In Review" },
    { application: "CR-003", applicant: "Mike Brown", score: "820", status: "Approved" },
    { application: "CR-004", applicant: "Emily Davis", score: "620", status: "Rejected" },
    { application: "CR-005", applicant: "Alex Wilson", score: "780", status: "Approved" },
  ];

  return (
    <AppShell>
      <ModulePage title="Credit Analyst" subtitle="Credit analysis workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
