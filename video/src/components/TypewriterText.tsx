import React from "react";
import { useCurrentFrame } from "remotion";

interface TypewriterTextProps {
  text: string;
  startFrame: number;
  color?: string;
  fontSize?: number;
  fontWeight?: string | number;
  showCursor?: boolean;
  charsPerFrame?: number;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame,
  color = "#e6edf3",
  fontSize = 48,
  fontWeight = "bold",
  showCursor = true,
  charsPerFrame = 0.8,
}) => {
  const frame = useCurrentFrame();
  const elapsed = frame - startFrame;

  if (elapsed < 0) return null;

  const charsToShow = Math.min(text.length, Math.floor(elapsed * charsPerFrame));
  const displayText = text.slice(0, charsToShow);
  const isTyping = charsToShow < text.length;
  const cursorVisible = showCursor && (isTyping || Math.floor(frame / 15) % 2 === 0);

  return (
    <span
      style={{
        color,
        fontSize,
        fontWeight,
        fontFamily: '"SF Mono", "Fira Code", "Courier New", monospace',
      }}
    >
      {displayText}
      {cursorVisible && (
        <span style={{ color: "#ff6600" }}>█</span>
      )}
    </span>
  );
};
