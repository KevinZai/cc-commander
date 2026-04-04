import React from "react";
import { Series, AbsoluteFill } from "remotion";
import { Intro } from "./scenes/Intro";
import { Problem } from "./scenes/Problem";
import { Install } from "./scenes/Install";
import { Menu } from "./scenes/Menu";
import { Domains } from "./scenes/Domains";
import { Skills } from "./scenes/Skills";
import { Orchestrator } from "./scenes/Orchestrator";
import { Intelligence } from "./scenes/Intelligence";
import { DaemonMode } from "./scenes/DaemonMode";
import { CTA } from "./scenes/CTA";

// Scene durations in frames at 30fps
// Total: ~2310 frames = ~77 seconds
const SCENES = [
  { component: Intro, frames: 120 },        // 4s
  { component: Problem, frames: 120 },       // 4s
  { component: Install, frames: 90 },        // 3s
  { component: Menu, frames: 150 },          // 5s
  { component: Domains, frames: 150 },       // 5s
  { component: Skills, frames: 120 },        // 4s
  { component: Orchestrator, frames: 150 },  // 5s
  { component: Intelligence, frames: 150 },  // 5s
  { component: DaemonMode, frames: 120 },    // 4s
  { component: CTA, frames: 150 },           // 5s
] as const;

export const TOTAL_FRAMES = SCENES.reduce((sum, s) => sum + s.frames, 0);

const SceneTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>{children}</AbsoluteFill>
);

export const Hero: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0d1117" }}>
      <Series>
        {SCENES.map(({ component: SceneComponent, frames }, i) => (
          <Series.Sequence key={i} durationInFrames={frames}>
            <SceneTransition>
              <SceneComponent />
            </SceneTransition>
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
