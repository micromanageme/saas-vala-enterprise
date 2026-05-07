import { useEffect, useRef, useState } from "react";

export function Counter({ value, prefix = "", suffix = "", duration = 900 }: {
  value: number; prefix?: string; suffix?: string; duration?: number;
}) {
  const [n, setN] = useState(0);
  const start = useRef<number | null>(null);
  useEffect(() => {
    let raf = 0;
    const step = (t: number) => {
      if (start.current === null) start.current = t;
      const p = Math.min(1, (t - start.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{prefix}{n.toLocaleString()}{suffix}</>;
}
