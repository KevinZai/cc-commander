import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { FadeIn } from "../components/FadeIn";
import { GradientText } from "../components/GradientText";
import { STATS } from "../data/stats";

const ASCII_LOGO_SMALL = [
  " ██████╗ ██████╗ ██████╗",
  "██╔════╝██╔════╝██╔════╝",
  "██║     ██║     ██║     ",
  "╚██████╗╚██████╗╚██████╗",
  " ╚═════╝ ╚═════╝ ╚═════╝",
].join("\n");

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoScale = interpolate(frame, [0, 30], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cmdOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const statsOpacity = interpolate(frame, [45, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bylineOpacity = interpolate(frame, [65, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle glow pulse on install command
  const glowIntensity = 0.5 + 0.5 * Math.sin(frame / 20);

  return (
    <AbsoluteFill
      style={{
        background: "#0d1117",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 36,
      }}
    >
      {/* Logo */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          textAlign: "center",
        }}
      >
        <pre
          style={{
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            fontSize: 28,
            lineHeight: 1.2,
            margin: 0,
            background: "linear-gradient(180deg, #50FF78, #00C8FF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {ASCII_LOGO_SMALL}
        </pre>
      </div>

      {/* Install command */}
      <div
        style={{
          opacity: cmdOpacity,
          background: "rgba(80,255,120,0.08)",
          border: "1px solid #50FF78",
          borderRadius: 10,
          padding: "20px 48px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 32,
          color: "#50FF78",
          boxShadow: `0 0 ${30 * glowIntensity}px rgba(80,255,120,${0.2 * glowIntensity})`,
          letterSpacing: 1,
        }}
      >
        $ npm install -g cc-commander
      </div>

      {/* Stats line */}
      <div
        style={{
          opacity: statsOpacity,
          display: "flex",
          gap: 20,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 20,
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: 900,
          textAlign: "center",
        }}
      >
        <span style={{ color: "#50FF78" }}>{STATS.skills}+ skills</span>
        <span style={{ color: "#30363d" }}>·</span>
        <span style={{ color: "#00C8FF" }}>{STATS.vendors} vendors</span>
        <span style={{ color: "#30363d" }}>·</span>
        <span style={{ color: "#FF6600" }}>Intelligence Layer</span>
        <span style={{ color: "#30363d" }}>·</span>
        <span style={{ color: "#FFD700" }}>Daemon Mode</span>
        <span style={{ color: "#30363d" }}>·</span>
        <span style={{ color: "#c9d1d9" }}>{STATS.domains} domains</span>
      </div>

      {/* GitHub link */}
      <FadeIn startFrame={75} durationFrames={15}>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 18,
            color: "#8b949e",
            textAlign: "center",
            lineHeight: 1.8,
          }}
        >
          <div>{STATS.github}</div>
          <div style={{ color: "#50FF78", marginTop: 4 }}>
            by {STATS.author} · {STATS.site}
          </div>
        </div>
      </FadeIn>

      {/* Version */}
      <div
        style={{
          opacity: bylineOpacity,
          background: "rgba(80,255,120,0.1)",
          border: "1px solid rgba(80,255,120,0.3)",
          borderRadius: 6,
          padding: "6px 20px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 18,
          color: "#50FF78",
          letterSpacing: 2,
        }}
      >
        {STATS.version}
      </div>
    </AbsoluteFill>
  );
};
