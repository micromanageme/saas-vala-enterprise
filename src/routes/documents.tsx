import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/documents")({
  head: () => ({ meta: [{ title: "Documents — SaaS Vala" }, { name: "description", content: "Files, media & e-sign" }] }),
  component: Page,
});

function Page() {
  const { data: documentsData, isLoading, error } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const response = await fetch("/api/documents?type=all");
      if (!response.ok) throw new Error("Failed to fetch Documents data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Documents" subtitle="Files, media & e-sign" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Documents data</div>
      </AppShell>
    );
  }

  const data = documentsData?.data;
  const kpis = data?.kpis ? [
    { label: "Total Files", value: data.kpis.totalFiles.toLocaleString(), delta: `+${data.kpis.totalFilesDelta}`, up: data.kpis.totalFilesDelta > 0 },
    { label: "Storage Used", value: `${data.kpis.storageUsed} GB`, delta: `+${data.kpis.storageUsedDelta} GB`, up: data.kpis.storageUsedDelta > 0 },
    { label: "Shared", value: data.kpis.shared.toString(), delta: `+${data.kpis.sharedDelta}`, up: data.kpis.sharedDelta > 0 },
    { label: "Folders", value: data.kpis.folders.toString(), delta: `+${data.kpis.foldersDelta}`, up: data.kpis.foldersDelta > 0 }
  ];

  const columns = [{ key: "name", label: "File" }, { key: "type", label: "Type" }, { key: "size", label: "Size" }, { key: "uploadedBy", label: "Uploaded By" }];
  const rows = data?.documents?.map((d: any) => ({
    name: d.name,
    type: d.type,
    size: `${(d.size / 1024 / 1024).toFixed(1)} MB`,
    uploadedBy: d.uploadedBy
  })) || [];

  return (
    <AppShell>
      <ModulePage title="Documents" subtitle="Files, media & e-sign" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
