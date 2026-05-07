import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/messaging")({
  head: () => ({ meta: [{ title: "Messaging — SaaS Vala" }, { name: "description", content: "WhatsApp · SMS · Email" }] }),
  component: Page,
});

const kpis = [
  { label: "Sent (24h)", value: "24,820", delta: "+8%", up: true },
  { label: "Delivered", value: "99.4%", delta: "+0.2%", up: true },
  { label: "Open Rate", value: "42%", delta: "+3%", up: true },
  { label: "Templates", value: "148", delta: "+4", up: true }
];
const columns = [{ key: "channel", label: "Channel" }, { key: "template", label: "Template" }, { key: "sent", label: "Sent" }, { key: "rate", label: "Delivery" }];
const rows = [
  {
    "channel": "WhatsApp",
    "template": "Order Confirmation",
    "sent": 8420,
    "rate": "99.6%"
  },
  {
    "channel": "Email",
    "template": "Invoice",
    "sent": 12480,
    "rate": "99.1%"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Messaging" subtitle="WhatsApp · SMS · Email" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
