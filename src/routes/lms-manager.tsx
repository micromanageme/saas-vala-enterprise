import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/lms-manager")({
  head: () => ({ meta: [{ title: "LMS Manager — SaaS Vala" }, { name: "description", content: "Learning management system workspace" }] }),
  component: Page,
});

function Page() {
  const { data: lmsData, isLoading, error } = useQuery({
    queryKey: ["lms-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch LMS Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="LMS Manager" subtitle="Learning management system workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load LMS Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Courses", value: "125", delta: "+15", up: true },
    { label: "Enrolled Students", value: "8.5K", delta: "+500", up: true },
    { label: "Completion Rate", value: "78%", delta: "+3%", up: true },
    { label: "Avg Engagement", value: "85%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "course", label: "Online Course" },
    { key: "enrollments", label: "Enrollments" },
    { key: "completion", label: "Completion Rate" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { course: "Introduction to Programming", enrollments: "1,200", completion: "82%", status: "Active" },
    { course: "Data Science Fundamentals", enrollments: "950", completion: "75%", status: "Active" },
    { course: "Business Analytics", enrollments: "880", completion: "80%", status: "Active" },
    { course: "Digital Marketing", enrollments: "720", completion: "70%", status: "Active" },
    { course: "Project Management", enrollments: "650", completion: "85%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="LMS Manager" subtitle="Learning management system workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
