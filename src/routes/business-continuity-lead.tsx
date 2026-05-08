import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/business-continuity-lead")({
  head: () => ({ meta: [{ title: "Business Continuity Lead — SaaS Vala" }, { name: "description", content: "Business continuity management" }] }),
  component: Page,
});

function Page() {
  const { data: bcData, isLoading, error } = useQuery({
    queryKey: ["business-continuity-lead-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Business Continuity Lead data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Business Continuity Lead" subtitle="Business continuity management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Business Continuity Lead data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "BCP Coverage", value: "95%", delta: "+3%", up: true },
    { label: "Drills Completed", value: "8", delta: "+2", up: true },
    { label: "RTO Compliance", value: "98%", delta: "+2%", up: true },
    { label: "RPO Compliance", value: "96%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "plan", label: "BCP Plan" },
    { key: "criticality", label: "Criticality" },
    { key: "lastTest", label: "Last Test" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { plan: "IT Disaster Recovery", criticality: "Critical", lastTest: "2024-06-01", status: "Active" },
    { plan: "Business Operations", criticality: "Critical", lastTest: "2024-05-15", status: "Active" },
    { plan: "Communication Protocol", criticality: "High", lastTest: "2024-06-10", status: "Active" },
    { plan: "Supply Chain Recovery", criticality: "Medium", lastTest: "2024-04-01", status: "Review" },
    { plan: "Crisis Management", criticality: "Critical", lastTest: "2024-05-01", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Business Continuity Lead" subtitle="Business continuity management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
