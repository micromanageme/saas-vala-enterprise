import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/automation-manager")({
  head: () => ({ meta: [{ title: "Automation Manager — SaaS Vala" }, { name: "description", content: "Automation management" }] }),
  component: Page,
});

function Page() {
  const { data: autoData, isLoading, error } = useQuery({
    queryKey: ["automation-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Automation Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Automation Manager" subtitle="Automation management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Automation Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Automations Active", value: "34", delta: "+5", up: true },
    { label: "Tasks Automated/Day", value: "1,234", delta: "+156", up: true },
    { label: "Time Saved", value: "45h/week", delta: "+8h", up: true },
    { label: "Success Rate", value: "98.5%", delta: "+0.5%", up: true },
  ];

  const columns = [
    { key: "automation", label: "Automation" },
    { key: "frequency", label: "Frequency" },
    { key: "tasks", label: "Tasks/Day" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { automation: "Daily Report Generation", frequency: "Daily", tasks: "45", status: "Active" },
    { automation: "Email Notifications", frequency: "Real-time", tasks: "234", status: "Active" },
    { automation: "Data Backup", frequency: "Hourly", tasks: "24", status: "Active" },
    { automation: "User Sync", frequency: "Every 5min", tasks: "288", status: "Active" },
    { automation: "Invoice Processing", frequency: "Daily", tasks: "123", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Automation Manager" subtitle="Automation management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
