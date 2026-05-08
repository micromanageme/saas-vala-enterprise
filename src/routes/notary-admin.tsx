import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/notary-admin")({
  head: () => ({ meta: [{ title: "Notary Admin — SaaS Vala" }, { name: "description", content: "Notary administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: notaryData, isLoading, error } = useQuery({
    queryKey: ["notary-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Notary Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Notary Admin" subtitle="Notary administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Notary Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Documents Notarized", value: "156", delta: "+25", up: true },
    { label: "Pending Requests", value: "8", delta: "-2", up: true },
    { label: "Verification Rate", value: "99.5%", delta: "+0.2%", up: true },
    { label: "Avg Processing Time", value: "15min", delta: "-2min", up: true },
  ];

  const columns = [
    { key: "document", label: "Document" },
    { key: "type", label: "Type" },
    { key: "requester", label: "Requester" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { document: "Contract Agreement", type: "Legal", requester: "John Smith", status: "Notarized" },
    { document: "Property Deed", type: "Real Estate", requester: "Sarah Johnson", status: "Pending" },
    { document: "Power of Attorney", type: "Legal", requester: "Mike Brown", status: "Notarized" },
    { document: "Affidavit", type: "Legal", requester: "Emily Davis", status: "In Review" },
    { document: "Business License", type: "Commercial", requester: "Alex Wilson", status: "Notarized" },
  ];

  return (
    <AppShell>
      <ModulePage title="Notary Admin" subtitle="Notary administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
