import { createFileRoute } from "@tanstack/react-router";
import { SalesDocPage, type SalesDocConfig } from "@/components/SalesDocPage";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Sales · Orders — SaaS Vala" }] }),
  component: OrdersPage,
});

const config: SalesDocConfig = {
  table: "sales_orders",
  title: "Orders",
  subtitle: "Process and fulfill sales orders. Real backend.",
  prefix: "ORD",
  statuses: ["pending", "processing", "shipped", "completed", "cancelled"] as const,
  statusColor: {
    pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    processing: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    shipped: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    cancelled: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  },
};

function OrdersPage() { return <SalesDocPage config={config} />; }
