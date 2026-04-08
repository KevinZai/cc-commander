import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { STATS } from "../data/stats";

// Scene 6: End Card — frames 0-180 (6s)
// CC Commander in orange fades in
// Byline with site + social fades in
// Whole scene fades out over last 30 frames

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bylineOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const githubOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badgeOpacity = interpolate(frame, [70, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out over last 30 frames (frames 150-180)
  const fadeOutOpacity = interpolate(frame, [150, 180], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle pulse on the title glow
  const glowPulse = 0.5 + 0.5 * Math.sin(frame / 25);

  return (
    <AbsoluteFill
      style={{
        background: "#0d1117",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        opacity: fadeOutOpacity,
      }}
    >
      {/* Very subtle warm glow from center */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 300,
          background: `radial-gradient(ellipse, rgba(255,102,0,${0.06 + glowPulse * 0.04}) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Main title — orange */}
      <div
        style={{
          opacity: titleOpacity,
          fontFamily: '"SF Mono", "Fira Code", monospace',
          fontSize: 88,
          fontWeight: 700,
          color: "#ff6600",
          letterSpacing: -1,
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        CC Commander
      </div>

      {/* Accent rule */}
      <div
        style={{
          opacity: titleOpacity,
          height: 2,
          width: 320,
          background: "linear-gradient(90deg, transparent, #ff6600, transparent)",
          borderRadius: 1,
        }}
      />

      {/* Version badge */}
      <div
        style={{
          opacity: badgeOpacity,
          background: "rgba(255,102,0,0.1)",
          border: "1px solid rgba(255,102,0,0.4)",
          borderRadius: 6,
          padding: "6px 20px",
          fontFamily: '"SF Mono", monospace',
          fontSize: 16,
          color: "#ff6600",
          letterSpacing: 2,
          position: "relative",
          zIndex: 1,
        }}
      >
        {STATS.version}
      </div>

      {/* Byline */}
      <div
        style={{
          opacity: bylineOpacity,
          fontFamily: '"SF Mono", monospace',
          fontSize: 20,
          color: "#8b949e",
          textAlign: "center",
          lineHeight: 1.6,
          position: "relative",
          zIndex: 1,
          marginTop: 8,
        }}
      >
        by {STATS.author}
      </div>

      {/* GitHub / site */}
      <div
        style={{
          opacity: githubOpacity,
          display: "flex",
          gap: 20,
          fontFamily: '"SF Mono", monospace',
          fontSize: 16,
          color: "#484f58",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span>{STATS.site}</span>
        <span style={{ color: "#2d333b" }}>·</span>
        <span style={{ color: "#58a6ff" }}>{STATS.github}</span>
      </div>
    </AbsoluteFill>
  );
};
