import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/press-secretary")({
  head: () => ({ meta: [{ title: "Press Secretary — SaaS Vala" }, { name: "description", content: "Press secretary workspace" }] }),
  component: Page,
});

function Page() {
  const { data: pressData, isLoading, error } = useQuery({
    queryKey: ["press-secretary-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Press Secretary data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Press Secretary" subtitle="Press secretary workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Press Secretary data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Press Releases", value: "25", delta: "+3", up: true },
    { label: "Media Inquiries", value: "150", delta: "+20", up: true },
    { label: "Coverage Generated", value: "200", delta: "+30", up: true },
    { label: "Message Alignment", value: "92%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "release", label: "Press Release" },
    { key: "type", label: "Type" },
    { key: "reach", label: "Reach" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { release: "PR-001", type: "Product", reach: "5M", status: "Distributed" },
    { release: "PR-002", type: "Corporate", reach: "3M", status: "Distributed" },
    { release: "PR-003", type: "Crisis", reach: "2M", status: "Draft" },
    { release: "PR-004", type: "Event", reach: "4M", status: "Scheduled" },
    { release: "PR-005", type: "Partnership", reach: "6M", status: "Distributed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Press Secretary" subtitle="Press secretary workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
