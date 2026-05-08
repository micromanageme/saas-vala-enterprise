import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/master-data-manager")({
  head: () => ({ meta: [{ title: "Master Data Manager — SaaS Vala" }, { name: "description", content: "Master data management" }] }),
  component: Page,
});

function Page() {
  const { data: mdmData, isLoading, error } = useQuery({
    queryKey: ["master-data-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Master Data Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Master Data Manager" subtitle="Master data management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Master Data Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Master Records", value: "45.2K", delta: "+2.3K", up: true },
    { label: "Data Quality", value: "96%", delta: "+2%", up: true },
    { label: "Duplicates Resolved", value: "234", delta: "+45", up: true },
    { label: "Sync Status", value: "98%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "entity", label: "Entity" },
    { key: "records", label: "Records" },
    { key: "quality", label: "Quality" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { entity: "Customer", records: "12.5K", quality: "98%", status: "Active" },
    { entity: "Product", records: "8.2K", quality: "95%", status: "Active" },
    { entity: "Supplier", records: "3.4K", quality: "94%", status: "Active" },
    { entity: "Employee", records: "1.2K", quality: "99%", status: "Active" },
    { entity: "Location", records: "5.6K", quality: "92%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Master Data Manager" subtitle="Master data management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
