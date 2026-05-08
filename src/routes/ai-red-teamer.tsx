import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/ai-red-teamer")({
  head: () => ({ meta: [{ title: "AI Red Teamer — SaaS Vala" }, { name: "description", content: "AI red teaming workspace" }] }),
  component: Page,
});

function Page() {
  const { data: redTeamData, isLoading, error } = useQuery({
    queryKey: ["ai-red-teamer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch AI Red Teamer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="AI Red Teamer" subtitle="AI red teaming workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load AI Red Teamer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Adversarial Tests", value: "45", delta: "+8", up: true },
    { label: "Vulnerabilities Found", value: "12", delta: "+3", up: false },
    { label: "Attack Success Rate", value: "15%", delta: "-5%", up: true },
    { label: "Patches Validated", value: "8", delta: "+2", up: true },
  ];

  const columns = [
    { key: "attack", label: "Attack Type" },
    { key: "target", label: "Target Model" },
    { key: "success", label: "Success Rate" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { attack: "Prompt Injection", target: "Chatbot", success: "20%", status: "Testing" },
    { attack: "Data Poisoning", target: "Classifier", success: "10%", status: "Testing" },
    { attack: "Model Extraction", target: "API", success: "5%", status: "Testing" },
    { attack: "Adversarial Examples", target: "Vision", success: "15%", status: "Testing" },
    { attack: "Membership Inference", target: "Recommendation", success: "8%", status: "Testing" },
  ];

  return (
    <AppShell>
      <ModulePage title="AI Red Teamer" subtitle="AI red teaming workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
