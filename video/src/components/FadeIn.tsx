import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface FadeInProps {
  children: React.ReactNode;
  startFrame?: number;
  durationFrames?: number;
  style?: React.CSSProperties;
  translateY?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  startFrame = 0,
  durationFrames = 20,
  style,
  translateY = 0,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame - startFrame,
    [0, durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const y = interpolate(
    frame - startFrame,
    [0, durationFrames],
    [translateY, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
