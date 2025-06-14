import { ToneMappingMode } from "postprocessing";
import { buttPanelState } from "../buttPanelState.svelte";
import type { ListOptionsObjectArray } from "svelte-tweakpane-ui";

export class ParticleTubeState {
  resetToDefaults() {
    this.bloomIntensity = 1.3;
    this.bloomThreshold = 0.15;
    this.bloomRadius = 0.9;
    this.particleSize = 0.3;
    this.maxParticleSize = 0.6;
    this.particleExposure = 2;
    this.particleSpread = 24;
    this.particleCount = 10000;
    this.particleSpeed = 0.7;
    this.tubeRadius = 10;
    this.enableMotion = true;
    this.baseColor = "#009cff";
    this.toneMappingPreset = "ACES_FILMIC";
  }

  // Post processing settings
  bloomIntensity = $state(0);
  bloomThreshold = $state(0);
  bloomRadius = $state(0);
  particleExposure = $state(0);
  toneMappingPreset = $state("");

  // Particle settings
  particleSize = $state(0);
  maxParticleSize = $state(0);
  particleSpread = $state(0);
  particleCount = $state(0);
  particleSpeed = $state(0);
  tubeRadius = $state(0);
  enableMotion = $state(true);
  baseColor = $state("#009cff");
  color = $derived.by(() => {
    if (!buttPanelState.hasOverlay) return this.baseColor;
    switch (buttPanelState.overlay) {
      case 0: // Red Glow
        return "#f50b0b";
      case 1: // Blue Glow
        return "#003aff";
    }
  });

  getShaderUniforms() {
    return {
      bloomIntensity: this.bloomIntensity,
      bloomThreshold: this.bloomThreshold,
      bloomRadius: this.bloomRadius,
      particleExposure: this.particleExposure,
      particleSize: this.particleSize,
      maxParticleSize: this.maxParticleSize,
      particleSpread: this.particleSpread,
      particleCount: this.particleCount,
      particleSpeed: this.particleSpeed,
      tubeRadius: this.tubeRadius,
      enableMotion: this.enableMotion,
      color: this.color,
      toneMappingPreset: this.toneMappingPreset,
    };
  }

  getSceneProps() {
    return this.getShaderUniforms();
  }

  getUIConfig() {
    return {
      folders: [
        {
          title: "Main Settings",
          expanded: true,
          controls: [
            { type: "slider", key: "tubeRadius", label: "Tube Radius", min: 1, max: 50, step: 1 },
            { type: "color", key: "color", label: "Effect Color" },
          ],
        },
        {
          title: "Particle Controls",
          expanded: false,
          controls: [
            { type: "checkbox", key: "enableMotion", label: "Enable Motion" },
            { type: "slider", key: "particleSpeed", label: "Speed", min: 0.1, max: 5, step: 0.1 },
            { type: "slider", key: "particleSize", label: "Size", min: 0.001, max: 2.5, step: 0.001 },
            { type: "slider", key: "maxParticleSize", label: "Max Size", min: 0.01, max: 1.5, step: 0.1 },
            { type: "slider", key: "particleExposure", label: "Exposure", min: 0, max: 5, step: 0.1 },
            { type: "slider", key: "particleSpread", label: "Spread", min: 5, max: 50, step: 1 },
            { type: "slider", key: "particleCount", label: "Count", min: 1000, max: 50000, step: 1000 },
          ],
        },
        {
          title: "Post Processing",
          expanded: false,
          controls: [
            { type: "slider", key: "bloomIntensity", label: "Bloom Intensity", min: 0, max: 3, step: 0.1 },
            { type: "slider", key: "bloomThreshold", label: "Bloom Threshold", min: 0, max: 1, step: 0.01 },
            { type: "slider", key: "bloomRadius", label: "Bloom Radius", min: 0, max: 1, step: 0.01 },
            {
              type: "list",
              key: "toneMappingPreset",
              label: "Tone Mapping",
              options: [
                { value: "ACES_FILMIC", text: "ACES Filmic" },
                { value: "CINEON", text: "Cineon" },
                { value: "OPTIMIZED_CINEON", text: "Optimized Cineon" },
                { value: "REINHARD2_ADAPTIVE", text: "Reinhard2 Adaptive" },
                { value: "UNCHARTED2", text: "Uncharted2" },
                { value: "NEUTRAL", text: "Neutral" },
                { value: "AGX", text: "AGX" },
                { value: "LINEAR", text: "Linear" },
                { value: "REINHARD", text: "Reinhard" },
                { value: "REINHARD2", text: "Reinhard2" },
              ] as ListOptionsObjectArray<string>,
            },
          ],
        },
      ],
    };
  }

  getToneMappingMode(preset: string): number {
    const modes: { [key: string]: number } = {
      LINEAR: ToneMappingMode.LINEAR,
      REINHARD: ToneMappingMode.REINHARD,
      REINHARD2: ToneMappingMode.REINHARD2,
      REINHARD2_ADAPTIVE: ToneMappingMode.REINHARD2_ADAPTIVE,
      UNCHARTED2: ToneMappingMode.UNCHARTED2,
      CINEON: ToneMappingMode.CINEON,
      ACES_FILMIC: ToneMappingMode.ACES_FILMIC,
      AGX: ToneMappingMode.AGX,
      OPTIMIZED_CINEON: ToneMappingMode.OPTIMIZED_CINEON,
      NEUTRAL: ToneMappingMode.NEUTRAL,
    };
    return modes[preset] || ToneMappingMode.CINEON;
  }

  constructor() {
    this.resetToDefaults();
  }
}
