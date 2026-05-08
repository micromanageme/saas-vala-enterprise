import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/public-health-admin")({
  head: () => ({ meta: [{ title: "Public Health Admin — SaaS Vala" }, { name: "description", content: "Public health administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: healthData, isLoading, error } = useQuery({
    queryKey: ["public-health-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Public Health Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Public Health Admin" subtitle="Public health administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Public Health Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Health Programs", value: "15", delta: "+2", up: true },
    { label: "Vaccinations Administered", value: "12.5K", delta: "+1.5K", up: true },
    { key: "Outbreak Response Time", value: "4h", delta: "-1h", up: true },
    { label: "Community Health Score", value: "87%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "program", label: "Health Program" },
    { key: "coverage", label: "Coverage" },
    { key: "participants", label: "Participants" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { program: "Vaccination Drive", coverage: "85%", participants: "8.5K", status: "Active" },
    { program: "Disease Surveillance", coverage: "100%", participants: "N/A", status: "Active" },
    { program: "Health Education", coverage: "70%", participants: "2.5K", status: "In Progress" },
    { program: "Mental Health Support", coverage: "60%", participants: "1.8K", status: "Active" },
    { program: "Nutrition Program", coverage: "75%", participants: "3.2K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Public Health Admin" subtitle="Public health administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
