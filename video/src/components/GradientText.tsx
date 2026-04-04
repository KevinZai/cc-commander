import React from "react";

interface GradientTextProps {
  children: React.ReactNode;
  from?: string;
  to?: string;
  style?: React.CSSProperties;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  from = "#50FF78",
  to = "#00C8FF",
  style,
}) => (
  <span
    style={{
      background: `linear-gradient(90deg, ${from}, ${to})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      ...style,
    }}
  >
    {children}
  </span>
);
