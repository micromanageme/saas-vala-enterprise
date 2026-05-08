import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/field-executive")({
  head: () => ({ meta: [{ title: "Field Executive — SaaS Vala" }, { name: "description", content: "Field executive workspace" }] }),
  component: Page,
});

function Page() {
  const { data: fieldExecData, isLoading, error } = useQuery({
    queryKey: ["field-executive-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Field Executive data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Field Executive" subtitle="Field executive workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Field Executive data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Visits Today", value: "8", delta: "+2", up: true },
    { label: "Deals Closed", value: "3", delta: "+1", up: true },
    { label: "Revenue", value: "$18K", delta: "+5K", up: true },
    { label: "Travel Distance", value: "45km", delta: "+5km", up: false },
  ];

  const columns = [
    { key: "visit", label: "Visit" },
    { key: "client", label: "Client" },
    { key: "location", label: "Location" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { visit: "VIS-001234", client: "Acme Corp", location: "Downtown", status: "Complete" },
    { visit: "VIS-001235", client: "TechStart", location: "Midtown", status: "In Progress" },
    { visit: "VIS-001236", client: "Global Ltd", location: "Uptown", status: "Scheduled" },
    { visit: "VIS-001237", client: "Innovate Co", location: "Westside", status: "Complete" },
    { visit: "VIS-001238", client: "Future Systems", location: "Eastside", status: "Scheduled" },
  ];

  return (
    <AppShell>
      <ModulePage title="Field Executive" subtitle="Field executive workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
