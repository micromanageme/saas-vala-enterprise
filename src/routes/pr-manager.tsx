import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/pr-manager")({
  head: () => ({ meta: [{ title: "PR Manager — SaaS Vala" }, { name: "description", content: "Public relations management" }] }),
  component: Page,
});

function Page() {
  const { data: prData, isLoading, error } = useQuery({
    queryKey: ["pr-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch PR Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="PR Manager" subtitle="Public relations management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load PR Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Media Mentions", value: "45", delta: "+12", up: true },
    { label: "Press Releases", value: "8", delta: "+2", up: true },
    { label: "Media Relationships", value: "23", delta: "+3", up: true },
    { label: "Crisis Score", value: "Low", delta: "—", up: true },
  ];

  const columns = [
    { key: "outlet", label: "Outlet" },
    { key: "type", label: "Type" },
    { key: "reach", label: "Reach" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { outlet: "TechCrunch", type: "Tech", reach: "2.5M", status: "Active" },
    { outlet: "Forbes", type: "Business", reach: "5.2M", status: "Active" },
    { outlet: "Wired", type: "Tech", reach: "3.8M", status: "Active" },
    { outlet: "Business Insider", type: "Business", reach: "4.1M", status: "Active" },
    { outlet: "VentureBeat", type: "Tech", reach: "1.8M", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="PR Manager" subtitle="Public relations management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
