import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/hr-manager")({
  head: () => ({ meta: [{ title: "HR Manager — SaaS Vala" }, { name: "description", content: "HR team management" }] }),
  component: Page,
});

function Page() {
  const { data: hrData, isLoading, error } = useQuery({
    queryKey: ["hr-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch HR Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="HR Manager" subtitle="HR team management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load HR Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Team Size", value: "12", delta: "+1", up: true },
    { label: "Open Positions", value: "8", delta: "-2", up: true },
    { label: "Time to Hire", value: "18 days", delta: "-3 days", up: true },
    { label: "Retention Rate", value: "94%", delta: "+2%", up: true },
  ] : [];

  const columns = [
    { key: "candidate", label: "Candidate" },
    { key: "position", label: "Position" },
    { key: "stage", label: "Stage" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { candidate: "Alice Chen", position: "Senior Engineer", stage: "Final Interview", status: "Active" },
    { candidate: "Bob Martin", position: "Product Manager", stage: "Technical", status: "Active" },
    { candidate: "Carol White", position: "UX Designer", stage: "Screening", status: "Active" },
    { candidate: "David Lee", position: "DevOps Engineer", stage: "Offer", status: "Pending" },
    { candidate: "Eva Green", position: "Data Analyst", stage: "Final Interview", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="HR Manager" subtitle="HR team management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
