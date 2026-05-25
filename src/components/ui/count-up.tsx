"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: string;
  duration?: number;
}

/**
 * Counts from 0 up to the numeric part of `value` when scrolled into view.
 * Preserves any suffix (e.g. "5+" stays as "5+" at the end).
 */
export function CountUp({ value, duration = 1400 }: CountUpProps) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const isFloat = match ? match[1].includes(".") : false;

  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const start = () => {
      if (started.current) return;
      started.current = true;
      const t0 = performance.now();
      const tick = (now: number) => {
        const elapsed = now - t0;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
        else setDisplay(target);
      };
      requestAnimationFrame(tick);
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      setDisplay(target);
      started.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            start();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  const formatted = isFloat
    ? display.toFixed(1)
    : Math.round(display).toString();

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}