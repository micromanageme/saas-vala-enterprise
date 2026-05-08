import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";
import { Plus, UserCheck, Shield, Server, Zap, FileText, Bell } from "lucide-react";

export const Route = createFileRoute("/cto")({
  head: () => ({ meta: [{ title: "CTO Dashboard — SaaS Vala" }, { name: "description", content: "Chief Technology Officer - Technology oversight" }] }),
  component: Page,
});

function Page() {
  const { data: ctoData, isLoading, error } = useQuery({
    queryKey: ["cto-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch CTO data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="CTO Dashboard" subtitle="Chief Technology Officer - Technology oversight" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load CTO data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Tech Stack", value: "25", delta: "+2", up: true },
    { label: "Engineering Team", value: "150", delta: "+10", up: true },
    { label: "Projects Active", value: "20", delta: "+3", up: true },
    { label: "Innovation Score", value: "92%", delta: "+3%", up: true },
  ];

  const quickActions = [
    { label: "New Project", icon: <Plus className="h-4 w-4" />, onClick: () => console.log("New Project") },
    { label: "Add Engineer", icon: <UserCheck className="h-4 w-4" />, onClick: () => console.log("Add Engineer") },
    { label: "Review Security", icon: <Shield className="h-4 w-4" />, onClick: () => console.log("Review Security") },
    { label: "System Status", icon: <Server className="h-4 w-4" />, onClick: () => console.log("System Status") },
  ];

  const moduleShortcuts = [
    { label: "Engineering", path: "/engineering-manager", icon: <Server className="h-4 w-4" /> },
    { label: "DevOps", path: "/devops-manager", icon: <Zap className="h-4 w-4" /> },
    { label: "AI Manager", path: "/ai-manager", icon: <FileText className="h-4 w-4" /> },
    { label: "Security", path: "/security-manager", icon: <Shield className="h-4 w-4" /> },
  ];

  const notifications = [
    { id: "1", title: "Server Alert", message: "High CPU usage detected on production server", timestamp: "2 min ago", type: "warning" as const },
    { id: "2", title: "Deployment Complete", message: "Feature branch deployed successfully", timestamp: "15 min ago", type: "success" as const },
    { id: "3", title: "Security Update", message: "New security patch available", timestamp: "1 hour ago", type: "info" as const },
  ];

  const workflowPipeline = [
    { id: "1", label: "Review", status: "completed" as const },
    { id: "2", label: "Approval", status: "in_progress" as const },
    { id: "3", label: "Deployment", status: "pending" as const },
    { id: "4", label: "Monitoring", status: "pending" as const },
  ];

  const auditLogs = [
    { id: "1", action: "System Update", user: "admin", timestamp: "10 min ago", details: "Updated server configuration" },
    { id: "2", action: "User Access", user: "cto", timestamp: "1 hour ago", details: "Granted access to engineering team" },
    { id: "3", action: "Security Scan", user: "system", timestamp: "2 hours ago", details: "Completed vulnerability scan" },
  ];

  const columns = [
    { key: "service", label: "Service" },
    { key: "status", label: "Status" },
    { key: "latency", label: "Latency" },
    { key: "requests", label: "Requests" },
  ];

  const rows = [
    { service: "API Gateway", status: "Healthy", latency: "45ms", requests: "1.2M" },
    { service: "Database", status: "Healthy", latency: "12ms", requests: "890K" },
    { service: "Cache", status: "Healthy", latency: "3ms", requests: "2.5M" },
    { service: "Queue", status: "Healthy", latency: "8ms", requests: "450K" },
    { service: "AI Engine", status: "Healthy", latency: "120ms", requests: "78K" },
  ];

  return (
    <AppShell>
      <ModulePage 
        title="CTO Dashboard" 
        subtitle="Chief Technology Officer - Technology oversight" 
        kpis={kpis} 
        columns={columns} 
        rows={rows}
        quickActions={quickActions}
        moduleShortcuts={moduleShortcuts}
        notifications={notifications}
        workflowPipeline={workflowPipeline}
        auditLogs={auditLogs}
        showSettings={true}
        showAudit={true}
      />
    </AppShell>
  );
}
