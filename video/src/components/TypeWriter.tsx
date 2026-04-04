import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface TypeWriterProps {
  text: string;
  startFrame?: number;
  durationFrames?: number;
  color?: string;
  showCursor?: boolean;
  style?: React.CSSProperties;
}

export const TypeWriter: React.FC<TypeWriterProps> = ({
  text,
  startFrame = 0,
  durationFrames,
  color = "#c9d1d9",
  showCursor = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const duration = durationFrames ?? text.length * 2;

  const charsToShow = Math.floor(
    interpolate(
      frame - startFrame,
      [0, duration],
      [0, text.length],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    )
  );

  const cursorVisible =
    showCursor && Math.floor((frame - startFrame) / 15) % 2 === 0;

  return (
    <span style={{ color, ...style }}>
      {text.slice(0, charsToShow)}
      {cursorVisible && charsToShow <= text.length && (
        <span style={{ opacity: 1 }}>█</span>
      )}
    </span>
  );
};
