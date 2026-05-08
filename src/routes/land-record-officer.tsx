import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/land-record-officer")({
  head: () => ({ meta: [{ title: "Land Record Officer — SaaS Vala" }, { name: "description", content: "Land record management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: landData, isLoading, error } = useQuery({
    queryKey: ["land-record-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Land Record Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Land Record Officer" subtitle="Land record management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Land Record Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Records Digitized", value: "45K", delta: "+5K", up: true },
    { label: "Pending Applications", value: "125", delta: "-15", up: true },
    { label: "Titles Issued", value: "2.5K", delta: "+200", up: true },
    { label: "Dispute Cases", value: "18", delta: "-3", up: true },
  ];

  const columns = [
    { key: "record", label: "Land Record" },
    { key: "owner", label: "Owner" },
    { key: "area", label: "Area" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { record: "LR-2024-001", owner: "John Smith", area: "2.5 acres", status: "Verified" },
    { record: "LR-2024-002", owner: "Sarah Johnson", area: "5.0 acres", status: "In Review" },
    { record: "LR-2024-003", owner: "Mike Brown", area: "1.8 acres", status: "Active" },
    { record: "LR-2024-004", owner: "Emily Davis", area: "3.2 acres", status: "Pending" },
    { record: "LR-2024-005", owner: "Alex Wilson", area: "4.5 acres", status: "Verified" },
  ];

  return (
    <AppShell>
      <ModulePage title="Land Record Officer" subtitle="Land record management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
