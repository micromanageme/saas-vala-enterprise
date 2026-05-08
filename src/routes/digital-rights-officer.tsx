import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/digital-rights-officer")({
  head: () => ({ meta: [{ title: "Digital Rights Officer — SaaS Vala" }, { name: "description", content: "Digital rights management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: rightsData, isLoading, error } = useQuery({
    queryKey: ["digital-rights-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Digital Rights Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Digital Rights Officer" subtitle="Digital rights management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Digital Rights Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Rights Managed", value: "50K", delta: "+5K", up: true },
    { label: "Licenses Issued", value: "25K", delta: "+2K", up: true },
    { label: "Compliance", value: "96%", delta: "+1%", up: true },
    { label: "Infringements", value: "5", delta: "-1", up: true },
  ];

  const columns = [
    { key: "right", label: "Digital Right" },
    { key: "type", label: "Type" },
    { key: "holders", label: "Rights Holders" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { right: "DRT-001", type: "Copyright", holders: "10K", status: "Active" },
    { right: "DRT-002", type: "Trademark", holders: "5K", status: "Active" },
    { right: "DRT-003", type: "Patent", holders: "2K", status: "Active" },
    { right: "DRT-004", type: "Copyright", holders: "8K", status: "In Review" },
    { right: "DRT-005", type: "Trademark", holders: "3K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Digital Rights Officer" subtitle="Digital rights management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
