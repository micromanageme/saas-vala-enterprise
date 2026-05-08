import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/privacy-manager")({
  head: () => ({ meta: [{ title: "Privacy Manager — SaaS Vala" }, { name: "description", content: "Privacy management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: privacyData, isLoading, error } = useQuery({
    queryKey: ["privacy-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Privacy Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Privacy Manager" subtitle="Privacy management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Privacy Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Data Subjects", value: "100K", delta: "+10K", up: true },
    { label: "Consent Rate", value: "85%", delta: "+3%", up: true },
    { label: "DSARs Processed", value: "250", delta: "+25", up: true },
    { label: "Compliance", value: "97%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "request", label: "Privacy Request" },
    { key: "type", label: "Type" },
    { key: "processing", label: "Processing Time" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { request: "DSR-001", type: "Access", processing: "3 days", status: "Completed" },
    { request: "DSR-002", type: "Deletion", processing: "5 days", status: "In Progress" },
    { request: "DSR-003", type: "Correction", processing: "2 days", status: "Completed" },
    { request: "DSR-004", type: "Portability", processing: "7 days", status: "In Progress" },
    { request: "DSR-005", type: "Access", processing: "2 days", status: "Completed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Privacy Manager" subtitle="Privacy management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
