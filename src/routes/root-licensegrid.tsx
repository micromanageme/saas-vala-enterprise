import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-licensegrid")({
  head: () => ({ meta: [{ title: "Universal License Grid — Universal Access Admin" }, { name: "description", content: "Global activations, hardware binding, tamper detection" }] }),
  component: Page,
});

function Page() {
  const { data: licenseData, isLoading, error } = useQuery({
    queryKey: ["root-licensegrid"],
    queryFn: async () => {
      const response = await fetch("/api/root/license-grid?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch license grid data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal License Grid" subtitle="Global activations, hardware binding, tamper detection" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal License Grid data</div>
      </AppShell>
    );
  }

  const data = licenseData?.data;
  const activations = data?.activations || [];
  const tamper = data?.tamperDetection;

  const kpis = tamper ? [
    { label: "Total Licenses", value: tamper.totalLicenses.toLocaleString(), delta: "—", up: true },
    { label: "Tampered", value: tamper.tamperedLicenses.toString(), delta: "—", up: tamper.tamperedLicenses === 0 },
    { label: "Active", value: activations.filter((a: any) => a.status === 'ACTIVE').length.toString(), delta: "—", up: true },
    { label: "Shown", value: activations.length.toString(), delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "key", label: "License Key" },
    { key: "status", label: "Status" },
    { key: "user", label: "User" },
    { key: "tamperDetected", label: "Tamper" },
    { key: "lastValidated", label: "Last Validated" },
  ];

  const rows = activations.map((a: any) => ({
    key: a.key.substring(0, 20) + "...",
    status: a.status,
    user: a.user,
    tamperDetected: a.tamperDetected ? "Yes" : "No",
    lastValidated: a.lastValidated ? new Date(a.lastValidated).toLocaleDateString() : "Never",
  }));

  return (
    <AppShell>
      <ModulePage title="Universal License Grid" subtitle="Global activations, hardware binding, tamper detection" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
