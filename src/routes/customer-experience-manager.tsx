import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/customer-experience-manager")({
  head: () => ({ meta: [{ title: "Customer Experience Manager — SaaS Vala" }, { name: "description", content: "Customer experience management" }] }),
  component: Page,
});

function Page() {
  const { data: cxData, isLoading, error } = useQuery({
    queryKey: ["customer-experience-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Customer Experience Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Customer Experience Manager" subtitle="Customer experience management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Customer Experience Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "NPS Score", value: "72", delta: "+5", up: true },
    { label: "CSAT Score", value: "4.6/5", delta: "+0.2", up: true },
    { label: "CES Score", value: "3.2/5", delta: "-0.3", up: true },
    { label: "Churn Rate", value: "2.5%", delta: "-0.5%", up: true },
  ];

  const columns = [
    { key: "journey", label: "Customer Journey" },
    { key: "nps", label: "NPS" },
    { key: "csat", label: "CSAT" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { journey: "Onboarding", nps: "68", csat: "4.5/5", status: "Good" },
    { journey: "Purchase", nps: "75", csat: "4.7/5", status: "Excellent" },
    { journey: "Support", nps: "65", csat: "4.3/5", status: "Good" },
    { journey: "Renewal", nps: "78", csat: "4.8/5", status: "Excellent" },
    { journey: "Offboarding", nps: "55", csat: "3.9/5", status: "Needs Improvement" },
  ];

  return (
    <AppShell>
      <ModulePage title="Customer Experience Manager" subtitle="Customer experience management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
