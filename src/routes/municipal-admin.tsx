import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/municipal-admin")({
  head: () => ({ meta: [{ title: "Municipal Admin — SaaS Vala" }, { name: "description", content: "Municipal administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: municipalData, isLoading, error } = useQuery({
    queryKey: ["municipal-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Municipal Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Municipal Admin" subtitle="Municipal administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Municipal Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Services Delivered", value: "1.2K", delta: "+150", up: true },
    { label: "Resident Satisfaction", value: "88%", delta: "+3%", up: true },
    { label: "Response Time", value: "4h", delta: "-1h", up: true },
    { label: "Active Projects", value: "18", delta: "+2", up: true },
  ];

  const columns = [
    { key: "service", label: "Municipal Service" },
    { key: "requests", label: "Requests" },
    { key: "completion", label: "Completion Rate" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { service: "Waste Management", requests: "450", completion: "95%", status: "Active" },
    { service: "Water Supply", requests: "280", completion: "98%", status: "Active" },
    { service: "Road Maintenance", requests: "320", completion: "85%", status: "In Progress" },
    { service: "Public Lighting", requests: "150", completion: "92%", status: "Active" },
    { service: "Parks & Recreation", requests: "80", completion: "88%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Municipal Admin" subtitle="Municipal administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
