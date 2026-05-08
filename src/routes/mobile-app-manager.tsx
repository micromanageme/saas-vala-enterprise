import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/mobile-app-manager")({
  head: () => ({ meta: [{ title: "Mobile App Manager — SaaS Vala" }, { name: "description", content: "Mobile application management" }] }),
  component: Page,
});

function Page() {
  const { data: mobileData, isLoading, error } = useQuery({
    queryKey: ["mobile-app-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Mobile App Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Mobile App Manager" subtitle="Mobile application management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Mobile App Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "App Downloads", value: "45.2K", delta: "+12%", up: true },
    { label: "Active Users", value: "12.5K", delta: "+8%", up: true },
    { label: "App Rating", value: "4.5/5", delta: "+0.2", up: true },
    { label: "Crash Rate", value: "0.2%", delta: "-0.1%", up: true },
  ];

  const columns = [
    { key: "feature", label: "Feature" },
    { key: "platform", label: "Platform" },
    { key: "status", label: "Status" },
    { key: "release", label: "Release" },
  ];

  const rows = [
    { feature: "Push notifications", platform: "iOS/Android", status: "In Development", release: "v2.1" },
    { feature: "Offline mode", platform: "iOS/Android", status: "Testing", release: "v2.2" },
    { feature: "Biometric auth", platform: "iOS/Android", status: "Released", release: "v2.0" },
    { feature: "Dark mode", platform: "iOS/Android", status: "Released", release: "v1.9" },
    { feature: "Widget support", platform: "iOS", status: "Planned", release: "v2.3" },
  ];

  return (
    <AppShell>
      <ModulePage title="Mobile App Manager" subtitle="Mobile application management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
