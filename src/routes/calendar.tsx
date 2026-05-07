import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar — SaaS Vala" }, { name: "description", content: "Schedule & events" }] }),
  component: Page,
});

const kpis = [
  { label: "Today", value: "8", delta: "—", up: true },
  { label: "This Week", value: "42", delta: "+6", up: true },
  { label: "Meetings", value: "24", delta: "+4", up: true },
  { label: "Tasks", value: "148", delta: "+12", up: true }
];
const columns = [{ key: "title", label: "Event" }, { key: "when", label: "When" }, { key: "attendees", label: "Attendees" }, { key: "type", label: "Type" }];
const rows = [
  {
    "title": "Sales Sync",
    "when": "Today 14:00",
    "attendees": 6,
    "type": "Meeting"
  },
  {
    "title": "Sprint Review",
    "when": "Fri 11:00",
    "attendees": 8,
    "type": "Meeting"
  }
];

function Page() {
  return (
    <AppShell>
      <ModulePage title="Calendar" subtitle="Schedule & events" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
