import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { SidePeek } from "@/components/Workspace";

/**
 * Headless harness page used exclusively by Playwright a11y tests
 * (tests/e2e/overlays.spec.ts). Each overlay has a stable trigger id
 * so tests can verify Tab order, Escape-to-close, and focus restoration.
 *
 * Do not link to this route from product UI.
 */

export const Route = createFileRoute("/test/overlays")({
  component: OverlaysHarness,
  head: () => ({ meta: [{ title: "Overlay a11y harness" }, { name: "robots", content: "noindex" }] }),
});

function OverlaysHarness() {
  const [sidePeek, setSidePeek] = useState(false);
  const [walk, setWalk] = useState(false);

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-8">
      <h1 className="text-xl font-semibold">Overlay a11y harness</h1>

      <Dialog>
        <DialogTrigger asChild>
          <Button data-testid="open-dialog">Open dialog</Button>
        </DialogTrigger>
        <DialogContent data-testid="dialog-content">
          <DialogHeader><DialogTitle>Dialog</DialogTitle></DialogHeader>
          <input data-testid="dialog-input-1" placeholder="first" />
          <input data-testid="dialog-input-2" placeholder="second" />
          <Button data-testid="dialog-action">Action</Button>
        </DialogContent>
      </Dialog>

      <Sheet>
        <SheetTrigger asChild>
          <Button data-testid="open-sheet">Open sheet</Button>
        </SheetTrigger>
        <SheetContent data-testid="sheet-content">
          <SheetHeader><SheetTitle>Sheet</SheetTitle></SheetHeader>
          <input data-testid="sheet-input-1" placeholder="first" />
          <Button data-testid="sheet-action">Action</Button>
        </SheetContent>
      </Sheet>

      <Popover>
        <PopoverTrigger asChild>
          <Button data-testid="open-popover">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent data-testid="popover-content">
          <input data-testid="popover-input" placeholder="popover" />
          <Button data-testid="popover-action">Action</Button>
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button data-testid="open-dropdown">Open dropdown</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent data-testid="dropdown-content">
          <DropdownMenuItem data-testid="dropdown-item-1">One</DropdownMenuItem>
          <DropdownMenuItem data-testid="dropdown-item-2">Two</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ContextMenu>
        <ContextMenuTrigger asChild>
          <button
            type="button"
            data-testid="open-contextmenu"
            className="rounded border border-border bg-muted px-4 py-2"
          >
            Right-click target
          </button>
        </ContextMenuTrigger>
        <ContextMenuContent data-testid="contextmenu-content">
          <ContextMenuItem data-testid="contextmenu-item-1">Alpha</ContextMenuItem>
          <ContextMenuItem data-testid="contextmenu-item-2">Beta</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <Dialog>
        <DialogTrigger asChild>
          <Button data-testid="open-command">Open command</Button>
        </DialogTrigger>
        <DialogContent className="p-0" data-testid="command-content">
          <Command>
            <CommandInput data-testid="command-input" placeholder="Search…" />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              <CommandGroup>
                <CommandItem data-testid="command-item-1">Apple</CommandItem>
                <CommandItem data-testid="command-item-2">Banana</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>

      <Button data-testid="open-sidepeek" onClick={() => setSidePeek(true)}>
        Open side peek
      </Button>
      <SidePeek open={sidePeek} onClose={() => setSidePeek(false)} title="Side peek">
        <input data-testid="sidepeek-input" placeholder="sidepeek" />
        <Button data-testid="sidepeek-action">Action</Button>
      </SidePeek>

      <Button data-testid="open-walkthrough" onClick={() => setWalk(true)}>
        Open walkthrough
      </Button>
      {walk && <WalkthroughHarness onClose={() => setWalk(false)} />}
    </div>
  );
}

// Mirror Walkthrough using the same DialogPrimitive shape, but
// controlled so the test can mount/unmount it deterministically.
import * as DialogPrimitive from "@radix-ui/react-dialog";

function WalkthroughHarness({ onClose }: { onClose: () => void }) {
  return (
    <DialogPrimitive.Root open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[70] bg-background/70" />
        <DialogPrimitive.Content
          data-testid="walkthrough-content"
          aria-describedby="walk-desc"
          className="fixed left-1/2 top-1/2 z-[71] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-card p-6 focus:outline-none"
        >
          <DialogPrimitive.Title>Walkthrough</DialogPrimitive.Title>
          <DialogPrimitive.Description id="walk-desc">Tour</DialogPrimitive.Description>
          <Button data-testid="walkthrough-next">Next</Button>
          <Button data-testid="walkthrough-finish" onClick={onClose}>Finish</Button>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
