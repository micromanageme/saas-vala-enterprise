import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/college-admin")({
  head: () => ({ meta: [{ title: "College Admin — SaaS Vala" }, { name: "description", content: "College administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: collegeData, isLoading, error } = useQuery({
    queryKey: ["college-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch College Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="College Admin" subtitle="College administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load College Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Students Enrolled", value: "3.5K", delta: "+200", up: true },
    { label: "Programs Offered", value: "25", delta: "+2", up: true },
    { label: "Graduation Rate", value: "88%", delta: "+2%", up: true },
    { label: "Employment Rate", value: "92%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "program", label: "College Program" },
    { key: "students", label: "Students" },
    { key: "faculty", label: "Faculty" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { program: "Computer Science", students: "450", faculty: "25", status: "Active" },
    { program: "Business Admin", students: "520", faculty: "30", status: "Active" },
    { program: "Engineering", students: "380", faculty: "28", status: "Active" },
    { program: "Liberal Arts", students: "290", faculty: "20", status: "Active" },
    { program: "Health Sciences", students: "340", faculty: "22", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="College Admin" subtitle="College administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
