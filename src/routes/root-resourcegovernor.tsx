import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-resourcegovernor")({
  head: () => ({ meta: [{ title: "Universal Resource Governor — Universal Access Admin" }, { name: "description", content: "CPU/RAM/GPU governance, tenant resource quotas" }] }),
  component: Page,
});

function Page() {
  const { data: resourceData, isLoading, error } = useQuery({
    queryKey: ["root-resourcegovernor"],
    queryFn: async () => {
      const response = await fetch("/api/root/resource-governor?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch resource governor data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Resource Governor" subtitle="CPU/RAM/GPU governance, tenant resource quotas" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Resource Governor data</div>
      </AppShell>
    );
  }

  const data = resourceData?.data;
  const cpu = data?.cpuGovernance;
  const ram = data?.ramGovernance;

  const kpis = [
    { label: "CPU Utilization", value: cpu?.utilization || "0%", delta: "—", up: true },
    { label: "RAM Utilization", value: ram?.utilization || "0%", delta: "—", up: true },
    { label: "Allocated Cores", value: `${cpu?.allocatedCores}/${cpu?.totalCores}`, delta: "—", up: true },
    { label: "Allocated RAM", value: `${ram?.allocatedRAM}/${ram?.totalRAM}`, delta: "—", up: true },
  ];

  const rows = [
    { metric: "Total CPU Cores", value: cpu?.totalCores.toString() || "0", status: "OK" },
    { metric: "Allocated CPU", value: cpu?.allocatedCores.toString() || "0", status: "OK" },
    { metric: "Available CPU", value: cpu?.availableCores.toString() || "0", status: "OK" },
    { metric: "Total RAM", value: ram?.totalRAM || "0", status: "OK" },
    { metric: "Allocated RAM", value: ram?.allocatedRAM || "0", status: "OK" },
    { metric: "Available RAM", value: ram?.availableRAM || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Universal Resource Governor" subtitle="CPU/RAM/GPU governance, tenant resource quotas" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
