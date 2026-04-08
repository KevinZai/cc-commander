import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TypewriterText } from "../components/TypewriterText";
import { TerminalWindow } from "../components/TerminalWindow";

// Scene 5: Install CTA — frames 0-240 (8s)
// Title types, then terminal shows install command, then ccc

const TITLE = "Get started in 60 seconds";
const INSTALL_CMD = "$ curl -fsSL .../install-remote.sh | bash";
const CCC_CMD = "$ ccc";

export const Install: React.FC = () => {
  const frame = useCurrentFrame();

  const sceneOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title types from frame 15
  const titleStart = 15;
  const titleDuration = Math.ceil(TITLE.length / 0.8); // ~32 frames

  // Terminal window fades in after title types
  const terminalStart = titleStart + titleDuration + 15;
  const terminalOpacity = interpolate(frame, [terminalStart, terminalStart + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Install cmd types inside terminal
  const installStart = terminalStart + 15;
  const installDuration = Math.ceil(INSTALL_CMD.length / 0.8);

  // ccc cmd types after install
  const cccStart = installStart + installDuration + 20;

  // Success indicator
  const successOpacity = interpolate(frame, [cccStart + 15, cccStart + 25], [0, 1], {
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
        gap: 40,
        opacity: sceneOpacity,
      }}
    >
      {/* Dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(88,166,255,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: 60,
          display: "flex",
          alignItems: "center",
        }}
      >
        <TypewriterText
          text={TITLE}
          startFrame={titleStart}
          fontSize={48}
          fontWeight={700}
          color="#e6edf3"
          showCursor={frame < terminalStart}
        />
      </div>

      {/* Terminal with commands */}
      <div
        style={{
          opacity: terminalOpacity,
          position: "relative",
          zIndex: 1,
        }}
      >
        <TerminalWindow title="Terminal — zsh" width={820}>
          {/* Install command */}
          <div style={{ minHeight: 28 }}>
            {frame >= installStart && (
              <TypewriterText
                text={INSTALL_CMD}
                startFrame={installStart}
                fontSize={17}
                fontWeight={400}
                color="#3fb950"
                showCursor={frame < cccStart}
                charsPerFrame={1.2}
              />
            )}
          </div>

          {/* Success line */}
          <div
            style={{
              opacity: successOpacity,
              color: "#484f58",
              fontSize: 16,
              fontFamily: '"SF Mono", monospace',
              marginTop: 4,
            }}
          >
            {"\u2713 installed — 450+ skills, 19 vendors, 11 domains"}
          </div>

          {/* blank line */}
          <div style={{ height: 12 }} />

          {/* ccc command */}
          <div style={{ minHeight: 28 }}>
            {frame >= cccStart && (
              <TypewriterText
                text={CCC_CMD}
                startFrame={cccStart}
                fontSize={17}
                fontWeight={400}
                color="#ff6600"
                showCursor
                charsPerFrame={1.2}
              />
            )}
          </div>
        </TerminalWindow>
      </div>
    </AbsoluteFill>
  );
};
