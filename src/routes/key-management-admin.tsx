import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/key-management-admin")({
  head: () => ({ meta: [{ title: "Key Management Admin — SaaS Vala" }, { name: "description", content: "Key management administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: keyData, isLoading, error } = useQuery({
    queryKey: ["key-management-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Key Management Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Key Management Admin" subtitle="Key management administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Key Management Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Keys Managed", value: "250", delta: "+25", up: true },
    { label: "Encryption Strength", value: "256-bit", delta: "0", up: true },
    { label: "Key Rotations", value: "98%", delta: "+1%", up: true },
    { label: "HSM Status", value: "100%", delta: "0%", up: true },
  ];

  const columns = [
    { key: "key", label: "Encryption Key" },
    { key: "algorithm", label: "Algorithm" },
    { key: "usage", label: "Usage" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { key: "KEY-001", algorithm: "AES-256", usage: "Data", status: "Active" },
    { key: "KEY-002", algorithm: "RSA-4096", usage: "Signing", status: "Active" },
    { key: "KEY-003", algorithm: "ECC-384", usage: "TLS", status: "Active" },
    { key: "KEY-004", algorithm: "AES-256", usage: "Database", status: "Rotating" },
    { key: "KEY-005", algorithm: "RSA-2048", usage: "Legacy", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Key Management Admin" subtitle="Key management administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
