import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { DOMAINS } from "../data/stats";

export const Domains: React.FC = () => {
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
        padding: "40px 80px",
        gap: 32,
      }}
    >
      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 28,
          color: "#50FF78",
          letterSpacing: 2,
          marginBottom: 8,
        }}
      >
        11 CCC DOMAINS
      </div>

      {/* Domain cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          width: "100%",
          maxWidth: 1600,
        }}
      >
        {DOMAINS.map((domain, i) => {
          const delay = 15 + i * 8;
          const cardOpacity = interpolate(frame, [delay, delay + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const cardX = interpolate(
            frame,
            [delay, delay + 18],
            [i % 2 === 0 ? -60 : 60, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const cardY = interpolate(frame, [delay, delay + 18], [30, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={domain.name}
              style={{
                opacity: cardOpacity,
                transform: `translate(${cardX}px, ${cardY}px)`,
                background: "rgba(80,255,120,0.05)",
                border: "1px solid rgba(80,255,120,0.25)",
                borderRadius: 8,
                padding: "16px 20px",
                fontFamily: "'JetBrains Mono', monospace",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div style={{ fontSize: 24 }}>{domain.icon}</div>
              <div style={{ color: "#50FF78", fontSize: 16, letterSpacing: 1 }}>
                {domain.name}
              </div>
              <div
                style={{
                  color: "#00C8FF",
                  fontSize: 22,
                  fontWeight: "bold",
                }}
              >
                {domain.count}
                <span style={{ color: "#8b949e", fontSize: 14, marginLeft: 4 }}>
                  skills
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
