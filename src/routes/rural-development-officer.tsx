import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/rural-development-officer")({
  head: () => ({ meta: [{ title: "Rural Development Officer — SaaS Vala" }, { name: "description", content: "Rural development workspace" }] }),
  component: Page,
});

function Page() {
  const { data: ruralData, isLoading, error } = useQuery({
    queryKey: ["rural-development-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Rural Development Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Rural Development Officer" subtitle="Rural development workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Rural Development Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Villages Covered", value: "45", delta: "+3", up: true },
    { label: "Infrastructure Projects", value: "12", delta: "+2", up: true },
    { label: "Farmers Supported", value: "850", delta: "+50", up: true },
    { label: "Development Budget", value: "$2.5M", delta: "+$300K", up: true },
  ];

  const columns = [
    { key: "project", label: "Development Project" },
    { key: "village", label: "Village" },
    { key: "beneficiaries", label: "Beneficiaries" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { project: "Road Construction", village: "Green Valley", beneficiaries: "250", status: "In Progress" },
    { project: "Water Supply", village: "Hillside", beneficiaries: "180", status: "Active" },
    { project: "Electrification", village: "Riverside", beneficiaries: "320", status: "Planning" },
    { project: "Agricultural Support", village: "Meadowlands", beneficiaries: "450", status: "Active" },
    { project: "Healthcare Center", village: "Forestville", beneficiaries: "200", status: "Construction" },
  ];

  return (
    <AppShell>
      <ModulePage title="Rural Development Officer" subtitle="Rural development workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
