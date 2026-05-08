import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/quantum-system-admin")({
  head: () => ({ meta: [{ title: "Quantum System Admin — SaaS Vala" }, { name: "description", content: "Quantum system administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: quantumData, isLoading, error } = useQuery({
    queryKey: ["quantum-system-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Quantum System Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Quantum System Admin" subtitle="Quantum system administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Quantum System Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Qubits Available", value: "128", delta: "+16", up: true },
    { label: "Quantum Jobs", value: "250", delta: "+35", up: true },
    { label: "Coherence Time", value: "100µs", delta: "+10µs", up: true },
    { label: "Gate Fidelity", value: "99.9%", delta: "+0.1%", up: true },
  ];

  const columns = [
    { key: "system", label: "Quantum System" },
    { key: "qubits", label: "Qubits" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { system: "QS-001", qubits: "64", type: "Superconducting", status: "Online" },
    { system: "QS-002", qubits: "128", type: "Ion Trap", status: "Online" },
    { system: "QS-003", qubits: "32", type: "Photonic", status: "Maintenance" },
    { system: "QS-004", qubits: "256", type: "Superconducting", status: "Online" },
    { system: "QS-005", qubits: "16", type: "Hybrid", status: "Standby" },
  ];

  return (
    <AppShell>
      <ModulePage title="Quantum System Admin" subtitle="Quantum system administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
