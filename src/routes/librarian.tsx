import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/librarian")({
  head: () => ({ meta: [{ title: "Librarian — SaaS Vala" }, { name: "description", content: "Library management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: librarianData, isLoading, error } = useQuery({
    queryKey: ["librarian-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Librarian data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Librarian" subtitle="Library management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Librarian data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Books Cataloged", value: "125K", delta: "+5K", up: true },
    { label: "Active Members", value: "8.5K", delta: "+300", up: true },
    { label: "Books Borrowed", value: "2.5K", delta: "+200", up: true },
    { label: "Digital Resources", value: "45K", delta: "+3K", up: true },
  ];

  const columns = [
    { key: "resource", label: "Library Resource" },
    { key: "category", label: "Category" },
    { key: "available", label: "Available" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { resource: "Digital Books", category: "E-Books", available: "25K", status: "Active" },
    { resource: "Physical Books", category: "Print", available: "85K", status: "Available" },
    { resource: "Journals", category: "Academic", available: "15K", status: "Active" },
    { resource: "Audio Books", category: "Audio", available: "5K", status: "Active" },
    { resource: "Research Papers", category: "Academic", available: "8K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Librarian" subtitle="Library management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
