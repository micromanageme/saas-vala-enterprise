import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/forensic-reconstruction-analyst")({
  head: () => ({ meta: [{ title: "Forensic Reconstruction Analyst — SaaS Vala" }, { name: "description", content: "Forensic reconstruction analysis workspace" }] }),
  component: Page,
});

function Page() {
  const { data: reconstructionData, isLoading, error } = useQuery({
    queryKey: ["forensic-reconstruction-analyst-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Forensic Reconstruction Analyst data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Forensic Reconstruction Analyst" subtitle="Forensic reconstruction analysis workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Forensic Reconstruction Analyst data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Reconstructions", value: "35", delta: "+5", up: true },
    { label: "Accuracy", value: "92%", delta: "+2%", up: true },
    { label: "Timeline Accuracy", value: "95%", delta: "+1%", up: true },
    { label: "Events Reconstructed", value: "5K", delta: "+500", up: true },
  ];

  const columns = [
    { key: "reconstruction", label: "Reconstruction" },
    { key: "source", label: "Data Source" },
    { key: "events", label: "Events" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { reconstruction: "REC-001", source: "Logs", events: "500", status: "Completed" },
    { reconstruction: "REC-002", source: "Network", events: "300", status: "In Progress" },
    { reconstruction: "REC-003", source: "System", events: "400", status: "Completed" },
    { reconstruction: "REC-004", source: "Logs", events: "600", status: "In Progress" },
    { reconstruction: "REC-005", source: "Network", events: "350", status: "Completed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Forensic Reconstruction Analyst" subtitle="Forensic reconstruction analysis workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
