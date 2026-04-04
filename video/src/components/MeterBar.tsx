import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface MeterBarProps {
  label: string;
  targetPct: number;
  color?: string;
  startFrame?: number;
  animDuration?: number;
  width?: number;
}

export const MeterBar: React.FC<MeterBarProps> = ({
  label,
  targetPct,
  color = "#50FF78",
  startFrame = 0,
  animDuration = 30,
  width = 400,
}) => {
  const frame = useCurrentFrame();

  const pct = interpolate(
    frame - startFrame,
    [0, animDuration],
    [0, targetPct],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const totalBlocks = 16;
  const filledBlocks = Math.round((pct / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 20,
        marginBottom: 12,
      }}
    >
      <span style={{ color: "#8b949e", width: 120, textAlign: "right" }}>
        {label}:
      </span>
      <span style={{ color }}>
        {"["}
        {"█".repeat(filledBlocks)}
        {"░".repeat(emptyBlocks)}
        {"]"}
      </span>
      <span style={{ color: "#c9d1d9", width: 40 }}>{Math.round(pct)}%</span>
    </div>
  );
};
