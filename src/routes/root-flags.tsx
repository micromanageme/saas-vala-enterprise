import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-flags")({
  head: () => ({ meta: [{ title: "Root Feature Flag Engine — Universal Access Admin" }, { name: "description", content: "Staged rollout, tenant feature controls, emergency disable" }] }),
  component: Page,
});

function Page() {
  const { data: flagsData, isLoading, error } = useQuery({
    queryKey: ["root-flags"],
    queryFn: async () => {
      const response = await fetch("/api/root/feature-flags?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch feature flag data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Feature Flag Engine" subtitle="Staged rollout, tenant feature controls, emergency disable" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Feature Flag Engine data</div>
      </AppShell>
    );
  }

  const data = flagsData?.data;
  const flags = data?.featureFlags || [];
  const emergency = data?.emergencyDisable;

  const kpis = [
    { label: "Total Flags", value: flags.length.toString(), delta: "—", up: true },
    { label: "Enabled", value: flags.filter((f: any) => f.enabled).length.toString(), delta: "—", up: true },
    { label: "Staged", value: flags.filter((f: any) => f.staged).length.toString(), delta: "—", up: true },
    { label: "Emergency Ready", value: emergency?.ready ? "Yes" : "No", delta: "—", up: emergency?.ready },
  ] : [];

  const columns = [
    { key: "name", label: "Flag" },
    { key: "enabled", label: "Enabled" },
    { key: "rollout", label: "Rollout" },
    { key: "staged", label: "Staged" },
    { key: "rolloutProgress", label: "Progress" },
  ];

  const rows = flags.map((f: any) => ({
    name: f.name,
    enabled: f.enabled ? "Yes" : "No",
    rollout: `${f.rollout}%`,
    staged: f.staged ? "Yes" : "No",
    rolloutProgress: `${f.rolloutProgress}%`,
  }));

  return (
    <AppShell>
      <ModulePage title="Root Feature Flag Engine" subtitle="Staged rollout, tenant feature controls, emergency disable" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
