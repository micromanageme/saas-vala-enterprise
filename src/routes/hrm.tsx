import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/hrm")({
  head: () => ({ meta: [{ title: "HRM — SaaS Vala" }, { name: "description", content: "Employees, payroll & leave" }] }),
  component: Page,
});

function Page() {
  const { data: hrmData, isLoading, error } = useQuery({
    queryKey: ["hrm"],
    queryFn: async () => {
      const response = await fetch("/api/hrm?type=all");
      if (!response.ok) throw new Error("Failed to fetch HRM data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="HRM" subtitle="Employees, payroll & leave" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load HRM data</div>
      </AppShell>
    );
  }

  const data = hrmData?.data;
  const kpis = data?.kpis ? [
    { label: "Total Employees", value: data.kpis.totalEmployees.toString(), delta: `+${data.kpis.totalEmployeesDelta}%`, up: data.kpis.totalEmployeesDelta > 0 },
    { label: "Active", value: data.kpis.active.toString(), delta: `+${data.kpis.activeDelta}%`, up: data.kpis.activeDelta > 0 },
    { label: "On Leave", value: data.kpis.onLeave.toString(), delta: `+${data.kpis.onLeaveDelta}`, up: data.kpis.onLeaveDelta < 0 },
    { label: "New Hires", value: data.kpis.newHires.toString(), delta: `+${data.kpis.newHiresDelta}%`, up: data.kpis.newHiresDelta > 0 }
  ] : [];

  const columns = [{ key: "name", label: "Employee" }, { key: "department", label: "Department" }, { key: "position", label: "Position" }, { key: "status", label: "Status" }];
  const rows = data?.employees?.map((employee: any) => ({
    name: employee.name,
    department: employee.department,
    position: employee.position,
    status: employee.status
  })) || [];

  return (
    <AppShell>
      <ModulePage title="HRM" subtitle="Employees, payroll & leave" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
