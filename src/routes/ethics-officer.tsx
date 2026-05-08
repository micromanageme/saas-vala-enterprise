import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/ethics-officer")({
  head: () => ({ meta: [{ title: "Ethics Officer — SaaS Vala" }, { name: "description", content: "Ethics oversight" }] }),
  component: Page,
});

function Page() {
  const { data: ethicsData, isLoading, error } = useQuery({
    queryKey: ["ethics-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Ethics Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Ethics Officer" subtitle="Ethics oversight" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Ethics Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Ethics Score", value: "96%", delta: "+2%", up: true },
    { label: "Training Completion", value: "98%", delta: "+2%", up: true },
    { label: "Violations", value: "1", delta: "-1", up: true },
    { label: "Reporting Rate", value: "85%", delta: "+5%", up: true },
  ];

  const columns = [
    { key: "program", label: "Ethics Program" },
    { key: "compliance", label: "Compliance" },
    { key: "participants", label: "Participants" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { program: "Code of Conduct", compliance: "100%", participants: "450", status: "Active" },
    { program: "Anti-Corruption", compliance: "98%", participants: "350", status: "Active" },
    { program: "Conflict of Interest", compliance: "100%", participants: "120", status: "Active" },
    { program: "Data Ethics", compliance: "95%", participants: "200", status: "Active" },
    { program: "Supplier Ethics", compliance: "92%", participants: "80", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Ethics Officer" subtitle="Ethics oversight" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
