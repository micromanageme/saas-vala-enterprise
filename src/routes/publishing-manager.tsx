import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/publishing-manager")({
  head: () => ({ meta: [{ title: "Publishing Manager — SaaS Vala" }, { name: "description", content: "Publishing management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: publishingData, isLoading, error } = useQuery({
    queryKey: ["publishing-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Publishing Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Publishing Manager" subtitle="Publishing management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Publishing Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Publications", value: "125", delta: "+15", up: true },
    { label: "Authors", value: "85", delta: "+8", up: true },
    { label: "Copies Sold", value: "45K", delta: "+5K", up: true },
    { label: "Revenue", value: "$250K", delta: "+$30K", up: true },
  ];

  const columns = [
    { key: "publication", label: "Publication" },
    { key: "format", label: "Format" },
    { key: "sales", label: "Monthly Sales" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { publication: "PUB-001", format: "Print", sales: "5,200", status: "In Print" },
    { publication: "PUB-002", format: "E-Book", sales: "8,500", status: "Digital" },
    { publication: "PUB-003", format: "Audio", sales: "2,300", status: "Audio" },
    { publication: "PUB-004", format: "Print", sales: "3,800", status: "Pre-order" },
    { publication: "PUB-005", format: "E-Book", sales: "1,500", status: "Digital" },
  ];

  return (
    <AppShell>
      <ModulePage title="Publishing Manager" subtitle="Publishing management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
