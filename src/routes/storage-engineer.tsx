import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/storage-engineer")({
  head: () => ({ meta: [{ title: "Storage Engineer — SaaS Vala" }, { name: "description", content: "Storage engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: storageData, isLoading, error } = useQuery({
    queryKey: ["storage-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Storage Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Storage Engineer" subtitle="Storage engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Storage Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Total Storage", value: "450TB", delta: "+50TB", up: true },
    { label: "Used Storage", value: "285TB", delta: "+25TB", up: false },
    { label: "IOPS", value: "125K", delta: "+15K", up: true },
    { label: "Throughput", value: "8.5GB/s", delta: "+1GB/s", up: true },
  ];

  const columns = [
    { key: "system", label: "Storage System" },
    { key: "type", label: "Type" },
    { key: "capacity", label: "Capacity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { system: "Primary SSD Array", type: "NVMe", capacity: "100TB", status: "Healthy" },
    { system: "Secondary HDD Array", type: "SAS", capacity: "200TB", status: "Healthy" },
    { system: "Object Storage", type: "S3", capacity: "100TB", status: "Healthy" },
    { system: "Backup System", type: "Tape", capacity: "50TB", status: "Healthy" },
    { system: "Archive Storage", type: "Cold", capacity: "50TB", status: "Healthy" },
  ];

  return (
    <AppShell>
      <ModulePage title="Storage Engineer" subtitle="Storage engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
