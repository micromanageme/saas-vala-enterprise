import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/ocr-validation-officer")({
  head: () => ({ meta: [{ title: "OCR Validation Officer — SaaS Vala" }, { name: "description", content: "OCR validation workspace" }] }),
  component: Page,
});

function Page() {
  const { data: ocrData, isLoading, error } = useQuery({
    queryKey: ["ocr-validation-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch OCR Validation Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="OCR Validation Officer" subtitle="OCR validation workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load OCR Validation Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Documents Processed", value: "5K", delta: "+500", up: true },
    { label: "Accuracy", value: "94%", delta: "+2%", up: true },
    { label: "Validations", value: "250", delta: "+25", up: true },
    { label: "Corrections", value: "5%", delta: "-1%", up: true },
  ];

  const columns = [
    { key: "document", label: "Document" },
    { key: "type", label: "Type" },
    { key: "confidence", label: "Confidence" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { document: "OCR-001", type: "Invoice", confidence: "95%", status: "Validated" },
    { document: "OCR-002", type: "Contract", confidence: "92%", status: "In Review" },
    { document: "OCR-003", type: "Form", confidence: "98%", status: "Validated" },
    { document: "OCR-004", type: "Letter", confidence: "90%", status: "Correction Needed" },
    { document: "OCR-005", type: "Report", confidence: "96%", status: "Validated" },
  ];

  return (
    <AppShell>
      <ModulePage title="OCR Validation Officer" subtitle="OCR validation workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
