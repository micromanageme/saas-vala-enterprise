import type { ReactNode } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

type Props = {
  left: ReactNode;
  right: ReactNode;
  direction?: "horizontal" | "vertical";
  defaultSize?: number;
};

export function SplitScreen({ left, right, direction = "horizontal", defaultSize = 50 }: Props) {
  return (
    <ResizablePanelGroup direction={direction} className="min-h-[480px] rounded-xl border border-border/60 bg-card/40">
      <ResizablePanel defaultSize={defaultSize} minSize={20}>
        <div className="h-full overflow-auto p-3">{left}</div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={100 - defaultSize} minSize={20}>
        <div className="h-full overflow-auto p-3">{right}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
