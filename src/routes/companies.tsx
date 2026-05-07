import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/companies")({
  head: () => ({ meta: [{ title: "Multi Company — SaaS Vala" }, { name: "description", content: "Companies & ledgers" }] }),
  component: Page,
});

const kpis = [
  { label: "Companies", value: "8", delta: "+1", up: true },
  { label: "Currencies", value: "5", delta: "—", up: true },
  { label: "Consolidated Rev", value: "$4.2M", delta: "+9%", up: true },
  { label: "Inter-co Txn", value: "142", delta: "+12", up: true }
];
const columns = [{ key: "code", label: "Code" }, { key: "name", label: "Company" }, { key: "country", label: "Country" }, { key: "currency", label: "Currency" }];
const rows = [
  {
    "code": "SV-IN",
    "name": "SaaS Vala India",
    "country": "India",
    "currency": "INR"
  },
  {
    "code": "SV-US",
    "name": "SaaS Vala USA",
    "country": "USA",
    "currency": "USD"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Multi Company" subtitle="Companies & ledgers" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
