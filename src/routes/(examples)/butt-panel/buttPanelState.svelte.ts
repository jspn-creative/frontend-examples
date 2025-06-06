import { ParticleTubeState, MotionBloomState, GlowState, ParticleSceneState } from './sceneStates';
import type { ListOptions } from 'svelte-tweakpane-ui';

export const sceneOptions: ListOptions<number> = {
  "Particle Tube Test": 0,
  "Motion Bloom Test": 1,
  "Glow Effect": 2,
  "Particle Scene": 3,
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

// Scene state factory functions
const sceneStateFactories = {
  0: () => new ParticleTubeState(),
  1: () => new MotionBloomState(),
  2: () => new GlowState(),
  3: () => new ParticleSceneState(),
} as const;

export class ButtPanelState {
  // Global settings
  selectedScene = $state(2);
  isActive = $state(true);
  isTextured = $state(true);
  showTest = $state(false);
  texture = $state(1);
  glowColor = $state("#ff0000");
  
  // Border rect tracking
  borderRect = $state({ x: 0, y: 0, width: 0, height: 0 });
  
  // Current scene state instance
  private _currentSceneState = $state<ReturnType<typeof sceneStateFactories[keyof typeof sceneStateFactories]>>(
    sceneStateFactories[2]()
  );
  
  // Get current scene state
  get currentSceneState() {
    return this._currentSceneState;
  }
  
  // Update scene state when selected scene changes
  updateSelectedScene(newScene: number) {
    this.selectedScene = newScene;
    this._currentSceneState = sceneStateFactories[newScene as keyof typeof sceneStateFactories]();
  }
  
  // Toggle glow effect
  toggleGlow = () => {
    this.isActive = !this.isActive;
  }
  
  // Update border rect
  updateBorderRect(rect: { x: number; y: number; width: number; height: number }) {
    this.borderRect = rect;
  }
  
  // Get combined props for current scene
  getSceneProps() {
    return {
      // Global props
      isActive: this.isActive,
      showTest: this.showTest,
      glowColor: this.glowColor,
      borderRect: this.borderRect,
      // Scene-specific props
      ...this._currentSceneState.getSceneProps(),
    };
  }
  
  // Reset all settings
  resetAll() {
    // Reset global settings
    this.selectedScene = 2;
    this.isActive = true;
    this.isTextured = true;
    this.showTest = false;
    this.texture = 1;
    this.glowColor = "#ff0000";
    
    // Reset current scene state
    this._currentSceneState.resetToDefaults();
  }
}

// Create singleton instance
export const buttPanelState = new ButtPanelState();