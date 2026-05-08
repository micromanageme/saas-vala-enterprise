import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/platform-architect")({
  head: () => ({ meta: [{ title: "Platform Architect — SaaS Vala" }, { name: "description", content: "Platform architecture workspace" }] }),
  component: Page,
});

function Page() {
  const { data: platformData, isLoading, error } = useQuery({
    queryKey: ["platform-architect-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Platform Architect data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Platform Architect" subtitle="Platform architecture workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Platform Architect data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Platform Services", value: "23", delta: "+3", up: true },
    { key: "Uptime", label: "Uptime", value: "99.9%", delta: "+0.1%", up: true },
    { label: "API Coverage", value: "85%", delta: "+5%", up: true },
    { label: "Developer Adoption", value: "78%", delta: "+8%", up: true },
  ];

  const columns = [
    { key: "service", label: "Platform Service" },
    { key: "usage", label: "Usage" },
    { key: "latency", label: "Latency" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { service: "Auth Service", usage: "1.2M req/day", latency: "45ms", status: "Healthy" },
    { service: "API Gateway", usage: "2.5M req/day", latency: "30ms", status: "Healthy" },
    { service: "Config Service", usage: "500K req/day", latency: "20ms", status: "Healthy" },
    { service: "Service Mesh", usage: "3.8M req/day", latency: "25ms", status: "Healthy" },
    { service: "Event Bus", usage: "1.8M events/day", latency: "15ms", status: "Healthy" },
  ];

  return (
    <AppShell>
      <ModulePage title="Platform Architect" subtitle="Platform architecture workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
