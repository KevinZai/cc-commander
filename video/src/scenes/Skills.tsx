import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { STATS } from "../data/stats";

// Scene 4: Stats Grid — frames 0-240 (8s)
// Animated counters count up from 0 to final value
// Grid rendered with monospace box-drawing chars

interface StatCell {
  label: string;
  value: number;
  suffix?: string;
  color: string;
  startFrame: number;
}

const STAT_CELLS: StatCell[] = [
  { label: "Skills", value: STATS.skills, suffix: "+", color: "#ff6600", startFrame: 20 },
  { label: "Vendors", value: STATS.vendors, suffix: "", color: "#58a6ff", startFrame: 35 },
  { label: "Domains", value: STATS.domains, suffix: "", color: "#3fb950", startFrame: 50 },
  { label: "Tests", value: STATS.tests, suffix: "", color: "#e6edf3", startFrame: 65 },
  { label: "Audit Score", value: STATS.auditScore, suffix: "/100", color: "#ff6600", startFrame: 80 },
  { label: "Themes", value: STATS.themes, suffix: "", color: "#58a6ff", startFrame: 95 },
];

const AnimatedCounter: React.FC<StatCell> = ({
  label,
  value,
  suffix = "",
  color,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const duration = 45; // frames to count up

  const current = Math.floor(
    interpolate(elapsed, [0, duration], [0, value], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const cellOpacity = interpolate(frame, [startFrame - 5, startFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity: cellOpacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        border: "1px solid #21262d",
        background: "rgba(22,27,34,0.6)",
        borderRadius: 8,
        minWidth: 220,
        gap: 8,
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          fontFamily: '"SF Mono", "Fira Code", monospace',
          fontSize: 54,
          fontWeight: 700,
          color,
          lineHeight: 1,
          letterSpacing: -1,
        }}
      >
        {current}
        <span style={{ fontSize: 28 }}>{suffix}</span>
      </div>
      <div
        style={{
          fontFamily: '"SF Mono", monospace',
          fontSize: 14,
          color: "#484f58",
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const Skills: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0d1117",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 48,
      }}
    >
      {/* Dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(255,102,0,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      {/* Section label */}
      <div
        style={{
          opacity: titleOpacity,
          fontFamily: '"SF Mono", monospace',
          fontSize: 13,
          color: "#ff6600",
          letterSpacing: 3,
          textTransform: "uppercase",
          position: "relative",
          zIndex: 1,
        }}
      >
        By the numbers
      </div>

      {/* 3-column × 2-row grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
          position: "relative",
          zIndex: 1,
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid #21262d",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        {STAT_CELLS.map((cell) => (
          <AnimatedCounter key={cell.label} {...cell} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
