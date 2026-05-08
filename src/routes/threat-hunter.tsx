import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/threat-hunter")({
  head: () => ({ meta: [{ title: "Threat Hunter — SaaS Vala" }, { name: "description", content: "Threat hunting workspace" }] }),
  component: Page,
});

function Page() {
  const { data: threatHunterData, isLoading, error } = useQuery({
    queryKey: ["threat-hunter-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Threat Hunter data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Threat Hunter" subtitle="Threat hunting workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Threat Hunter data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Threats Detected", value: "23", delta: "+5", up: false },
    { label: "Threats Neutralized", value: "21", delta: "+4", up: true },
    { label: "Hunts Completed", value: "45", delta: "+8", up: true },
    { label: "Detection Time", value: "2h", delta: "-30min", up: true },
  ];

  const columns = [
    { key: "threat", label: "Threat" },
    { key: "severity", label: "Severity" },
    { key: "source", label: "Source" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { threat: "APT-29 Activity", severity: "Critical", source: "External", status: "Neutralized" },
    { threat: "SQL Injection Attempt", severity: "High", source: "External", status: "Neutralized" },
    { threat: "Insider Activity", severity: "Medium", source: "Internal", status: "Monitoring" },
    { threat: "Brute Force Attack", severity: "High", source: "External", status: "Neutralized" },
    { threat: "Malware Detected", severity: "Critical", source: "External", status: "Neutralized" },
  ];

  return (
    <AppShell>
      <ModulePage title="Threat Hunter" subtitle="Threat hunting workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
