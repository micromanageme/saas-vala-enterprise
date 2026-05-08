import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/telecaller")({
  head: () => ({ meta: [{ title: "Telecaller — SaaS Vala" }, { name: "description", content: "Telecaller workspace" }] }),
  component: Page,
});

function Page() {
  const { data: telecallerData, isLoading, error } = useQuery({
    queryKey: ["telecaller-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Telecaller data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Telecaller" subtitle="Telecaller workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Telecaller data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Calls Today", value: "45", delta: "+8", up: true },
    { label: "Connections", value: "23", delta: "+5", up: true },
    { label: "Appointments Set", value: "8", delta: "+2", up: true },
    { label: "Conversion Rate", value: "18%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "call", label: "Call" },
    { key: "prospect", label: "Prospect" },
    { key: "outcome", label: "Outcome" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { call: "John Smith", prospect: "Acme Corp", outcome: "Appointment Set", status: "Follow-up" },
    { call: "Sarah Johnson", prospect: "TechStart", outcome: "Interested", status: "Follow-up" },
    { call: "Mike Brown", prospect: "Global Ltd", outcome: "Not Interested", status: "Closed" },
    { call: "Emily Davis", prospect: "Innovate Co", outcome: "Voicemail", status: "Callback" },
    { call: "Alex Wilson", prospect: "Future Systems", outcome: "Appointment Set", status: "Follow-up" },
  ];

  return (
    <AppShell>
      <ModulePage title="Telecaller" subtitle="Telecaller workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
