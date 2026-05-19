import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/media-manager")({
  head: () => ({ meta: [{ title: "Media Manager — SaaS Vala" }, { name: "description", content: "Media management" }] }),
  component: Page,
});

function Page() {
  const { data: mediaData, isLoading, error, refetch } = useQuery({
    queryKey: ["media-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Media Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Media Manager" subtitle="Media management" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Media Manager"
          subtitle="Media management"
          message="We couldn't load Media Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Total Files", value: "1,234", delta: "+45", up: true },
    { label: "Storage Used", value: "45.2GB", delta: "+2.5GB", up: false },
    { label: "Images", value: "856", delta: "+23", up: true },
    { label: "Videos", value: "234", delta: "+12", up: true },
  ];

  const columns = [
    { key: "file", label: "File" },
    { key: "type", label: "Type" },
    { key: "size", label: "Size" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { file: "hero-banner.jpg", type: "Image", size: "2.5MB", status: "Active" },
    { file: "product-demo.mp4", type: "Video", size: "125MB", status: "Active" },
    { file: "logo.png", type: "Image", size: "500KB", status: "Active" },
    { file: "tutorial-video.mp4", type: "Video", size: "85MB", status: "Processing" },
    { file: "infographic.pdf", type: "Document", size: "5MB", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Media Manager" subtitle="Media management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
