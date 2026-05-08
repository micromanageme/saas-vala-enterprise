import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/brand-protection-officer")({
  head: () => ({ meta: [{ title: "Brand Protection Officer — SaaS Vala" }, { name: "description", content: "Brand protection workspace" }] }),
  component: Page,
});

function Page() {
  const { data: brandData, isLoading, error } = useQuery({
    queryKey: ["brand-protection-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Brand Protection Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Brand Protection Officer" subtitle="Brand protection workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Brand Protection Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Violations Detected", value: "125", delta: "+15", up: true },
    { label: "Takedowns", value: "95", delta: "+10", up: true },
    { label: "Revenue Protected", value: "$2.5M", delta: "+$300K", up: true },
    { label: "Detection Rate", value: "88%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "case", label: "Brand Case" },
    { key: "type", label: "Type" },
    { key: "platform", label: "Platform" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { case: "BRD-001", type: "Counterfeit", platform: "E-commerce", status: "Resolved" },
    { case: "BRD-002", type: "Trademark", platform: "Social Media", status: "In Progress" },
    { case: "BRD-003", type: "Copyright", platform: "Marketplace", status: "Resolved" },
    { case: "BRD-004", type: "Counterfeit", platform: "Website", status: "In Progress" },
    { case: "BRD-005", type: "Trademark", platform: "Social Media", status: "Resolved" },
  ];

  return (
    <AppShell>
      <ModulePage title="Brand Protection Officer" subtitle="Brand protection workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
