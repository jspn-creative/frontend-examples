import { buttPanelState } from "../buttPanelState.svelte";

export class FireEffectState {
  resetToDefaults() {
    this.speed = 0.04;
    this.scale = 6;
    this.intensity = 1.0;
    this.offset = 0.01;
    this.baseColor = "#001200";
  }

  speed = $state(0);
  scale = $state(0);
  intensity = $state(0);
  offset = $state(0);
  baseColor = $state("#001200");
  color = $derived.by(() => {
    if (!buttPanelState.hasOverlay) return this.baseColor;
    switch (buttPanelState.overlay) {
      case 0: // Red Glow
        return "#451919";
      case 1: // Blue Glow
        return "#3B538D";
    }
  });

  getShaderUniforms() {
    return {
      speed: this.speed,
      scale: this.scale,
      intensity: this.intensity,
      offset: this.offset,
    };
  }

  getSceneProps() {
    return {
      ...this.getShaderUniforms(),
    };
  }

  getUIConfig() {
    return {
      folders: [
        {
          title: "Fire Controls",
          expanded: true,
          controls: [
            { type: "slider", key: "speed", label: "Speed", min: 0, max: 2, step: 0.01 },
            { type: "slider", key: "scale", label: "Scale", min: 1, max: 20, step: 0.1 },
            { type: "slider", key: "intensity", label: "Intensity", min: 1, max: 10, step: 0.1 },
            { type: "slider", key: "offset", label: "Offset", min: -0.5, max: 0.5, step: 0.01 },
            { type: "color", key: "color", label: "Effect Color" },
          ],
        },
      ],
    };
  }

  constructor() {
    this.resetToDefaults();
  }
}
