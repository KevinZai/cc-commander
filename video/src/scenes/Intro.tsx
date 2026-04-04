import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { FadeIn } from "../components/FadeIn";
import { TypeWriter } from "../components/TypeWriter";
import { GradientText } from "../components/GradientText";
import { STATS } from "../data/stats";

const ASCII_LOGO = `
 ██████╗ ██████╗ ██████╗
██╔════╝██╔════╝██╔════╝
██║     ██║     ██║
██║     ██║     ██║
╚██████╗╚██████╗╚██████╗
 ╚═════╝ ╚═════╝ ╚═════╝
`.trim();

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoScale = interpolate(frame, [0, 25], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineStart = 35;
  const badgeStart = 80;

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
      {/* ASCII Logo */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          textAlign: "center",
        }}
      >
        <pre
          style={{
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
            fontSize: 36,
            lineHeight: 1.2,
            margin: 0,
            background: "linear-gradient(180deg, #50FF78, #00C8FF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
            letterSpacing: 2,
          }}
        >
          {ASCII_LOGO}
        </pre>
      </div>

      {/* Tagline */}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 26,
          color: "#8b949e",
          textAlign: "center",
          minHeight: 36,
        }}
      >
        {frame >= taglineStart && (
          <TypeWriter
            text="Every Claude Code tool. One install. Guided access."
            startFrame={taglineStart}
            durationFrames={55}
            color="#c9d1d9"
          />
        )}
      </div>

      {/* Version badge */}
      {frame >= badgeStart && (
        <FadeIn startFrame={badgeStart} durationFrames={15}>
          <div
            style={{
              background: "rgba(80, 255, 120, 0.1)",
              border: "1px solid #50FF78",
              borderRadius: 6,
              padding: "6px 20px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 20,
              color: "#50FF78",
              letterSpacing: 2,
            }}
          >
            {STATS.version}
          </div>
        </FadeIn>
      )}
    </AbsoluteFill>
  );
};
