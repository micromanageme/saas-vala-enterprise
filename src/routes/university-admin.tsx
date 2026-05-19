import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/university-admin")({
  head: () => ({ meta: [{ title: "University Admin — SaaS Vala" }, { name: "description", content: "University administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: universityData, isLoading, error, refetch } = useQuery({
    queryKey: ["university-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch University Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="University Admin" subtitle="University administration workspace" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="University Admin"
          subtitle="University administration workspace"
          message="We couldn't load University Admin data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Total Students", value: "15K", delta: "+800", up: true },
    { label: "Research Projects", value: "125", delta: "+15", up: true },
    { label: "Graduation Rate", value: "85%", delta: "+1%", up: true },
    { label: "Research Funding", value: "$25M", delta: "+$3M", up: true },
  ];

  const columns = [
    { key: "department", label: "University Department" },
    { key: "students", label: "Students" },
    { key: "faculty", label: "Faculty" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { department: "Engineering", students: "3,200", faculty: "150", status: "Active" },
    { department: "Medicine", students: "2,800", faculty: "180", status: "Active" },
    { department: "Business", students: "2,500", faculty: "120", status: "Active" },
    { department: "Arts & Sciences", students: "3,800", faculty: "200", status: "Active" },
    { department: "Law", students: "1,500", faculty: "80", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="University Admin" subtitle="University administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
