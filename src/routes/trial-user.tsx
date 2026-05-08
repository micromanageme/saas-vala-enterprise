import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/trial-user")({
  head: () => ({ meta: [{ title: "Trial User — SaaS Vala" }, { name: "description", content: "Trial user portal" }] }),
  component: Page,
});

function Page() {
  const { data: trialData, isLoading, error } = useQuery({
    queryKey: ["trial-user-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/user/dashboard");
      if (!response.ok) throw new Error("Failed to fetch Trial User data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Trial User" subtitle="Trial user portal" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Trial User data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Trial Days Remaining", value: "14", delta: "-1", up: false },
    { label: "Features Used", value: "8/12", delta: "+2", up: true },
    { label: "Data Created", value: "125 items", delta: "+25", up: true },
    { label: "Conversion Probability", value: "75%", delta: "+5%", up: true },
  ];

  const columns = [
    { key: "feature", label: "Feature" },
    { key: "usage", label: "Usage" },
    { key: "limit", label: "Trial Limit" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { feature: "Dashboard", usage: "Daily", limit: "Unlimited", status: "Active" },
    { feature: "Reports", usage: "15", limit: "50", status: "Active" },
    { feature: "API Calls", usage: "450", limit: "1000", status: "Active" },
    { feature: "Storage", usage: "250MB", limit: "1GB", status: "Active" },
    { feature: "Team Members", usage: "3", limit: "5", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Trial User" subtitle="Trial user portal" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
