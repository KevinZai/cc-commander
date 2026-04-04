import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Terminal, TerminalLine } from "../components/Terminal";
import { TypeWriter } from "../components/TypeWriter";
import { FadeIn } from "../components/FadeIn";

const LOG_LINES = [
  { text: "[daemon] Starting CC Commander v2.1.0...", color: "#50FF78", frame: 20 },
  { text: "[daemon] Loading 350+ skills from vendor index...", color: "#8b949e", frame: 32 },
  { text: "[daemon] Tick: processing task-001 — Fix login bug", color: "#00C8FF", frame: 45 },
  { text: "[daemon] Queue: 3 pending, 2 done", color: "#c9d1d9", frame: 57 },
  { text: "[daemon] task-002 dispatched → code-review skill", color: "#00C8FF", frame: 68 },
  { text: "[daemon] Dream: 15 lessons consolidated from session", color: "#FFD700", frame: 80 },
  { text: "[daemon] Knowledge base updated ✓", color: "#50FF78", frame: 92 },
];

export const DaemonMode: React.FC = () => {
  const frame = useCurrentFrame();

  const pulseOpacity = 0.4 + 0.6 * Math.sin(frame / 12);

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
      <FadeIn startFrame={0} durationFrames={20} translateY={20}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 28,
            color: "#50FF78",
            letterSpacing: 2,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#50FF78",
              opacity: pulseOpacity,
              boxShadow: "0 0 8px #50FF78",
            }}
          />
          DAEMON MODE — RUNNING
        </div>
      </FadeIn>

      <FadeIn startFrame={5} durationFrames={20}>
        <Terminal title="ccc --daemon" style={{ width: 900 }}>
          <TerminalLine prompt>
            <TypeWriter
              text="ccc --daemon"
              startFrame={5}
              durationFrames={18}
              color="#c9d1d9"
              showCursor={false}
            />
          </TerminalLine>

          <div style={{ marginTop: 16 }}>
            {LOG_LINES.map((line, i) => {
              const opacity = interpolate(
                frame,
                [line.frame, line.frame + 10],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              return (
                <div
                  key={i}
                  style={{
                    opacity,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 17,
                    color: line.color,
                    marginBottom: 6,
                    lineHeight: 1.5,
                  }}
                >
                  {line.text}
                </div>
              );
            })}
          </div>
        </Terminal>
      </FadeIn>
    </AbsoluteFill>
  );
};
