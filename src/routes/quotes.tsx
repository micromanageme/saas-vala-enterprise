import { createFileRoute } from "@tanstack/react-router";
import { SalesDocPage, type SalesDocConfig } from "@/components/SalesDocPage";

export const Route = createFileRoute("/quotes")({
  head: () => ({ meta: [{ title: "Sales · Quotes — SaaS Vala" }] }),
  component: QuotesPage,
});

const config: SalesDocConfig = {
  table: "sales_quotes",
  title: "Quotes",
  subtitle: "Create, send, and track sales quotes. Real backend.",
  prefix: "QUO",
  statuses: ["draft", "sent", "accepted", "rejected", "expired"] as const,
  statusColor: {
    draft: "bg-slate-500/15 text-slate-300 border-slate-500/30",
    sent: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    accepted: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    rejected: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    expired: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
  extraFields: ["valid_until"],
};

function QuotesPage() { return <SalesDocPage config={config} />; }
