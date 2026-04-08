import React from "react";
import { Series, AbsoluteFill } from "remotion";
import { Intro } from "./scenes/Intro";
import { Problem } from "./scenes/Problem";
import { Menu } from "./scenes/Menu";
import { Skills } from "./scenes/Skills";
import { Install } from "./scenes/Install";
import { CTA } from "./scenes/CTA";

// 6-scene premium product launch video
// Total: 1320 frames = 44 seconds at 30fps
const SCENES = [
  { component: Intro, frames: 180 },    // Scene 1: Title Card          6s
  { component: Problem, frames: 180 },  // Scene 2: Problem → Solution  6s
  { component: Menu, frames: 300 },     // Scene 3: Terminal Demo       10s
  { component: Skills, frames: 240 },   // Scene 4: Stats Grid          8s
  { component: Install, frames: 240 },  // Scene 5: Install CTA         8s
  { component: CTA, frames: 180 },      // Scene 6: End Card            6s
] as const;

export const TOTAL_FRAMES = SCENES.reduce((sum, s) => sum + s.frames, 0); // 1320

export const Hero: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0d1117" }}>
      <Series>
        {SCENES.map(({ component: SceneComponent, frames }, i) => (
          <Series.Sequence key={i} durationInFrames={frames}>
            <AbsoluteFill>
              <SceneComponent />
            </AbsoluteFill>
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
