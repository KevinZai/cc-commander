import React from "react";
import { AbsoluteFill } from "remotion";

interface TerminalProps {
  children: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
}

export const Terminal: React.FC<TerminalProps> = ({
  children,
  title = "bash",
  style,
}) => {
  return (
    <div
      style={{
        background: "#0d1117",
        border: "1px solid #30363d",
        borderRadius: 8,
        overflow: "hidden",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        fontSize: 20,
        ...style,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          background: "#161b22",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderBottom: "1px solid #30363d",
        }}
      >
        <div
          style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }}
        />
        <div
          style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }}
        />
        <div
          style={{ width: 12, height: 12, borderRadius: "50%", background: "#28ca41" }}
        />
        <span
          style={{
            color: "#8b949e",
            fontSize: 14,
            marginLeft: 8,
            fontFamily: "inherit",
          }}
        >
          {title}
        </span>
      </div>
      {/* Content */}
      <div
        style={{
          padding: "24px 28px",
          lineHeight: 1.6,
          color: "#c9d1d9",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const TerminalLine: React.FC<{
  prompt?: boolean;
  color?: string;
  children: React.ReactNode;
}> = ({ prompt = false, color = "#c9d1d9", children }) => (
  <div style={{ color, marginBottom: 4 }}>
    {prompt && (
      <span style={{ color: "#50FF78", marginRight: 8 }}>$</span>
    )}
    {children}
  </div>
);
