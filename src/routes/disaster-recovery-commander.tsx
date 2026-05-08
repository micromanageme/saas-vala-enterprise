import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/disaster-recovery-commander")({
  head: () => ({ meta: [{ title: "Disaster Recovery Commander — SaaS Vala" }, { name: "description", content: "Disaster recovery command" }] }),
  component: Page,
});

function Page() {
  const { data: drCommanderData, isLoading, error } = useQuery({
    queryKey: ["disaster-recovery-commander-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Disaster Recovery Commander data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Disaster Recovery Commander" subtitle="Disaster recovery command" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Disaster Recovery Commander data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "DR Readiness", value: "98%", delta: "+2%", up: true },
    { label: "RTO Compliance", value: "99%", delta: "+1%", up: true },
    { label: "RPO Compliance", value: "97%", delta: "+1%", up: true },
    { label: "Drills Completed", value: "8", delta: "+2", up: true },
  ];

  const columns = [
    { key: "system", label: "System" },
    { key: "rto", label: "RTO" },
    { key: "rpo", label: "RPO" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { system: "Primary Data Center", rto: "4h", rpo: "15min", status: "Ready" },
    { system: "Secondary Data Center", rto: "2h", rpo: "5min", status: "Ready" },
    { system: "Cloud DR Site", rto: "1h", rpo: "5min", status: "Ready" },
    { system: "Backup Systems", rto: "8h", rpo: "1h", status: "Ready" },
    { system: "Communication Systems", rto: "2h", rpo: "30min", status: "Ready" },
  ];

  return (
    <AppShell>
      <ModulePage title="Disaster Recovery Commander" subtitle="Disaster recovery command" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
