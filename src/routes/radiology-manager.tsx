import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/radiology-manager")({
  head: () => ({ meta: [{ title: "Radiology Manager — SaaS Vala" }, { name: "description", content: "Radiology management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: radiologyData, isLoading, error } = useQuery({
    queryKey: ["radiology-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Radiology Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Radiology Manager" subtitle="Radiology management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Radiology Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Scans Performed", value: "580", delta: "+45", up: true },
    { label: "Report Turnaround", value: "6h", delta: "-1h", up: true },
    { label: "Equipment Uptime", value: "98.5%", delta: "+0.5%", up: true },
    { label: "Quality Score", value: "97%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "modality", label: "Imaging Modality" },
    { key: "scans", label: "Daily Scans" },
    { key: "utilization", label: "Utilization" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { modality: "X-Ray", scans: "250", utilization: "85%", status: "Active" },
    { modality: "CT Scan", scans: "120", utilization: "75%", status: "Active" },
    { modality: "MRI", scans: "80", utilization: "90%", status: "Active" },
    { modality: "Ultrasound", scans: "95", utilization: "80%", status: "Active" },
    { modality: "PET Scan", scans: "35", utilization: "70%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Radiology Manager" subtitle="Radiology management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
