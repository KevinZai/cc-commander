import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { MeterBar } from "../components/MeterBar";
import { FadeIn } from "../components/FadeIn";
import { SCORE_WEIGHTS } from "../data/stats";

export const Orchestrator: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const totalScore = interpolate(frame, [80, 110], [0, 87], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const resultOpacity = interpolate(frame, [115, 130], [0, 1], {
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
        padding: 80,
        gap: 40,
      }}
    >
      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 26,
          color: "#50FF78",
          letterSpacing: 2,
          marginBottom: 8,
        }}
      >
        SMART ORCHESTRATOR
      </div>

      {/* Scoring meters */}
      <FadeIn startFrame={10} durationFrames={20}>
        <div
          style={{
            background: "rgba(13,17,23,0.9)",
            border: "1px solid #30363d",
            borderRadius: 12,
            padding: "40px 60px",
            width: 700,
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 16,
              color: "#8b949e",
              marginBottom: 24,
              letterSpacing: 1,
            }}
          >
            Evaluating: repomix v22.8k ★
          </div>

          {SCORE_WEIGHTS.map((w, i) => (
            <MeterBar
              key={w.label}
              label={w.label}
              targetPct={w.pct}
              color={w.color}
              startFrame={20 + i * 15}
              animDuration={25}
            />
          ))}

          {/* Total score */}
          <div
            style={{
              marginTop: 28,
              paddingTop: 20,
              borderTop: "1px solid #30363d",
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <span style={{ color: "#8b949e", fontSize: 20 }}>Score:</span>
            <span
              style={{
                fontSize: 40,
                fontWeight: "bold",
                background: "linear-gradient(90deg, #50FF78, #00C8FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {Math.round(totalScore)}/100
            </span>
          </div>
        </div>
      </FadeIn>

      {/* Result banner */}
      <div
        style={{
          opacity: resultOpacity,
          background: "rgba(80,255,120,0.15)",
          border: "1px solid #50FF78",
          borderRadius: 8,
          padding: "16px 40px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 22,
          color: "#50FF78",
          letterSpacing: 1,
        }}
      >
        ✓ repomix selected — best match for this task
      </div>
    </AbsoluteFill>
  );
};
