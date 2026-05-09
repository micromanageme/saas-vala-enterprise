import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-bioslayer")({
  head: () => ({ meta: [{ title: "Universal Root BIOS Layer — Universal Access Admin" }, { name: "description", content: "Pre-runtime validation, boot integrity checks, trusted startup chain" }] }),
  component: Page,
});

function Page() {
  const { data: biosData, isLoading, error } = useQuery({
    queryKey: ["root-bioslayer"],
    queryFn: async () => {
      const response = await fetch("/api/root/root-bios-layer?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch BIOS layer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Root BIOS Layer" subtitle="Pre-runtime validation, boot integrity checks, trusted startup chain" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Root BIOS Layer data</div>
      </AppShell>
    );
  }

  const data = biosData?.data;
  const validation = data?.preRuntimeValidation;
  const boot = data?.bootIntegrityChecks;

  const kpis = [
    { label: "Passed Checks", value: `${validation?.passedChecks}/${validation?.totalChecks}`, delta: "—", up: validation?.failedChecks === 0 },
    { label: "Integrity Score", value: boot?.integrityScore || "0%", delta: "—", up: boot?.integrityScore === '100%' },
    { label: "Chain Status", value: data?.trustedStartupChain?.chainStatus || "—", delta: "—", up: data?.trustedStartupChain?.chainStatus === 'TRUSTED' },
  ];

  const rows = [
    { metric: "Total Checks", value: validation?.totalChecks.toString() || "0", status: "OK" },
    { metric: "Total Components", value: boot?.totalComponents.toString() || "0", status: "OK" },
    { metric: "Chain Depth", value: data?.trustedStartupChain?.chainDepth.toString() || "0", status: "OK" },
    { metric: "Total Services", value: data?.secureInitialization?.totalServices.toString() || "0", status: "OK" },
  ];

  const columns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
  ];

  return (
    <AppShell>
      <ModulePage title="Universal Root BIOS Layer" subtitle="Pre-runtime validation, boot integrity checks, trusted startup chain" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
