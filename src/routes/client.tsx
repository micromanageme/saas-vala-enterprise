import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/client")({
  head: () => ({ meta: [{ title: "Client — SaaS Vala" }, { name: "description", content: "Client portal" }] }),
  component: Page,
});

function Page() {
  const { data: clientData, isLoading, error } = useQuery({
    queryKey: ["client-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Client data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Client" subtitle="Client portal" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Client data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Projects", value: "3", delta: "+1", up: true },
    { label: "Total Spend", value: "$45K", delta: "+8%", up: false },
    { label: "Support Tickets", value: "2", delta: "-1", up: true },
    { label: "Satisfaction", value: "4.5/5", delta: "+0.2", up: true },
  ];

  const columns = [
    { key: "project", label: "Project" },
    { key: "status", label: "Status" },
    { key: "progress", label: "Progress" },
    { key: "deadline", label: "Deadline" },
  ];

  const rows = [
    { project: "Website Redesign", status: "In Progress", progress: "75%", deadline: "2024-08-15" },
    { project: "Mobile App", status: "In Progress", progress: "45%", deadline: "2024-09-30" },
    { project: "API Integration", status: "Complete", progress: "100%", deadline: "2024-06-30" },
    { project: "Maintenance", status: "Active", progress: "—", deadline: "Ongoing" },
    { project: "Consulting", status: "Scheduled", progress: "0%", deadline: "2024-10-01" },
  ];

  return (
    <AppShell>
      <ModulePage title="Client" subtitle="Client portal" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
