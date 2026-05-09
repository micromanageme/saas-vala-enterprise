import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-digitalsovereignty")({
  head: () => ({ meta: [{ title: "Universal Digital Sovereignty Control — Universal Access Admin" }, { name: "description", content: "Jurisdiction-aware storage, regional compliance isolation, sovereign cloud governance" }] }),
  component: Page,
});

function Page() {
  const { data: sovereigntyData, isLoading, error } = useQuery({
    queryKey: ["root-digitalsovereignty"],
    queryFn: async () => {
      const response = await fetch("/api/root/digital-sovereignty?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch digital sovereignty data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Digital Sovereignty Control" subtitle="Jurisdiction-aware storage, regional compliance isolation, sovereign cloud governance" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Digital Sovereignty Control data</div>
      </AppShell>
    );
  }

  const data = sovereigntyData?.data;
  const jurisdictions = data?.jurisdictionAwareStorage || [];
  const compliance = data?.regionalComplianceIsolation;

  const kpis = compliance ? [
    { label: "Compliant Regions", value: `${compliance.compliantRegions}/${compliance.totalRegions}`, delta: "—", up: true },
    { label: "Data Leaks", value: compliance.dataLeakageIncidents.toString(), delta: "—", up: compliance.dataLeakageIncidents === 0 },
    { label: "Governance Status", value: data?.sovereignCloudGovernance?.governanceStatus || "—", delta: "—", up: data?.sovereignCloudGovernance?.governanceStatus === 'COMPLIANT' },
  ];

  const columns = [
    { key: "jurisdiction", label: "Jurisdiction" },
    { key: "region", label: "Region" },
    { key: "dataResident", label: "Data Resident" },
    { key: "compliant", label: "Compliant" },
  ];

  const rows = jurisdictions.map((j: any) => ({
    jurisdiction: j.jurisdiction,
    region: j.region,
    dataResident: j.dataResident,
    compliant: j.compliant ? "Yes" : "No",
  }));

  return (
    <AppShell>
      <ModulePage title="Universal Digital Sovereignty Control" subtitle="Jurisdiction-aware storage, regional compliance isolation, sovereign cloud governance" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
