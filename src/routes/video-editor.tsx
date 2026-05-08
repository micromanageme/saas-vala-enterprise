import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/video-editor")({
  head: () => ({ meta: [{ title: "Video Editor — SaaS Vala" }, { name: "description", content: "Video editing workspace" }] }),
  component: Page,
});

function Page() {
  const { data: videoData, isLoading, error } = useQuery({
    queryKey: ["video-editor-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Video Editor data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Video Editor" subtitle="Video editing workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Video Editor data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Videos Edited", value: "12", delta: "+3", up: true },
    { label: "Total Duration", value: "45min", delta: "+12min", up: true },
    { label: "Render Queue", value: "2", delta: "-1", up: true },
    { label: "Views Generated", value: "12.5K", delta: "+3.2K", up: true },
  ];

  const columns = [
    { key: "video", label: "Video" },
    { key: "duration", label: "Duration" },
    { key: "status", label: "Status" },
    { key: "dueDate", label: "Due Date" },
  ];

  const rows = [
    { video: "Product Demo", duration: "5min", status: "Rendering", dueDate: "2024-07-10" },
    { video: "Tutorial Video", duration: "8min", status: "Complete", dueDate: "2024-07-05" },
    { video: "Testimonial", duration: "3min", status: "Editing", dueDate: "2024-07-12" },
    { video: "Promo Ad", duration: "30s", status: "Complete", dueDate: "2024-07-01" },
    { video: "Webinar Recording", duration: "45min", status: "Review", dueDate: "2024-07-15" },
  ];

  return (
    <AppShell>
      <ModulePage title="Video Editor" subtitle="Video editing workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
