import type { ListOptionsObjectArray, ListOptions, ListOptionsArray, ListOptionsRecord } from "svelte-tweakpane-ui";

export type ColorPreset = "rainbow" | "red" | "blue" | "green" | "purple" | "orange" | "cyan";

interface ColorPhase {
  r: number;
  g: number;
  b: number;
}

interface ColorMask {
  r: number;
  g: number;
  b: number;
}

interface ColorPresetConfig {
  phase: ColorPhase;
  mask: ColorMask;
}

const COLOR_PRESETS: Record<ColorPreset, ColorPresetConfig> = {
  rainbow: {
    phase: { r: 0.0, g: 2.0, b: 4.0 },
    mask: { r: 1.0, g: 1.0, b: 1.0 },
  },
  red: {
    phase: { r: 0.0, g: 0.0, b: 0.0 },
    mask: { r: 1.0, g: 0.0, b: 0.0 },
  },
  blue: {
    phase: { r: 0.0, g: 0.0, b: 0.0 },
    mask: { r: 0.0, g: 0.0, b: 1.0 },
  },
  green: {
    phase: { r: 0.0, g: 0.0, b: 0.0 },
    mask: { r: 0.0, g: 1.0, b: 0.0 },
  },
  purple: {
    phase: { r: 0.0, g: 0.0, b: 0.5 },
    mask: { r: 1.0, g: 0.0, b: 1.0 },
  },
  orange: {
    phase: { r: 0.0, g: 0.5, b: 0.0 },
    mask: { r: 1.0, g: 0.5, b: 0.0 },
  },
  cyan: {
    phase: { r: 0.0, g: 0.0, b: 0.5 },
    mask: { r: 0.0, g: 1.0, b: 1.0 },
  },
};

export class RainbowEffectState {
  resetToDefaults() {
    this.cornerRadius = 0.11;
    this.animationSpeed = 2.0;
    this.colorIntensity = 0.005;
    this.brightness = 1.4;
    this.edgeThickness = 3.0;
    this.colorPreset = "rainbow";
    this.colorPhaseR = 0.0;
    this.colorPhaseG = 2.0;
    this.colorPhaseB = 4.0;
  }

  cornerRadius = $state(0);
  animationSpeed = $state(0);
  colorIntensity = $state(0);
  brightness = $state(0);
  edgeThickness = $state(0);
  colorPreset = $state<ColorPreset>("rainbow");
  colorPhaseR = $state(0);
  colorPhaseG = $state(0);
  colorPhaseB = $state(0);

  // Computed values based on preset
  get currentColorPhase(): ColorPhase {
    return COLOR_PRESETS[this.colorPreset].phase;
  }

  get currentColorMask(): ColorMask {
    return COLOR_PRESETS[this.colorPreset].mask;
  }

  // Update individual phase values when preset changes
  updateFromPreset() {
    const preset = COLOR_PRESETS[this.colorPreset];
    this.colorPhaseR = preset.phase.r;
    this.colorPhaseG = preset.phase.g;
    this.colorPhaseB = preset.phase.b;
  }

  getShaderUniforms() {
    const phase = this.currentColorPhase;
    const mask = this.currentColorMask;
    return {
      cornerRadius: this.cornerRadius,
      animationSpeed: this.animationSpeed,
      colorIntensity: this.colorIntensity,
      brightness: this.brightness,
      edgeThickness: this.edgeThickness,
      colorPhaseR: phase.r,
      colorPhaseG: phase.g,
      colorPhaseB: phase.b,
      colorMaskR: mask.r,
      colorMaskG: mask.g,
      colorMaskB: mask.b,
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
          title: "Shape",
          expanded: true,
          controls: [{ type: "slider", key: "cornerRadius", label: "Corner Radius", min: 0.0, max: 0.5, step: 0.01 }],
        },
        {
          title: "Animation",
          expanded: true,
          controls: [
            { type: "slider", key: "animationSpeed", label: "Animation Speed", min: 0.0, max: 5.0, step: 0.1 },
            { type: "slider", key: "colorIntensity", label: "Color Intensity", min: 0.001, max: 0.02, step: 0.001 },
            { type: "slider", key: "brightness", label: "Brightness", min: 0.1, max: 3.0, step: 0.1 },
            { type: "slider", key: "edgeThickness", label: "Edge Thickness", min: 0.1, max: 5.0, step: 0.1 },
            {
              type: "list",
              key: "colorPreset",
              label: "Color Preset",
              options: [
                { text: "Rainbow", value: "rainbow" },
                { text: "Red", value: "red" },
                { text: "Blue", value: "blue" },
                { text: "Green", value: "green" },
                { text: "Purple", value: "purple" },
                { text: "Orange", value: "orange" },
                { text: "Cyan", value: "cyan" },
              ] as ListOptionsObjectArray<ColorPreset>,
            },
          ],
        },
      ],
    };
  }

  constructor() {
    this.resetToDefaults();
  }
}
