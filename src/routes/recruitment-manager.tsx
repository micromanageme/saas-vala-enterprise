import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/recruitment-manager")({
  head: () => ({ meta: [{ title: "Recruitment Manager — SaaS Vala" }, { name: "description", content: "Recruitment management" }] }),
  component: Page,
});

function Page() {
  const { data: recruitData, isLoading, error } = useQuery({
    queryKey: ["recruitment-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Recruitment Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Recruitment Manager" subtitle="Recruitment management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Recruitment Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Open Positions", value: "12", delta: "-2", up: true },
    { label: "Applications", value: "234", delta: "+45", up: true },
    { label: "Interviews Scheduled", value: "18", delta: "+5", up: true },
    { label: "Time to Hire", value: "18 days", delta: "-3 days", up: true },
  ];

  const columns = [
    { key: "position", label: "Position" },
    { key: "department", label: "Department" },
    { key: "applicants", label: "Applicants" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { position: "Senior Engineer", department: "Engineering", applicants: "45", status: "Interviewing" },
    { position: "Product Manager", department: "Product", applicants: "32", status: "Screening" },
    { position: "UX Designer", department: "Design", applicants: "28", status: "Interviewing" },
    { position: "Data Analyst", department: "Analytics", applicants: "18", status: "Offer" },
    { position: "Support Agent", department: "Support", applicants: "12", status: "Open" },
  ];

  return (
    <AppShell>
      <ModulePage title="Recruitment Manager" subtitle="Recruitment management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
