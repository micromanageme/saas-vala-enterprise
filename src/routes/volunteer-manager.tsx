import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/volunteer-manager")({
  head: () => ({ meta: [{ title: "Volunteer Manager — SaaS Vala" }, { name: "description", content: "Volunteer management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: volunteerData, isLoading, error } = useQuery({
    queryKey: ["volunteer-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Volunteer Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Volunteer Manager" subtitle="Volunteer management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Volunteer Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Volunteers Active", value: "350", delta: "+30", up: true },
    { label: "Hours Contributed", value: "5.2K", delta: "+500", up: true },
    { label: "Retention Rate", value: "75%", delta: "+5%", up: true },
    { label: "Satisfaction Score", value: "4.6/5", delta: "+0.2", up: true },
  ];

  const columns = [
    { key: "volunteer", label: "Volunteer" },
    { key: "hours", label: "Hours/Week" },
    { key: "program", label: "Program" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { volunteer: "John Smith", hours: "10", program: "Education", status: "Active" },
    { volunteer: "Sarah Johnson", hours: "8", program: "Healthcare", status: "Active" },
    { volunteer: "Mike Brown", hours: "5", program: "Environment", status: "Active" },
    { volunteer: "Emily Davis", hours: "12", program: "Food Security", status: "Active" },
    { volunteer: "Alex Wilson", hours: "0", program: "Education", status: "Inactive" },
  ];

  return (
    <AppShell>
      <ModulePage title="Volunteer Manager" subtitle="Volunteer management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
