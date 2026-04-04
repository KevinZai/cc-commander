import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { FadeIn } from "../components/FadeIn";

const FEATURES = [
  {
    icon: "🔤",
    input: '"fix typo"',
    output: "15 turns · $2",
    color: "#50FF78",
    delay: 10,
  },
  {
    icon: "🏗️",
    input: '"build SaaS"',
    output: "50 turns · $10",
    color: "#FF6600",
    delay: 35,
  },
  {
    icon: "📦",
    input: "package.json detected",
    output: "NextJS skills highlighted",
    color: "#00C8FF",
    delay: 60,
  },
  {
    icon: "🔄",
    input: "context overflow",
    output: "auto retry — fewer turns",
    color: "#FFD700",
    delay: 85,
  },
];

export const Intelligence: React.FC = () => {
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
        padding: 80,
        gap: 40,
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 26,
          color: "#50FF78",
          letterSpacing: 2,
        }}
      >
        INTELLIGENCE LAYER
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          width: "100%",
          maxWidth: 900,
        }}
      >
        {FEATURES.map((feat, i) => {
          const opacity = interpolate(frame, [feat.delay, feat.delay + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const x = interpolate(frame, [feat.delay, feat.delay + 18], [-40, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `translateX(${x}px)`,
                display: "flex",
                alignItems: "center",
                gap: 20,
                background: "rgba(22,27,34,0.9)",
                border: `1px solid ${feat.color}40`,
                borderLeft: `3px solid ${feat.color}`,
                borderRadius: 8,
                padding: "18px 28px",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <span style={{ fontSize: 32 }}>{feat.icon}</span>
              <span style={{ color: "#8b949e", fontSize: 20, flex: 1 }}>
                {feat.input}
              </span>
              <span style={{ color: "#30363d", fontSize: 20 }}>→</span>
              <span style={{ color: feat.color, fontSize: 20, flex: 1 }}>
                {feat.output}
              </span>
            </div>
          );
        })}
      </div>

      <FadeIn startFrame={108} durationFrames={15}>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 18,
            color: "#8b949e",
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          Zero configuration · Works automatically · Every session
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
};
