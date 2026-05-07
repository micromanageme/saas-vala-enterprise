export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.72 0.19 295), transparent 70%)" }} />
      <div className="absolute top-1/2 -right-40 h-[520px] w-[520px] rounded-full opacity-25 blur-3xl animate-pulse"
        style={{ background: "radial-gradient(circle, oklch(0.7 0.18 200), transparent 70%)" }} />
      <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.72 0.18 155), transparent 70%)" }} />
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
    </div>
  );
}
