import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/chief-of-staff")({
  head: () => ({ meta: [{ title: "Chief of Staff — SaaS Vala" }, { name: "description", content: "Chief of Staff - Executive coordination" }] }),
  component: Page,
});

function Page() {
  const { data: staffData, isLoading, error } = useQuery({
    queryKey: ["chief-of-staff-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/executive?type=all");
      if (!response.ok) throw new Error("Failed to fetch Chief of Staff data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Chief of Staff" subtitle="Chief of Staff - Executive coordination" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Chief of Staff data</div>
      </AppShell>
    );
  }

  const data = staffData?.data;
  const kpis = data?.kpis ? [
    { label: "Executive Meetings", value: "12/week", delta: "+2", up: true },
    { label: "Action Items", value: "34", delta: "-8", up: true },
    { label: "Initiatives On Track", value: "89%", delta: "+5%", up: true },
    { label: "Board Prep Status", value: "Ready", delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "initiative", label: "Initiative" },
    { key: "owner", label: "Owner" },
    { key: "status", label: "Status" },
    { key: "deadline", label: "Deadline" },
  ];

  const rows = [
    { initiative: "Q3 Expansion", owner: "CEO", status: "On Track", deadline: "Aug 15" },
    { initiative: "Product Launch", owner: "CTO", status: "On Track", deadline: "Aug 30" },
    { initiative: "Hiring Push", owner: "CHRO", status: "At Risk", deadline: "Sep 1" },
    { initiative: "Security Audit", owner: "CISO", status: "Complete", deadline: "Jul 31" },
    { initiative: "Budget Review", owner: "CFO", status: "In Progress", deadline: "Aug 10" },
  ];

  return (
    <AppShell>
      <ModulePage title="Chief of Staff" subtitle="Chief of Staff - Executive coordination" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
