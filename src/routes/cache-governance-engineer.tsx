import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/cache-governance-engineer")({
  head: () => ({ meta: [{ title: "Cache Governance Engineer — SaaS Vala" }, { name: "description", content: "Cache governance engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: cacheData, isLoading, error } = useQuery({
    queryKey: ["cache-governance-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Cache Governance Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Cache Governance Engineer" subtitle="Cache governance engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Cache Governance Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Cache Hit Rate", value: "95%", delta: "+2%", up: true },
    { label: "Memory Used", value: "75%", delta: "+5%", up: false },
    { label: "Evictions", value: "125", delta: "-25", up: true },
    { label: "Latency", value: "1ms", delta: "-0.5ms", up: true },
  ];

  const columns = [
    { key: "cache", label: "Cache Instance" },
    { key: "size", label: "Size (GB)" },
    { key: "hits", label: "Hit Rate" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { cache: "CACHE-001", size: "10", hits: "96%", status: "Active" },
    { cache: "CACHE-002", size: "20", hits: "94%", status: "Active" },
    { cache: "CACHE-003", size: "15", hits: "97%", status: "Active" },
    { cache: "CACHE-004", size: "5", hits: "92%", status: "Standby" },
    { cache: "CACHE-005", size: "25", hits: "95%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Cache Governance Engineer" subtitle="Cache governance engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
