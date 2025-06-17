import { ParticleTubeState, GlowEffectState, FireEffectState, GlitchEffectState, RainbowEffectState, InnerGlowEffectState } from "./sceneStates";
import type { ListOptions } from "svelte-tweakpane-ui";

const defaultScene = 5;

export const sceneOptions: ListOptions<number> = {
  "Particle Tube": 0,
  "Glow Effect": 1,
  "Fire Effect": 2,
  "Glitch Effect": 3,
  "Rainbow Effect": 4,
  "Inner Glow Effect": 5,
};

export const textureOptions: ListOptions<number> = {
  "Distressed Metal": 1,
  "Corroded Metal": 2,
  "Leathery Metal": 3,
  "Streaked Metal": 4,
  "Scuffed Metal": 5,
  "Grainy Metal": 6,
  "Scratched Metal": 7,
};

export const overlayOptions: ListOptions<number> = {
  "Red Glow": 0,
  "Blue Glow": 1,
};

const sceneStateFactories = {
  0: () => new ParticleTubeState(),
  1: () => new GlowEffectState(),
  2: () => new FireEffectState(),
  3: () => new GlitchEffectState(),
  4: () => new RainbowEffectState(),
  5: () => new InnerGlowEffectState(),
} as const;

export class ButtPanelState {
  resetToDefaults() {
    this.selectedScene = defaultScene;
    this.isActive = true;
    this.isTextured = true;
    this.showTest = false;
    this.debug = false;
    this.texture = 1;
    this.hasOverlay = false;
    this.overlay = 0;
    this._currentSceneState.resetToDefaults();
  }

  selectedScene = $state(defaultScene);
  isActive = $state(true);
  isTextured = $state(true);
  showTest = $state(false);
  debug = $state(false);
  texture = $state(1);
  hasOverlay = $state(false);
  overlay = $state(0);
  private _currentSceneState = $state<ReturnType<(typeof sceneStateFactories)[keyof typeof sceneStateFactories]>>(sceneStateFactories[this.selectedScene as keyof typeof sceneStateFactories]());
  glowColor = $derived.by(() => {
    if (!this.hasOverlay) return getSceneColor(this._currentSceneState);
    switch (this.overlay) {
      case 0: // Red Glow
        return "#451919";
      case 1: // Blue Glow
        return "#3B538D";
      default:
        return getSceneColor(this._currentSceneState);
    }
  });

  borderRect = $state({ x: 0, y: 0, width: 0, height: 0 });

  get currentSceneState() {
    return this._currentSceneState;
  }

  updateSelectedScene(newScene: number) {
    this.selectedScene = newScene;
    this._currentSceneState = sceneStateFactories[newScene as keyof typeof sceneStateFactories]();
  }

  toggleGlow = () => {
    this.isActive = !this.isActive;
  };

  updateBorderRect(rect: { x: number; y: number; width: number; height: number }) {
    this.borderRect = rect;
  }

  getSceneProps() {
    const sceneProps = getScenePropsSafe(this._currentSceneState);
    return {
      isActive: this.isActive,
      showTest: this.showTest,
      borderRect: this.borderRect,
      debug: this.debug,
      ...sceneProps,
    };
  }

  constructor() {
    this.resetToDefaults();
  }
}

export const buttPanelState = new ButtPanelState();

function getSceneColor(scene: any) {
  if (scene && typeof scene === "object" && "color" in scene) {
    return scene.color;
  }
  return "#fff";
}

function getScenePropsSafe(scene: any) {
  if (scene && typeof scene === "object" && typeof scene.getSceneProps === "function") {
    return scene.getSceneProps();
  }
  return {};
}
