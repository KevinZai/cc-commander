import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Terminal, TerminalLine } from "../components/Terminal";
import { TypeWriter } from "../components/TypeWriter";
import { FadeIn } from "../components/FadeIn";
import { STATS } from "../data/stats";

export const Install: React.FC = () => {
  const frame = useCurrentFrame();

  // Progress bar for install
  const progressPct = interpolate(frame, [30, 60], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const progressBlocks = Math.round((progressPct / 100) * 30);

  const showCcc = frame >= 65;
  const showFlash = frame >= 80;

  const flashOpacity = interpolate(frame, [80, 90], [1, 0], {
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
      }}
    >
      {showFlash && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#50FF78",
            opacity: flashOpacity,
            zIndex: 10,
          }}
        />
      )}

      <FadeIn startFrame={0} durationFrames={15} translateY={20}>
        <Terminal title="Terminal" style={{ width: 820 }}>
          {/* Install command */}
          <TerminalLine prompt>
            <TypeWriter
              text={`npm install -g cc-commander`}
              startFrame={5}
              durationFrames={30}
              color="#c9d1d9"
              showCursor={frame < 30}
            />
          </TerminalLine>

          {/* Progress bar */}
          {frame >= 30 && (
            <div
              style={{
                marginTop: 14,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 18,
                color: "#50FF78",
              }}
            >
              <span>{"["}</span>
              <span>{"█".repeat(progressBlocks)}</span>
              <span style={{ color: "#30363d" }}>
                {"░".repeat(30 - progressBlocks)}
              </span>
              <span>{"]"}</span>
              <span style={{ color: "#8b949e", marginLeft: 12 }}>
                {Math.round(progressPct)}%
              </span>
            </div>
          )}

          {/* Installed message */}
          {frame >= 62 && (
            <FadeIn startFrame={62} durationFrames={8}>
              <div
                style={{
                  marginTop: 10,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 18,
                  color: "#50FF78",
                }}
              >
                ✓ cc-commander@{STATS.version.replace("v", "")} installed
              </div>
            </FadeIn>
          )}

          {/* ccc command */}
          {showCcc && (
            <div style={{ marginTop: 16 }}>
              <TerminalLine prompt>
                <TypeWriter
                  text="ccc"
                  startFrame={65}
                  durationFrames={12}
                  color="#c9d1d9"
                  showCursor={!showFlash}
                />
              </TerminalLine>
            </div>
          )}
        </Terminal>
      </FadeIn>
    </AbsoluteFill>
  );
};
