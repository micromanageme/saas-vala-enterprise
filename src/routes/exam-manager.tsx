import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/exam-manager")({
  head: () => ({ meta: [{ title: "Exam Manager — SaaS Vala" }, { name: "description", content: "Exam management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: examData, isLoading, error } = useQuery({
    queryKey: ["exam-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Exam Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Exam Manager" subtitle="Exam management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Exam Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Exams Scheduled", value: "45", delta: "+5", up: true },
    { label: "Students Registered", value: "5.2K", delta: "+300", up: true },
    { label: "Pass Rate", value: "85%", delta: "+2%", up: true },
    { label: "Results Published", value: "38", delta: "+4", up: true },
  ];

  const columns = [
    { key: "exam", label: "Examination" },
    { key: "subject", label: "Subject" },
    { key: "students", label: "Registered" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { exam: "EXAM-2024-001", subject: "Mathematics", students: "450", status: "Scheduled" },
    { exam: "EXAM-2024-002", subject: "Science", students: "420", status: "In Progress" },
    { exam: "EXAM-2024-003", subject: "English", students: "480", status: "Completed" },
    { exam: "EXAM-2024-004", subject: "History", students: "320", status: "Scheduled" },
    { exam: "EXAM-2024-005", subject: "Geography", students: "280", status: "Grading" },
  ];

  return (
    <AppShell>
      <ModulePage title="Exam Manager" subtitle="Exam management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
