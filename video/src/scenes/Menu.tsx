import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TerminalWindow } from "../components/TerminalWindow";

// Scene 3: Terminal Demo — frames 0-300 (10s)
// Terminal window fades in, then menu content types line by line

const MENU_LINES = [
  { text: "  \u250c  CC Commander v2.3.0", color: "#e6edf3", frame: 20 },
  { text: "  \u2502", color: "#484f58", frame: 28 },
  { text: "  \u25c6  What would you like to do?", color: "#ff6600", frame: 36 },
  { text: "  \u2502  \u25cf Build something new", color: "#e6edf3", frame: 48 },
  { text: "  \u2502     Code, websites, APIs, CLI tools", color: "#8b949e", frame: 56 },
  { text: "  \u2502  \u25cb Create content", color: "#484f58", frame: 68 },
  { text: "  \u2502  \u25cb Research & analyze", color: "#484f58", frame: 76 },
  { text: "  \u2502  \u25cb Review what I built", color: "#484f58", frame: 84 },
  { text: "  \u2502  \u25cb Check my stats", color: "#484f58", frame: 92 },
  { text: "  \u2502  \u25cb Settings", color: "#484f58", frame: 100 },
  { text: "  \u2502  \u25cb Quit", color: "#484f58", frame: 108 },
  { text: "  \u2502", color: "#484f58", frame: 116 },
  { text: "  \u2502  [\u2191\u2193] navigate  [enter] select  [?] help", color: "#484f58", frame: 124 },
  { text: "  \u2514", color: "#e6edf3", frame: 132 },
];

export const Menu: React.FC = () => {
  const frame = useCurrentFrame();

  const windowOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cursor blinks on the highlighted item
  const cursorBlink = Math.floor(frame / 15) % 2 === 0;

  return (
    <AbsoluteFill
      style={{
        background: "#0d1117",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: windowOpacity,
      }}
    >
      {/* Label above */}
      <div
        style={{
          fontFamily: '"SF Mono", monospace',
          fontSize: 13,
          color: "#ff6600",
          letterSpacing: 3,
          textTransform: "uppercase",
          marginBottom: 24,
          opacity: interpolate(frame, [10, 25], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Interactive CLI
      </div>

      <TerminalWindow title="ccc — CC Commander v2.3.0" width={780}>
        {MENU_LINES.map((line, i) => {
          const lineOpacity = interpolate(frame, [line.frame, line.frame + 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // Add blinking cursor to the active (highlighted) line
          const isActiveLine = i === 3; // "Build something new"
          const showCursor = isActiveLine && frame >= line.frame && cursorBlink;

          return (
            <div
              key={i}
              style={{
                opacity: lineOpacity,
                color: line.color,
                fontSize: 16,
                lineHeight: 1.7,
                fontFamily: '"SF Mono", "Fira Code", monospace',
                // Highlight the active item with subtle bg
                ...(isActiveLine
                  ? {
                      background: "rgba(255,102,0,0.08)",
                      borderRadius: 4,
                      margin: "0 -8px",
                      padding: "0 8px",
                    }
                  : {}),
              }}
            >
              {line.text}
              {showCursor && <span style={{ color: "#ff6600" }}>█</span>}
            </div>
          );
        })}
      </TerminalWindow>

      {/* Hint below */}
      <div
        style={{
          marginTop: 24,
          opacity: interpolate(frame, [140, 155], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontFamily: '"SF Mono", monospace',
          fontSize: 14,
          color: "#484f58",
          letterSpacing: 1,
        }}
      >
        $ ccc
      </div>
    </AbsoluteFill>
  );
};
