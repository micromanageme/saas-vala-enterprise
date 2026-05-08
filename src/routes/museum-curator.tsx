import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/museum-curator")({
  head: () => ({ meta: [{ title: "Museum Curator — SaaS Vala" }, { name: "description", content: "Museum curation workspace" }] }),
  component: Page,
});

function Page() {
  const { data: museumData, isLoading, error } = useQuery({
    queryKey: ["museum-curator-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Museum Curator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Museum Curator" subtitle="Museum curation workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Museum Curator data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Artifacts Managed", value: "5.2K", delta: "+250", up: true },
    { label: "Exhibitions", value: "12", delta: "+2", up: true },
    { label: "Daily Visitors", value: "800", delta: "+100", up: true },
    { label: "Acquisitions", value: "25", delta: "+5", up: true },
  ];

  const columns = [
    { key: "artifact", label: "Artifact" },
    { key: "category", label: "Category" },
    { key: "date", label: "Acquisition Date" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { artifact: "ART-001", category: "Ancient", date: "2020-05-15", status: "On Display" },
    { artifact: "ART-002", category: "Modern", date: "2023-08-20", status: "In Storage" },
    { artifact: "ART-003", category: "Historical", date: "2021-03-10", status: "On Display" },
    { artifact: "ART-004", category: "Cultural", date: "2022-11-25", status: "On Loan" },
    { artifact: "ART-005", category: "Scientific", date: "2024-01-30", status: "In Restoration" },
  ];

  return (
    <AppShell>
      <ModulePage title="Museum Curator" subtitle="Museum curation workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
