import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/guest-user")({
  head: () => ({ meta: [{ title: "Guest User — SaaS Vala" }, { name: "description", content: "Guest user portal" }] }),
  component: Page,
});

function Page() {
  const { data: guestData, isLoading, error } = useQuery({
    queryKey: ["guest-user-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/public/dashboard");
      if (!response.ok) throw new Error("Failed to fetch Guest User data");
      return response.json();
    },
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Guest User" subtitle="Guest user portal" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Guest User data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Session Time", value: "15min", delta: "—", up: true },
    { label: "Pages Viewed", value: "8", delta: "+3", up: true },
    { label: "Actions Completed", value: "3", delta: "+1", up: true },
    { label: "Sign-up Conversion", value: "Pending", delta: "—", up: true },
  ];

  const columns = [
    { key: "resource", label: "Resource" },
    { key: "access", label: "Access Level" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  const rows = [
    { resource: "Product Demo", access: "Full", status: "Available", action: "View" },
    { resource: "Documentation", access: "Full", status: "Available", action: "View" },
    { resource: "Pricing", access: "Full", status: "Available", action: "View" },
    { resource: "Support Chat", access: "Limited", status: "Available", action: "Start" },
    { resource: "Free Trial", access: "None", status: "Locked", action: "Sign Up" },
  ];

  return (
    <AppShell>
      <ModulePage title="Guest User" subtitle="Guest user portal" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
