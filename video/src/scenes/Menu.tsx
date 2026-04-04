import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Terminal } from "../components/Terminal";
import { FadeIn } from "../components/FadeIn";
import { MENU_ITEMS, STATS } from "../data/stats";

export const Menu: React.FC = () => {
  const frame = useCurrentFrame();

  // Arrow cursor moves through items every ~18 frames
  const cursorPos = Math.min(
    Math.floor(frame / 18),
    MENU_ITEMS.length - 1
  );

  const menuOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const footerOpacity = interpolate(frame, [80, 100], [0, 1], {
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
        gap: 32,
      }}
    >
      <div style={{ opacity: menuOpacity }}>
        <Terminal title="CC Commander v2.1.0 — main menu" style={{ width: 860 }}>
          {/* Header */}
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 16,
              color: "#50FF78",
              marginBottom: 16,
              letterSpacing: 1,
            }}
          >
            ┌─ CC Commander ─────────────────────────────────────────┐
          </div>

          {/* Menu items */}
          <div style={{ paddingLeft: 4 }}>
            {MENU_ITEMS.map((item, i) => {
              const isActive = i === cursorPos;
              return (
                <div
                  key={i}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 19,
                    marginBottom: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: isActive ? "rgba(80,255,120,0.12)" : "transparent",
                    borderRadius: 4,
                    padding: "2px 8px",
                    color: isActive ? "#50FF78" : "#8b949e",
                    transition: "all 0.1s",
                  }}
                >
                  <span style={{ color: isActive ? "#50FF78" : "transparent" }}>
                    ▶
                  </span>
                  {item}
                </div>
              );
            })}
          </div>

          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 16,
              color: "#50FF78",
              marginTop: 16,
              letterSpacing: 1,
            }}
          >
            └───────────────────────────────────────────────────────┘
          </div>
        </Terminal>
      </div>

      {/* Footer stats */}
      <div
        style={{
          opacity: footerOpacity,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 20,
          color: "#8b949e",
          display: "flex",
          gap: 24,
        }}
      >
        <span style={{ color: "#50FF78" }}>{STATS.skills}+ skills</span>
        <span>·</span>
        <span style={{ color: "#00C8FF" }}>{STATS.vendors} vendors</span>
        <span>·</span>
        <span style={{ color: "#FF6600" }}>{STATS.domains} domains</span>
      </div>
    </AbsoluteFill>
  );
};
