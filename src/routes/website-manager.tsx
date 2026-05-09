import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/website-manager")({
  head: () => ({ meta: [{ title: "Website Manager — SaaS Vala" }, { name: "description", content: "Website management" }] }),
  component: Page,
});

function Page() {
  const { data: websiteData, isLoading, error } = useQuery({
    queryKey: ["website-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Website Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Website Manager" subtitle="Website management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Website Manager data</div>
      </AppShell>
    );
  }

  const data = websiteData?.analytics;
  const kpis = data ? [
    { label: "Page Views", value: data.pageViews.toString(), delta: "+12%", up: true },
    { label: "Unique Visitors", value: "45.2K", delta: "+8%", up: true },
    { label: "Bounce Rate", value: "32%", delta: "-3%", up: true },
    { label: "Avg Session", value: "4.5min", delta: "+0.5min", up: true },
  ];

  const columns = [
    { key: "page", label: "Page" },
    { key: "views", label: "Views" },
    { key: "bounceRate", label: "Bounce Rate" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { page: "/home", views: "12,500", bounceRate: "28%", status: "Live" },
    { page: "/products", views: "8,200", bounceRate: "35%", status: "Live" },
    { page: "/pricing", views: "5,600", bounceRate: "42%", status: "Live" },
    { page: "/blog", views: "4,300", bounceRate: "38%", status: "Live" },
    { page: "/about", views: "2,800", bounceRate: "30%", status: "Live" },
  ];

  return (
    <AppShell>
      <ModulePage title="Website Manager" subtitle="Website management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
