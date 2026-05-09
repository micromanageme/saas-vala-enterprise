import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/chro")({
  head: () => ({ meta: [{ title: "CHRO Dashboard — SaaS Vala" }, { name: "description", content: "Chief Human Resources Officer - HR oversight" }] }),
  component: Page,
});

function Page() {
  const { data: chroData, isLoading, error } = useQuery({
    queryKey: ["chro-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch CHRO data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="CHRO Dashboard" subtitle="Chief Human Resources Officer - HR oversight" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load CHRO data</div>
      </AppShell>
    );
  }

  const data = chroData?.data;
  const kpis = [
    { label: "Total Employees", value: "156", delta: "+8", up: true },
    { label: "Open Positions", value: "12", delta: "-3", up: true },
    { label: "Retention Rate", value: "94%", delta: "+2%", up: true },
    { label: "Employee Satisfaction", value: "4.2/5", delta: "+0.3", up: true },
  ];

  const columns = [
    { key: "department", label: "Department" },
    { key: "headcount", label: "Headcount" },
    { key: "openRoles", label: "Open Roles" },
    { key: "satisfaction", label: "Satisfaction" },
  ];

  const rows = [
    { department: "Engineering", headcount: "45", openRoles: "4", satisfaction: "4.3" },
    { department: "Sales", headcount: "24", openRoles: "3", satisfaction: "4.1" },
    { department: "Marketing", headcount: "18", openRoles: "2", satisfaction: "4.4" },
    { department: "Operations", headcount: "28", openRoles: "1", satisfaction: "4.0" },
    { department: "Support", headcount: "32", openRoles: "2", satisfaction: "4.2" },
  ];

  return (
    <AppShell>
      <ModulePage title="CHRO Dashboard" subtitle="Chief Human Resources Officer - HR oversight" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
