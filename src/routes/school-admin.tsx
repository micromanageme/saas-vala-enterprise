import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/school-admin")({
  head: () => ({ meta: [{ title: "School Admin — SaaS Vala" }, { name: "description", content: "School administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: schoolData, isLoading, error } = useQuery({
    queryKey: ["school-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch School Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="School Admin" subtitle="School administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load School Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Students Enrolled", value: "1.2K", delta: "+50", up: true },
    { label: "Teachers", value: "85", delta: "+5", up: true },
    { label: "Attendance Rate", value: "94%", delta: "+1%", up: true },
    { label: "Avg Grade Score", value: "B+", delta: "+", up: true },
  ];

  const columns = [
    { key: "class", label: "Class" },
    { key: "students", label: "Students" },
    { key: "teacher", label: "Teacher" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { class: "Grade 1-A", students: "30", teacher: "Ms. Johnson", status: "Active" },
    { class: "Grade 2-B", students: "28", teacher: "Mr. Smith", status: "Active" },
    { class: "Grade 3-A", students: "32", teacher: "Mrs. Davis", status: "Active" },
    { class: "Grade 4-B", students: "29", teacher: "Mr. Wilson", status: "Active" },
    { class: "Grade 5-A", students: "31", teacher: "Ms. Brown", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="School Admin" subtitle="School administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
