import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TypewriterText } from "../components/TypewriterText";
import { STATS } from "../data/stats";

// Scene 1: Title Card — frames 0-180 (6s)
// Line 1 "CC Commander" types from frame 15
// Line 2 "Every Claude Code tool. One install." types from frame ~85
// Version badge appears at frame 150

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in the whole scene
  const sceneOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Line 1: "CC Commander" — 12 chars at 0.8 ch/f = ~15 frames to type
  const line1Start = 15;
  const line1Chars = 12; // "CC Commander"
  const line1Duration = Math.ceil(line1Chars / 0.8); // ~15 frames

  // Line 2 starts after line1 finishes + 15 frame pause
  const line2Start = line1Start + line1Duration + 15;
  const line2Text = "Every Claude Code tool. One install.";

  // Version badge fades in near the end
  const badgeOpacity = interpolate(frame, [150, 165], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle horizontal rule under title
  const ruleWidth = interpolate(frame, [line1Start, line1Start + 40], [0, 320], {
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
        opacity: sceneOpacity,
      }}
    >
      {/* Subtle dot grid — very quiet */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(255,102,0,0.07) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      {/* Center stack */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Line 1: CC Commander */}
        <div style={{ minHeight: 90, display: "flex", alignItems: "center" }}>
          <TypewriterText
            text="CC Commander"
            startFrame={line1Start}
            fontSize={80}
            fontWeight={700}
            color="#e6edf3"
            showCursor={frame < line2Start}
          />
        </div>

        {/* Accent rule */}
        <div
          style={{
            height: 2,
            width: ruleWidth,
            background: "linear-gradient(90deg, #ff6600, #58a6ff)",
            borderRadius: 1,
            marginBottom: 20,
            marginTop: -4,
          }}
        />

        {/* Line 2: tagline */}
        <div style={{ minHeight: 44, display: "flex", alignItems: "center" }}>
          {frame >= line2Start && (
            <TypewriterText
              text={line2Text}
              startFrame={line2Start}
              fontSize={32}
              fontWeight={400}
              color="#8b949e"
              showCursor
            />
          )}
        </div>
      </div>

      {/* Version badge — bottom right */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          right: 80,
          opacity: badgeOpacity,
          background: "rgba(255,102,0,0.12)",
          border: "1px solid rgba(255,102,0,0.5)",
          borderRadius: 6,
          padding: "6px 18px",
          fontFamily: '"SF Mono", monospace',
          fontSize: 16,
          color: "#ff6600",
          letterSpacing: 1,
        }}
      >
        {STATS.version}
      </div>
    </AbsoluteFill>
  );
};
