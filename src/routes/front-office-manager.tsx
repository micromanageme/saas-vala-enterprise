import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/front-office-manager")({
  head: () => ({ meta: [{ title: "Front Office Manager — SaaS Vala" }, { name: "description", content: "Front office management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: frontOfficeData, isLoading, error } = useQuery({
    queryKey: ["front-office-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Front Office Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Front Office Manager" subtitle="Front office management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Front Office Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Check-ins Today", value: "85", delta: "+10", up: true },
    { label: "Check-outs Today", value: "70", delta: "+8", up: true },
    { label: "Wait Time", value: "3 min", delta: "-1 min", up: true },
    { label: "Guest Satisfaction", value: "4.6/5", delta: "+0.2", up: true },
  ];

  const columns = [
    { key: "staff", label: "Front Desk Staff" },
    { key: "shift", label: "Shift" },
    { key: "checkIns", label: "Check-ins" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { staff: "John Smith", shift: "Morning", checkIns: "30", status: "Active" },
    { staff: "Sarah Johnson", shift: "Morning", checkIns: "25", status: "Active" },
    { staff: "Mike Brown", shift: "Afternoon", checkIns: "20", status: "On Break" },
    { staff: "Emily Davis", shift: "Afternoon", checkIns: "22", status: "Active" },
    { staff: "Alex Wilson", shift: "Evening", checkIns: "18", status: "Standby" },
  ];

  return (
    <AppShell>
      <ModulePage title="Front Office Manager" subtitle="Front office management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
