import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/border-security-admin")({
  head: () => ({ meta: [{ title: "Border Security Admin — SaaS Vala" }, { name: "description", content: "Border security administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: borderData, isLoading, error } = useQuery({
    queryKey: ["border-security-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Border Security Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Border Security Admin" subtitle="Border security administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Border Security Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Checkpoints Active", value: "25", delta: "+2", up: true },
    { label: "Crossings Processed", value: "12.5K", delta: "+1.5K", up: true },
    { label: "Security Level", value: "High", delta: "—", up: true },
    { label: "Threat Interceptions", value: "15", delta: "+3", up: true },
  ];

  const columns = [
    { key: "checkpoint", label: "Border Checkpoint" },
    { key: "location", label: "Location" },
    { key: "throughput", label: "Throughput/Hour" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { checkpoint: "BC-NORTH-01", location: "Northern Border", throughput: "450", status: "Active" },
    { checkpoint: "BC-SOUTH-02", location: "Southern Border", throughput: "380", status: "Active" },
    { checkpoint: "BC-EAST-03", location: "Eastern Border", throughput: "520", status: "Active" },
    { checkpoint: "BC-WEST-04", location: "Western Border", throughput: "290", status: "Standby" },
    { checkpoint: "BC-CENTRAL-05", location: "Central Hub", throughput: "620", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Border Security Admin" subtitle="Border security administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
