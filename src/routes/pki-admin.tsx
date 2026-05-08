import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/pki-admin")({
  head: () => ({ meta: [{ title: "PKI Admin — SaaS Vala" }, { name: "description", content: "Public Key Infrastructure" }] }),
  component: Page,
});

function Page() {
  const { data: pkiData, isLoading, error } = useQuery({
    queryKey: ["pki-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch PKI Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="PKI Admin" subtitle="Public Key Infrastructure" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load PKI Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Certificates Issued", value: "1,234", delta: "+45", up: true },
    { label: "Expiring Soon", value: "8", delta: "-2", up: true },
    { label: "CA Health", value: "100%", delta: "—", up: true },
    { label: "Revoked Certs", value: "3", delta: "-1", up: true },
  ];

  const columns = [
    { key: "certificate", label: "Certificate" },
    { key: "type", label: "Type" },
    { key: "expiry", label: "Expiry" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { certificate: "*.saas-vala.com", type: "Wildcard", expiry: "2025-03-15", status: "Valid" },
    { certificate: "api.saas-vala.com", type: "Server", expiry: "2024-12-01", status: "Valid" },
    { certificate: "Internal CA", type: "Root", expiry: "2030-01-01", status: "Valid" },
    { certificate: "Client Cert", type: "Client", expiry: "2024-09-30", status: "Expiring" },
    { certificate: "Code Signing", type: "Code", expiry: "2025-06-15", status: "Valid" },
  ];

  return (
    <AppShell>
      <ModulePage title="PKI Admin" subtitle="Public Key Infrastructure" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
