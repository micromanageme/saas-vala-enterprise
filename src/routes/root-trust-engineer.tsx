import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-trust-engineer")({
  head: () => ({ meta: [{ title: "Root Trust Engineer — SaaS Vala" }, { name: "description", content: "Root trust engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: trustData, isLoading, error } = useQuery({
    queryKey: ["root-trust-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Root Trust Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Trust Engineer" subtitle="Root trust engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Trust Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Trust Chains Validated", value: "5K", delta: "+500", up: true },
    { label: "Certificates Issued", value: "125", delta: "+15", up: true },
    { label: "Trust Score", value: "98%", delta: "+1%", up: true },
    { label: "Security Incidents", value: "0", delta: "0", up: true },
  ];

  const columns = [
    { key: "chain", label: "Trust Chain" },
    { key: "type", label: "Type" },
    { key: "validity", label: "Validity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { chain: "TRUST-001", type: "Root", validity: "Valid", status: "Active" },
    { chain: "TRUST-002", type: "Intermediate", validity: "Valid", status: "Active" },
    { chain: "TRUST-003", type: "Leaf", validity: "Valid", status: "Active" },
    { chain: "TRUST-004", type: "Intermediate", validity: "Expiring", status: "Warning" },
    { chain: "TRUST-005", type: "Root", validity: "Valid", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Root Trust Engineer" subtitle="Root trust engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
