import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TypewriterText } from "../components/TypewriterText";

// Scene 2: Problem → Solution — frames 0-180 (6s)
// Line 1 "450+ skills. 19 vendors. Zero setup." types first
// Line 2 "An AI brain that learns every session." types second

const LINE1 = "450+ skills. 19 vendors. Zero setup.";
const LINE2 = "An AI brain that learns every session.";

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();

  const sceneOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const line1Start = 15;
  const line1Duration = Math.ceil(LINE1.length / 0.8); // ~46 frames
  const line2Start = line1Start + line1Duration + 15; // pause between lines

  // Subtle fade-in for the decorative label
  const labelOpacity = interpolate(frame, [line2Start + 20, line2Start + 35], [0, 1], {
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
      {/* Dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(88,166,255,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          textAlign: "center",
        }}
      >
        {/* Small category label */}
        <div
          style={{
            fontFamily: '"SF Mono", monospace',
            fontSize: 13,
            color: "#ff6600",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          What you get
        </div>

        {/* Line 1 */}
        <div style={{ minHeight: 70 }}>
          <TypewriterText
            text={LINE1}
            startFrame={line1Start}
            fontSize={56}
            fontWeight={700}
            color="#e6edf3"
            showCursor={frame < line2Start}
          />
        </div>

        {/* Line 2 */}
        <div style={{ minHeight: 50 }}>
          {frame >= line2Start && (
            <TypewriterText
              text={LINE2}
              startFrame={line2Start}
              fontSize={40}
              fontWeight={400}
              color="#58a6ff"
              showCursor
            />
          )}
        </div>

        {/* Bottom accent row */}
        <div
          style={{
            opacity: labelOpacity,
            display: "flex",
            gap: 32,
            fontFamily: '"SF Mono", monospace',
            fontSize: 15,
            color: "#484f58",
            marginTop: 8,
          }}
        >
          <span>Opus plans</span>
          <span style={{ color: "#2d333b" }}>·</span>
          <span>Sonnet builds</span>
          <span style={{ color: "#2d333b" }}>·</span>
          <span>Haiku workers</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
