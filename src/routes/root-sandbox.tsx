import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-sandbox")({
  head: () => ({ meta: [{ title: "Root Sandbox Environment — Universal Access Admin" }, { name: "description", content: "Isolated testing, deployment simulation, compatibility validation" }] }),
  component: Page,
});

function Page() {
  const { data: sandboxData, isLoading, error } = useQuery({
    queryKey: ["root-sandbox"],
    queryFn: async () => {
      const response = await fetch("/api/root/sandbox?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch sandbox data");
      return response.json();
    },
    refetchInterval: 20000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Sandbox Environment" subtitle="Isolated testing, deployment simulation, compatibility validation" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Sandbox Environment data</div>
      </AppShell>
    );
  }

  const data = sandboxData?.data;
  const sandboxes = data?.sandboxes || [];
  const compatibility = data?.compatibilityValidation;

  const kpis = compatibility ? [
    { label: "Total Modules", value: compatibility.totalModules.toString(), delta: "—", up: true },
    { label: "Compatible", value: compatibility.compatible.toString(), delta: "—", up: true },
    { label: "Incompatible", value: compatibility.incompatible.toString(), delta: "—", up: compatibility.incompatible === 0 },
    { label: "Active Sandboxes", value: sandboxes.filter((s: any) => s.status === 'ACTIVE').length.toString(), delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "name", label: "Sandbox" },
    { key: "status", label: "Status" },
    { key: "resources", label: "Resources" },
    { key: "deployedAt", label: "Deployed" },
  ];

  const rows = sandboxes.map((s: any) => ({
    name: s.name,
    status: s.status,
    resources: s.resources,
    deployedAt: new Date(s.deployedAt).toLocaleString(),
  }));

  return (
    <AppShell>
      <ModulePage title="Root Sandbox Environment" subtitle="Isolated testing, deployment simulation, compatibility validation" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
