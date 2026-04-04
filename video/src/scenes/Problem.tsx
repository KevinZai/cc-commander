import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Terminal, TerminalLine } from "../components/Terminal";
import { FadeIn } from "../components/FadeIn";
import { TypeWriter } from "../components/TypeWriter";

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();

  const cursorBlink = Math.floor(frame / 15) % 2 === 0;

  const labelOpacity = interpolate(frame, [50, 70], [0, 1], {
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
      }}
    >
      <FadeIn startFrame={0} durationFrames={20} translateY={20}>
        <Terminal
          title="claude — bash"
          style={{ width: 780 }}
        >
          <TerminalLine prompt color="#50FF78">
            <TypeWriter
              text="claude"
              startFrame={5}
              durationFrames={20}
              color="#c9d1d9"
              showCursor={false}
            />
          </TerminalLine>

          {frame >= 30 && (
            <div
              style={{
                marginTop: 12,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 20,
                color: "#8b949e",
                paddingLeft: 4,
              }}
            >
              <div style={{ marginBottom: 8 }}>
                {cursorBlink ? "█" : " "}
              </div>
              <div style={{ color: "#6e7681", fontSize: 18, marginTop: 8 }}>
                No skills. No guidance. No memory.
              </div>
            </div>
          )}
        </Terminal>
      </FadeIn>

      <div
        style={{
          opacity: labelOpacity,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 28,
          color: "#ff5f57",
          letterSpacing: 1,
          textAlign: "center",
        }}
      >
        Stock Claude Code = blank slate
      </div>
    </AbsoluteFill>
  );
};
