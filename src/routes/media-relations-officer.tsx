import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/media-relations-officer")({
  head: () => ({ meta: [{ title: "Media Relations Officer — SaaS Vala" }, { name: "description", content: "Media relations workspace" }] }),
  component: Page,
});

function Page() {
  const { data: mediaData, isLoading, error } = useQuery({
    queryKey: ["media-relations-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Media Relations Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Media Relations Officer" subtitle="Media relations workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Media Relations Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Media Contacts", value: "250", delta: "+25", up: true },
    { label: "Coverage Secured", value: "85", delta: "+10", up: true },
    { label: "Interviews Arranged", value: "30", delta: "+5", up: true },
    { label: "Relationship Score", value: "4.6/5", delta: "+0.1", up: true },
  ];

  const columns = [
    { key: "outlet", label: "Media Outlet" },
    { key: "type", label: "Type" },
    { key: "engagement", label: "Engagement" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { outlet: "OUT-001", type: "TV", engagement: "High", status: "Active" },
    { outlet: "OUT-002", type: "Print", engagement: "Medium", status: "Active" },
    { outlet: "OUT-003", type: "Digital", engagement: "High", status: "Active" },
    { outlet: "OUT-004", type: "Radio", engagement: "Low", status: "Inactive" },
    { outlet: "OUT-005", type: "Digital", engagement: "High", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Media Relations Officer" subtitle="Media relations workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
