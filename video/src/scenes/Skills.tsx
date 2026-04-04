import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { SKILL_NAMES, STATS } from "../data/stats";

const CATEGORY_LABELS = [
  "TDD", "Auth", "Billing", "SEO", "Docker",
  "React", "NextJS", "PostgreSQL", "Redis", "Stripe",
  "CI/CD", "Playwright", "Vitest", "Tailwind", "OpenAPI",
];

export const Skills: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const counter = Math.floor(
    interpolate(frame, [0, 90], [0, STATS.skills], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Scroll offset for the matrix effect
  const scrollOffset = frame * 2.5;

  // Repeat skills array to fill vertical space
  const allSkills = [
    ...SKILL_NAMES,
    ...SKILL_NAMES,
    ...SKILL_NAMES,
    ...SKILL_NAMES,
  ];

  const categoryIndex = Math.floor(frame / 15) % CATEGORY_LABELS.length;
  const catOpacity = interpolate(
    (frame % 15),
    [0, 4, 11, 15],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: "#0d1117",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background skill matrix */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexWrap: "wrap",
          alignContent: "flex-start",
          gap: 10,
          padding: 40,
          transform: `translateY(-${scrollOffset % 400}px)`,
          opacity: 0.25,
        }}
      >
        {allSkills.map((skill, i) => (
          <div
            key={`${skill}-${i}`}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 14,
              color: i % 3 === 0 ? "#50FF78" : i % 3 === 1 ? "#00C8FF" : "#8b949e",
              padding: "4px 10px",
              border: "1px solid rgba(80,255,120,0.15)",
              borderRadius: 4,
              whiteSpace: "nowrap",
            }}
          >
            {skill}
          </div>
        ))}
      </div>

      {/* Central counter */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          background: "rgba(13,17,23,0.85)",
          padding: "48px 80px",
          borderRadius: 16,
          border: "1px solid rgba(80,255,120,0.3)",
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 96,
            fontWeight: "bold",
            background: "linear-gradient(90deg, #50FF78, #00C8FF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1,
          }}
        >
          {counter}+
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 24,
            color: "#8b949e",
            letterSpacing: 3,
          }}
        >
          SKILLS
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 28,
            opacity: catOpacity,
            color: "#FF6600",
            letterSpacing: 1,
          }}
        >
          {CATEGORY_LABELS[categoryIndex]}
        </div>
      </div>
    </AbsoluteFill>
  );
};
