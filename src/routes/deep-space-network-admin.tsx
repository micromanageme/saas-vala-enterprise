import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/deep-space-network-admin")({
  head: () => ({ meta: [{ title: "Deep Space Network Admin — SaaS Vala" }, { name: "description", content: "Deep space network administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: dsnData, isLoading, error } = useQuery({
    queryKey: ["deep-space-network-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Deep Space Network Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Deep Space Network Admin" subtitle="Deep space network administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Deep Space Network Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Antennas Active", value: "12", delta: "+1", up: true },
    { label: "Data Links", value: "25", delta: "+3", up: true },
    { label: "Data Volume", value: "2.5 PB", delta: "+300 TB", up: true },
    { label: "Network Uptime", value: "99.95%", delta: "+0.05%", up: true },
  ];

  const columns = [
    { key: "antenna", label: "DSN Antenna" },
    { key: "diameter", label: "Diameter (m)" },
    { key: "location", label: "Location" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { antenna: "DSN-70M-01", diameter: "70", location: "Goldstone", status: "Tracking" },
    { antenna: "DSN-34M-02", diameter: "34", location: "Canberra", status: "Tracking" },
    { antenna: "DSN-70M-03", diameter: "70", location: "Madrid", status: "Standby" },
    { antenna: "DSN-34M-04", diameter: "34", location: "Goldstone", status: "Maintenance" },
    { antenna: "DSN-34M-05", diameter: "34", location: "Canberra", status: "Tracking" },
  ];

  return (
    <AppShell>
      <ModulePage title="Deep Space Network Admin" subtitle="Deep space network administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
