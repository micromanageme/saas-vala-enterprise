import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/customer-hospitality-lead")({
  head: () => ({ meta: [{ title: "Customer Hospitality Lead — SaaS Vala" }, { name: "description", content: "Customer hospitality leadership workspace" }] }),
  component: Page,
});

function Page() {
  const { data: hospitalityData, isLoading, error } = useQuery({
    queryKey: ["customer-hospitality-lead-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Customer Hospitality Lead data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Customer Hospitality Lead" subtitle="Customer hospitality leadership workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Customer Hospitality Lead data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Guest Interactions", value: "350", delta: "+50", up: true },
    { label: "Service Rating", value: "4.8/5", delta: "+0.1", up: true },
    { label: "Issue Resolution", value: "95%", delta: "+2%", up: true },
    { label: "Loyalty Signups", value: "45", delta: "+8", up: true },
  ];

  const columns = [
    { key: "guest", label: "Guest" },
    { key: "type", label: "Inquiry Type" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { guest: "Guest 001", type: "Room Service", priority: "Medium", status: "Resolved" },
    { guest: "Guest 002", type: "Complaint", priority: "High", status: "In Progress" },
    { guest: "Guest 003", type: "Request", priority: "Low", status: "Resolved" },
    { guest: "Guest 004", type: "Feedback", priority: "Medium", status: "Resolved" },
    { guest: "Guest 005", type: "Complaint", priority: "High", status: "Resolved" },
  ];

  return (
    <AppShell>
      <ModulePage title="Customer Hospitality Lead" subtitle="Customer hospitality leadership workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
