import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/zero-trust-admin")({
  head: () => ({ meta: [{ title: "Zero Trust Admin — SaaS Vala" }, { name: "description", content: "Zero Trust administration" }] }),
  component: Page,
});

function Page() {
  const { data: ztData, isLoading, error } = useQuery({
    queryKey: ["zero-trust-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Zero Trust Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Zero Trust Admin" subtitle="Zero Trust administration" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Zero Trust Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Trust Score", value: "0.92", delta: "+0.05", up: true },
    { label: "Devices Verified", value: "8.2K", delta: "+0.3K", up: true },
    { label: "Untrusted Access", value: "0.1%", delta: "-0.05%", up: true },
    { label: "Policy Enforcements", value: "45.2K", delta: "+5K", up: true },
  ];

  const columns = [
    { key: "principle", label: "Zero Trust Principle" },
    { key: "implementation", label: "Implementation" },
    { key: "coverage", label: "Coverage" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { principle: "Verify Explicitly", implementation: "MFA + Certs", coverage: "98%", status: "Active" },
    { principle: "Least Privilege", implementation: "JIT Access", coverage: "95%", status: "Active" },
    { principle: "Assume Breach", implementation: "Micro-segmentation", coverage: "88%", status: "In Progress" },
    { principle: "Continuous Validation", implementation: "Real-time Checks", coverage: "92%", status: "Active" },
    { principle: "Device Trust", implementation: "Posture Check", coverage: "90%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Zero Trust Admin" subtitle="Zero Trust administration" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
