import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/underwriter")({
  head: () => ({ meta: [{ title: "Underwriter — SaaS Vala" }, { name: "description", content: "Underwriting workspace" }] }),
  component: Page,
});

function Page() {
  const { data: underwriterData, isLoading, error } = useQuery({
    queryKey: ["underwriter-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Underwriter data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Underwriter" subtitle="Underwriting workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Underwriter data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Policies Underwritten", value: "450", delta: "+50", up: true },
    { label: "Premium Written", value: "$2.5M", delta: "+$300K", up: true },
    { label: "Loss Ratio", value: "65%", delta: "-3%", up: true },
    { label: "Approval Rate", value: "88%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "policy", label: "Insurance Policy" },
    { key: "type", label: "Type" },
    { key: "premium", label: "Premium" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { policy: "POL-001", type: "Life Insurance", premium: "$5,000", status: "Issued" },
    { policy: "POL-002", type: "Health Insurance", premium: "$3,500", status: "Issued" },
    { policy: "POL-003", type: "Auto Insurance", premium: "$1,200", status: "Under Review" },
    { policy: "POL-004", type: "Home Insurance", premium: "$2,000", status: "Issued" },
    { policy: "POL-005", type: "Business Insurance", premium: "$8,000", status: "Issued" },
  ];

  return (
    <AppShell>
      <ModulePage title="Underwriter" subtitle="Underwriting workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
