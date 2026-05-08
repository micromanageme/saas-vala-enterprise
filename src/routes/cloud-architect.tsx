import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/cloud-architect")({
  head: () => ({ meta: [{ title: "Cloud Architect — SaaS Vala" }, { name: "description", content: "Cloud architecture workspace" }] }),
  component: Page,
});

function Page() {
  const { data: cloudArchData, isLoading, error } = useQuery({
    queryKey: ["cloud-architect-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Cloud Architect data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Cloud Architect" subtitle="Cloud architecture workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Cloud Architect data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Cloud Regions", value: "5", delta: "+1", up: true },
    { label: "Services Deployed", value: "45", delta: "+5", up: true },
    { label: "Cloud Cost", value: "$25K/mo", delta: "-5%", up: true },
    { label: "Migration Progress", value: "78%", delta: "+8%", up: true },
  ];

  const columns = [
    { key: "service", label: "Service" },
    { key: "provider", label: "Provider" },
    { key: "region", label: "Region" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { service: "Kubernetes Cluster", provider: "AWS", region: "us-east-1", status: "Running" },
    { service: "Database Cluster", provider: "AWS", region: "us-west-2", status: "Running" },
    { service: "CDN", provider: "Cloudflare", region: "Global", status: "Active" },
    { service: "Object Storage", provider: "GCP", region: "europe-west1", status: "Running" },
    { service: "Function Compute", provider: "Azure", region: "eastus", status: "Running" },
  ];

  return (
    <AppShell>
      <ModulePage title="Cloud Architect" subtitle="Cloud architecture workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
