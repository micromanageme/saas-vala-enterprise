import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/wealth-manager")({
  head: () => ({ meta: [{ title: "Wealth Manager — SaaS Vala" }, { name: "description", content: "Wealth management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: wealthData, isLoading, error } = useQuery({
    queryKey: ["wealth-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Wealth Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Wealth Manager" subtitle="Wealth management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Wealth Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Clients Managed", value: "85", delta: "+8", up: true },
    { label: "Assets Under Management", value: "$250M", delta: "+$30M", up: true },
    { label: "Portfolio Return", value: "15%", delta: "+2%", up: true },
    { label: "Client Retention", value: "95%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "client", label: "Client" },
    { key: "portfolio", label: "Portfolio Value" },
    { key: "return", label: "YTD Return" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { client: "John Smith", portfolio: "$5M", return: "12%", status: "Active" },
    { client: "Sarah Johnson", portfolio: "$8M", return: "18%", status: "Active" },
    { client: "Mike Brown", portfolio: "$3M", return: "10%", status: "Active" },
    { client: "Emily Davis", portfolio: "$12M", return: "20%", status: "Active" },
    { client: "Alex Wilson", portfolio: "$6M", return: "15%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Wealth Manager" subtitle="Wealth management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
