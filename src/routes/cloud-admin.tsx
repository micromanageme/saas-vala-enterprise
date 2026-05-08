import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/cloud-admin")({
  head: () => ({ meta: [{ title: "Cloud Admin — SaaS Vala" }, { name: "description", content: "Cloud infrastructure management" }] }),
  component: Page,
});

function Page() {
  const { data: cloudData, isLoading, error } = useQuery({
    queryKey: ["cloud-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Cloud Admin data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Cloud Admin" subtitle="Cloud infrastructure management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Cloud Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Cloud Instances", value: "45", delta: "+3", up: true },
    { label: "Monthly Cost", value: "$12.5K", delta: "-5%", up: true },
    { label: "Resource Utilization", value: "78%", delta: "+3%", up: true },
    { label: "SLA Compliance", value: "99.9%", delta: "+0.1%", up: true },
  ];

  const columns = [
    { key: "service", label: "Service" },
    { key: "status", label: "Status" },
    { key: "instances", label: "Instances" },
    { key: "cost", label: "Cost" },
  ];

  const rows = [
    { service: "EC2 Instances", status: "Running", instances: "23", cost: "$4.5K" },
    { service: "RDS Databases", status: "Running", instances: "8", cost: "$3.2K" },
    { service: "S3 Storage", status: "Active", instances: "12", cost: "$1.8K" },
    { service: "Load Balancers", status: "Active", instances: "4", cost: "$0.8K" },
    { service: "CloudFront CDN", status: "Active", instances: "2", cost: "$2.2K" },
  ];

  return (
    <AppShell>
      <ModulePage title="Cloud Admin" subtitle="Cloud infrastructure management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
