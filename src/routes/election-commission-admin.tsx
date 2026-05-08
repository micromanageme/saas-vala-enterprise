import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/election-commission-admin")({
  head: () => ({ meta: [{ title: "Election Commission Admin — SaaS Vala" }, { name: "description", content: "Election commission administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: electionData, isLoading, error } = useQuery({
    queryKey: ["election-commission-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Election Commission Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Election Commission Admin" subtitle="Election commission administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Election Commission Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Registered Voters", value: "125K", delta: "+5K", up: true },
    { label: "Upcoming Elections", value: "3", delta: "+1", up: true },
    { label: "Voter Turnout", value: "72%", delta: "+3%", up: true },
    { label: "Polling Stations", value: "45", delta: "+5", up: true },
  ];

  const columns = [
    { key: "election", label: "Election" },
    { key: "date", label: "Date" },
    { key: "constituency", label: "Constituency" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { election: "Municipal Election 2024", date: "2024-11-05", constituency: "City Wide", status: "Scheduled" },
    { election: "State Assembly By-Election", date: "2024-08-15", constituency: "District 5", status: "Preparation" },
    { election: "Local Council Election", date: "2024-12-10", constituency: "Ward 12", status: "Planning" },
    { election: "School Board Election", date: "2024-09-20", constituency: "School District", status: "Scheduled" },
    { election: "Special Referendum", date: "2024-07-30", constituency: "County Wide", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Election Commission Admin" subtitle="Election commission administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
