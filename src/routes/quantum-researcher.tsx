import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/quantum-researcher")({
  head: () => ({ meta: [{ title: "Quantum Researcher — SaaS Vala" }, { name: "description", content: "Quantum research workspace" }] }),
  component: Page,
});

function Page() {
  const { data: quantumResearchData, isLoading, error } = useQuery({
    queryKey: ["quantum-researcher-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Quantum Researcher data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Quantum Researcher" subtitle="Quantum research workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Quantum Researcher data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Experiments Run", value: "125", delta: "+15", up: true },
    { label: "Papers Published", value: "8", delta: "+2", up: true },
    { label: "Algorithms Developed", value: "25", delta: "+3", up: true },
    { label: "Compute Hours", value: "2.5K", delta: "+300", up: true },
  ];

  const columns = [
    { key: "experiment", label: "Quantum Experiment" },
    { key: "algorithm", label: "Algorithm" },
    { key: "qubits", label: "Qubits Used" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { experiment: "QEXP-001", algorithm: "Grover's", qubits: "32", status: "Completed" },
    { experiment: "QEXP-002", algorithm: "Shor's", qubits: "64", status: "In Progress" },
    { experiment: "QEXP-003", algorithm: "VQE", qubits: "128", status: "Active" },
    { experiment: "QEXP-004", algorithm: "QAOA", qubits: "256", status: "Planning" },
    { experiment: "QEXP-005", algorithm: "Custom", qubits: "16", status: "Completed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Quantum Researcher" subtitle="Quantum research workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
