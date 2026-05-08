import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/ombudsman")({
  head: () => ({ meta: [{ title: "Ombudsman — SaaS Vala" }, { name: "description", content: "Ombudsman office" }] }),
  component: Page,
});

function Page() {
  const { data: ombudsmanData, isLoading, error } = useQuery({
    queryKey: ["ombudsman-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Ombudsman data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Ombudsman" subtitle="Ombudsman office" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Ombudsman data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Cases Open", value: "12", delta: "-3", up: true },
    { label: "Resolution Rate", value: "92%", delta: "+3%", up: true },
    { label: "Avg Resolution Time", value: "5 days", delta: "-1 day", up: true },
    { label: "Satisfaction", value: "4.6/5", delta: "+0.2", up: true },
  ];

  const columns = [
    { key: "case", label: "Case" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "filed", label: "Filed" },
  ];

  const rows = [
    { case: "OMB-001234", type: "Workplace Dispute", status: "In Progress", filed: "2024-06-01" },
    { case: "OMB-001235", type: "Policy Concern", status: "Review", filed: "2024-05-28" },
    { case: "OMB-001236", type: "Harassment", status: "Investigating", filed: "2024-06-05" },
    { case: "OMB-001237", type: "Fair Treatment", status: "Resolved", filed: "2024-05-15" },
    { case: "OMB-001238", type: "Whistleblower", status: "Closed", filed: "2024-04-20" },
  ];

  return (
    <AppShell>
      <ModulePage title="Ombudsman" subtitle="Ombudsman office" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
