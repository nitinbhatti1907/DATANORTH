"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Self-contained looping SVG animation that visualizes the DATANORTH story:
 * scattered data points → flow into a clean chart → community map lights up → decision arrow.
 * Plays automatically, ~10s loop, pure CSS/SVG (no video files).
 */
export function HeroAnimation() {
  const [stage, setStage] = useState(0); // 0 → 1 → 2 → 3 → 0
  const ref = useRef<HTMLDivElement>(null);
  const playing = useRef(true);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      setStage(3);
      return;
    }

    const tick = () => {
      if (!playing.current) return;
      setStage((s) => (s + 1) % 4);
    };
    const interval = setInterval(tick, 2500);

    // Pause when off-screen
    const el = ref.current;
    let io: IntersectionObserver | null = null;
    if (el) {
      io = new IntersectionObserver(
        ([entry]) => {
          playing.current = entry.isIntersecting;
        },
        { threshold: 0.2 },
      );
      io.observe(el);
    }

    return () => {
      clearInterval(interval);
      io?.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-ink-200 bg-gradient-to-br from-white via-nordik-50/30 to-white shadow-elev-2"
      aria-label="Animation showing scattered data points organizing into clear insights for community decisions"
      role="img"
      style={{ isolation: "isolate" }}
    >
      {/* Background grid */}
      <svg
        viewBox="0 0 800 500"
        className="absolute -inset-px h-[calc(100%+2px)] w-[calc(100%+2px)]"
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block" }}
      >
        <defs>
          <pattern
            id="hero-grid"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="0.5"
            />
          </pattern>
          <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#164284" />
            <stop offset="100%" stopColor="#2563a8" />
          </linearGradient>
          <linearGradient id="area-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#164284" stopOpacity="0.18" />
            <stop offset="80%" stopColor="#164284" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#164284" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#164284" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#164284" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="800" height="500" fill="url(#hero-grid)" opacity="0.6" />
        <rect width="800" height="500" fill="white" opacity="0" />

        {/* ============ STAGE 0: SCATTERED DOTS ============ */}
        <g
          style={{
            opacity: stage === 0 ? 1 : 0,
            transition: "opacity 800ms ease",
          }}
        >
          {SCATTERED_POINTS.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={p.r}
              fill={p.color}
              opacity={p.opacity}
              style={{
                animation: `hero-float ${2 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
          <text
            x="400"
            y="450"
            textAnchor="middle"
            className="hero-caption"
            fill="#475569"
          >
            Data is scattered.
          </text>
        </g>

        {/* ============ STAGE 1: FLOWING INTO CHART ============ */}
        <g
          style={{
            opacity: stage === 1 ? 1 : 0,
            transition: "opacity 800ms ease",
          }}
        >
          {/* Trend line */}
          <path
            d="M 100 380 Q 200 340, 280 320 T 460 240 T 700 140"
            fill="none"
            stroke="url(#line-grad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="900"
            strokeDashoffset={stage === 1 ? "0" : "900"}
            style={{
              transition: "stroke-dashoffset 1.6s ease-out",
            }}
          />
          {/* Area fill */}
          <path
            d="M 100 380 Q 200 340, 280 320 T 460 240 T 700 140 L 700 420 L 100 420 Z"
            fill="url(#area-fade)"
            opacity={stage === 1 ? 1 : 0}
            style={{ transition: "opacity 1.2s ease 0.4s" }}
          />
          {/* Data point markers */}
          {[
            [100, 380],
            [220, 334],
            [340, 300],
            [460, 240],
            [580, 180],
            [700, 140],
          ].map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="5"
              fill="#164284"
              stroke="white"
              strokeWidth="2"
              opacity={stage === 1 ? 1 : 0}
              style={{
                transition: `opacity 400ms ease ${0.8 + i * 0.15}s, transform 400ms ease ${0.8 + i * 0.15}s`,
              }}
            />
          ))}
          <text
            x="400"
            y="450"
            textAnchor="middle"
            className="hero-caption"
            fill="#475569"
          >
            We organize it into clear signals.
          </text>
        </g>

        {/* ============ STAGE 2: COMMUNITY MAP ============ */}
        <g
          style={{
            opacity: stage === 2 ? 1 : 0,
            transition: "opacity 800ms ease",
          }}
        >
          {COMMUNITIES.map((c, i) => (
            <g key={c.name}>
              {/* Glow */}
              <circle
                cx={c.x}
                cy={c.y}
                r="42"
                fill="url(#glow)"
                opacity={stage === 2 ? 1 : 0}
                style={{
                  transition: `opacity 600ms ease ${i * 0.15}s`,
                }}
              />
              {/* Connector line to next */}
              {i < COMMUNITIES.length - 1 && (
                <line
                  x1={c.x}
                  y1={c.y}
                  x2={COMMUNITIES[i + 1].x}
                  y2={COMMUNITIES[i + 1].y}
                  stroke="#164284"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity={stage === 2 ? 0.3 : 0}
                  style={{
                    transition: `opacity 600ms ease ${i * 0.15 + 0.3}s`,
                  }}
                />
              )}
              {/* Dot */}
              <circle
                cx={c.x}
                cy={c.y}
                r="8"
                fill="#164284"
                stroke="white"
                strokeWidth="2.5"
              />
              {/* Label */}
              <text
                x={c.x}
                y={c.y - 18}
                textAnchor="middle"
                fill="#0f172a"
                fontSize="11"
                fontWeight="500"
                fontFamily="var(--font-inter), sans-serif"
                opacity={stage === 2 ? 1 : 0}
                style={{
                  transition: `opacity 600ms ease ${i * 0.15 + 0.2}s`,
                }}
              >
                {c.name}
              </text>
              {/* Value badge */}
              <g
                opacity={stage === 2 ? 1 : 0}
                style={{
                  transition: `opacity 600ms ease ${i * 0.15 + 0.4}s`,
                }}
              >
                <rect
                  x={c.x - 22}
                  y={c.y + 14}
                  width="44"
                  height="18"
                  rx="9"
                  fill={c.accent}
                />
                <text
                  x={c.x}
                  y={c.y + 26}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="var(--font-jetbrains), monospace"
                >
                  {c.value}
                </text>
              </g>
            </g>
          ))}
          <text
            x="400"
            y="450"
            textAnchor="middle"
            className="hero-caption"
            fill="#475569"
          >
            For every community across the North.
          </text>
        </g>

        {/* ============ STAGE 3: DECISION ============ */}
        <g
          style={{
            opacity: stage === 3 ? 1 : 0,
            transition: "opacity 800ms ease",
          }}
        >
          {/* Question */}
          <g
            transform="translate(130, 180)"
            opacity={stage === 3 ? 1 : 0}
            style={{ transition: "opacity 500ms ease" }}
          >
            <rect
              x="0"
              y="0"
              width="220"
              height="70"
              rx="12"
              fill="white"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
            <text
              x="16"
              y="26"
              fill="#64748b"
              fontSize="10"
              fontWeight="600"
              fontFamily="var(--font-inter), sans-serif"
              letterSpacing="0.05em"
            >
              QUESTION
            </text>
            <text
              x="16"
              y="50"
              fill="#0f172a"
              fontSize="14"
              fontWeight="600"
              fontFamily="var(--font-inter), sans-serif"
            >
              Where should we invest?
            </text>
          </g>

          {/* Arrow */}
          <g
            opacity={stage === 3 ? 1 : 0}
            style={{
              transition: "opacity 600ms ease 0.4s",
            }}
          >
            <path
              d="M 360 215 L 440 215"
              stroke="#164284"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 432 209 L 440 215 L 432 221"
              stroke="#164284"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Answer */}
          <g
            transform="translate(470, 170)"
            opacity={stage === 3 ? 1 : 0}
            style={{
              transition: "opacity 600ms ease 0.7s",
            }}
          >
            <rect
              x="0"
              y="0"
              width="230"
              height="90"
              rx="12"
              fill="#164284"
            />
            {/* Spark icon — top right corner, well away from text */}
            <g transform="translate(208, 22)">
              <circle r="11" fill="#10b981" />
              <path
                d="M -4 0 L -1 3 L 4 -3"
                stroke="white"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <text
              x="16"
              y="26"
              fill="#bcd4ff"
              fontSize="10"
              fontWeight="600"
              fontFamily="var(--font-inter), sans-serif"
              letterSpacing="0.05em"
            >
              EVIDENCE-BACKED ANSWER
            </text>
            <text
              x="16"
              y="52"
              fill="white"
              fontSize="15"
              fontWeight="700"
              fontFamily="var(--font-inter), sans-serif"
            >
              Sault Ste. Marie
            </text>
            <text
              x="16"
              y="72"
              fill="#bcd4ff"
              fontSize="11"
              fontFamily="var(--font-inter), sans-serif"
            >
              Growing pop. + rising income
            </text>
          </g>

          <text
            x="400"
            y="450"
            textAnchor="middle"
            className="hero-caption"
            fill="#475569"
          >
            So you can make better decisions.
          </text>
        </g>
      </svg>

      {/* Stage indicator dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setStage(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === stage
                ? "w-6 bg-nordik-700"
                : "w-1.5 bg-ink-300 hover:bg-ink-400"
            }`}
            aria-label={`Show stage ${i + 1} of 4`}
          />
        ))}
      </div>

      <style jsx>{`
        :global(.hero-caption) {
          font-family: var(--font-fraunces), serif;
          font-size: 18px;
          font-weight: 500;
          letter-spacing: -0.01em;
        }
        @keyframes hero-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </div>
  );
}

// Scattered data points — randomized but consistent (no SSR mismatch)
const SCATTERED_POINTS = [
  { x: 120, y: 100, r: 5, color: "#164284", opacity: 0.7 },
  { x: 180, y: 200, r: 4, color: "#b45309", opacity: 0.6 },
  { x: 90, y: 280, r: 6, color: "#047857", opacity: 0.8 },
  { x: 220, y: 130, r: 3, color: "#6d28d9", opacity: 0.5 },
  { x: 280, y: 250, r: 5, color: "#164284", opacity: 0.6 },
  { x: 340, y: 90, r: 4, color: "#b45309", opacity: 0.7 },
  { x: 380, y: 320, r: 6, color: "#047857", opacity: 0.6 },
  { x: 440, y: 180, r: 4, color: "#164284", opacity: 0.5 },
  { x: 500, y: 110, r: 5, color: "#6d28d9", opacity: 0.6 },
  { x: 520, y: 280, r: 4, color: "#b45309", opacity: 0.7 },
  { x: 580, y: 220, r: 6, color: "#164284", opacity: 0.6 },
  { x: 640, y: 130, r: 3, color: "#047857", opacity: 0.5 },
  { x: 680, y: 300, r: 5, color: "#164284", opacity: 0.7 },
  { x: 720, y: 200, r: 4, color: "#6d28d9", opacity: 0.6 },
  { x: 150, y: 360, r: 4, color: "#b45309", opacity: 0.5 },
  { x: 420, y: 380, r: 5, color: "#164284", opacity: 0.6 },
  { x: 600, y: 380, r: 4, color: "#047857", opacity: 0.7 },
  { x: 260, y: 380, r: 3, color: "#6d28d9", opacity: 0.5 },
];

const COMMUNITIES = [
  { name: "Sault Ste. Marie", x: 200, y: 240, value: "+5.7%", accent: "#047857" },
  { name: "Greater Sudbury", x: 360, y: 180, value: "+3.2%", accent: "#164284" },
  { name: "Thunder Bay", x: 520, y: 220, value: "+1.4%", accent: "#b45309" },
  { name: "North Bay", x: 660, y: 280, value: "+2.1%", accent: "#6d28d9" },
];