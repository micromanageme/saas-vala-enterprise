import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/digital-archive-admin")({
  head: () => ({ meta: [{ title: "Digital Archive Admin — SaaS Vala" }, { name: "description", content: "Digital archive administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: archiveData, isLoading, error } = useQuery({
    queryKey: ["digital-archive-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Digital Archive Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Digital Archive Admin" subtitle="Digital archive administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Digital Archive Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Archives Stored", value: "100TB", delta: "+10TB", up: true },
    { label: "Files Archived", value: "2.5M", delta: "+250K", up: true },
    { label: "Retention Compliance", value: "98%", delta: "+1%", up: true },
    { label: "Access Requests", value: "150", delta: "+15", up: true },
  ];

  const columns = [
    { key: "archive", label: "Digital Archive" },
    { key: "category", label: "Category" },
    { key: "size", label: "Size" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { archive: "ARC-001", category: "Legal", size: "20TB", status: "Active" },
    { archive: "ARC-002", category: "Financial", size: "30TB", status: "Active" },
    { archive: "ARC-003", category: "Historical", size: "15TB", status: "Active" },
    { archive: "ARC-004", category: "Medical", size: "25TB", status: "Restricted" },
    { archive: "ARC-005", category: "Project", size: "10TB", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Digital Archive Admin" subtitle="Digital archive administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
