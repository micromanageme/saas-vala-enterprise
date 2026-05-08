import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/gdpr-officer")({
  head: () => ({ meta: [{ title: "GDPR Officer — SaaS Vala" }, { name: "description", content: "GDPR compliance management" }] }),
  component: Page,
});

function Page() {
  const { data: gdprData, isLoading, error } = useQuery({
    queryKey: ["gdpr-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch GDPR Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="GDPR Officer" subtitle="GDPR compliance management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load GDPR Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Data Subjects", value: "45.2K", delta: "+1.2K", up: true },
    { label: "DSARs Pending", value: "5", delta: "-2", up: true },
    { label: "Compliance Score", value: "98%", delta: "+1%", up: true },
    { label: "Breach Incidents", value: "0", delta: "—", up: true },
  ];

  const columns = [
    { key: "request", label: "Request" },
    { key: "type", label: "Type" },
    { key: "received", label: "Received" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { request: "DSAR-001234", type: "Access", received: "2024-07-01", status: "Processing" },
    { request: "DSAR-001235", type: "Deletion", received: "2024-06-28", status: "Complete" },
    { request: "DSAR-001236", type: "Correction", received: "2024-06-25", status: "Complete" },
    { request: "DSAR-001237", type: "Portability", received: "2024-06-20", status: "Complete" },
    { request: "DSAR-001238", type: "Objection", received: "2024-06-15", status: "Review" },
  ];

  return (
    <AppShell>
      <ModulePage title="GDPR Officer" subtitle="GDPR compliance management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
