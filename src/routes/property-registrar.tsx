import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/property-registrar")({
  head: () => ({ meta: [{ title: "Property Registrar — SaaS Vala" }, { name: "description", content: "Property registration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: registrarData, isLoading, error } = useQuery({
    queryKey: ["property-registrar-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Property Registrar data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Property Registrar" subtitle="Property registration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Property Registrar data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Registrations", value: "450", delta: "+50", up: true },
    { label: "Transfers", value: "125", delta: "+15", up: true },
    { label: "Processing Time", value: "5 days", delta: "-1 day", up: true },
    { label: "Compliance", value: "98%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "property", label: "Property ID" },
    { key: "owner", label: "Owner" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { property: "REG-001", owner: "John Smith", type: "Land", status: "Registered" },
    { property: "REG-002", owner: "Sarah Johnson", type: "Building", status: "Processing" },
    { property: "REG-003", owner: "Mike Brown", type: "Land", status: "Registered" },
    { property: "REG-004", owner: "Emily Davis", type: "Apartment", status: "Review" },
    { property: "REG-005", owner: "Alex Wilson", type: "Land", status: "Registered" },
  ];

  return (
    <AppShell>
      <ModulePage title="Property Registrar" subtitle="Property registration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
