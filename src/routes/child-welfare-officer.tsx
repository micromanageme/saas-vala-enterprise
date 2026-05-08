import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/child-welfare-officer")({
  head: () => ({ meta: [{ title: "Child Welfare Officer — SaaS Vala" }, { name: "description", content: "Child welfare workspace" }] }),
  component: Page,
});

function Page() {
  const { data: childData, isLoading, error } = useQuery({
    queryKey: ["child-welfare-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Child Welfare Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Child Welfare Officer" subtitle="Child welfare workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Child Welfare Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Children in Care", value: "85", delta: "+5", up: true },
    { label: "Placements", value: "45", delta: "+3", up: true },
    { label: "Foster Families", value: "60", delta: "+5", up: true },
    { label: "Safety Score", value: "98%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "child", label: "Child ID" },
    { key: "age", label: "Age" },
    { key: "placement", label: "Placement Type" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { child: "CH-001", age: "8", placement: "Foster Care", status: "Placed" },
    { child: "CH-002", age: "12", placement: "Group Home", status: "Placed" },
    { child: "CH-003", age: "5", placement: "Foster Care", status: "Placed" },
    { child: "CH-004", age: "15", placement: "Independent Living", status: "Placed" },
    { child: "CH-005", age: "10", placement: "Foster Care", status: "Awaiting" },
  ];

  return (
    <AppShell>
      <ModulePage title="Child Welfare Officer" subtitle="Child welfare workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
