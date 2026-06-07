import { createFileRoute } from "@tanstack/react-router";
import { SalesDocPage, type SalesDocConfig } from "@/components/SalesDocPage";

export const Route = createFileRoute("/invoices")({
  head: () => ({ meta: [{ title: "Sales · Invoices — SaaS Vala" }, { name: "description", content: "Invoice builder & tracking" }] }),
  component: InvoicesPage,
});

const config: SalesDocConfig = {
  table: "sales_invoices",
  title: "Invoices",
  subtitle: "Bill customers and track payments. Real backend.",
  prefix: "INV",
  statuses: ["draft", "sent", "paid", "overdue", "cancelled"] as const,
  statusColor: {
    draft: "bg-slate-500/15 text-slate-300 border-slate-500/30",
    sent: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    paid: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    overdue: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    cancelled: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  },
  extraFields: ["due_date"],
};

function InvoicesPage() { return <SalesDocPage config={config} />; }
