import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/power-plant-operator")({
  head: () => ({ meta: [{ title: "Power Plant Operator — SaaS Vala" }, { name: "description", content: "Power plant operations workspace" }] }),
  component: Page,
});

function Page() {
  const { data: powerData, isLoading, error } = useQuery({
    queryKey: ["power-plant-operator-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Power Plant Operator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Power Plant Operator" subtitle="Power plant operations workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Power Plant Operator data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Units Online", value: "8", delta: "0", up: true },
    { label: "Total Output", value: "2.5 GW", delta: "+100 MW", up: true },
    { label: "Plant Efficiency", value: "92%", delta: "+1%", up: true },
    { label: "Safety Score", value: "100%", delta: "—", up: true },
  ];

  const columns = [
    { key: "unit", label: "Power Unit" },
    { key: "type", label: "Type" },
    { key: "output", label: "Output" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { unit: "UNIT-01", type: "Turbine", output: "350 MW", status: "Running" },
    { unit: "UNIT-02", type: "Turbine", output: "350 MW", status: "Running" },
    { unit: "UNIT-03", type: "Generator", output: "300 MW", status: "Running" },
    { unit: "UNIT-04", type: "Turbine", output: "350 MW", status: "Standby" },
    { unit: "UNIT-05", type: "Generator", output: "300 MW", status: "Maintenance" },
  ];

  return (
    <AppShell>
      <ModulePage title="Power Plant Operator" subtitle="Power plant operations workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
