export const colorPresets = {
  red: [1.0, 0.2, 0.2] as const,
  orange: [1.0, 0.5, 0.2] as const,
  yellow: [1.0, 0.8, 0.1] as const,
  green: [0.2, 1.0, 0.4] as const,
  cyan: [0.0, 0.8, 1.0] as const,
  blue: [0.2, 0.4, 1.0] as const,
  purple: [0.8, 0.2, 1.0] as const,
  white: [1.0, 1.0, 1.0] as const,
  cycle: null as unknown as [number, number, number],
} as const;

export type ColorPreset = keyof typeof colorPresets;

class EclipseSceneState {
  resetToDefaults() {
    this.speed = 0.8;
    this.innerRadius = 100.0;
    this.outerRadius = 300.0;
    this.size = 350.0;
    this.flareIntensity1 = 1.5;
    this.flareIntensity2 = 1.5;
    this.flareIntensity3 = 1.5;
    this.flareIntensity4 = 1.5;
    this.colorPreset = "cycle";
    this.grainEnabled = true;
    this.grainAmount = 0.05;
    this.grainSize = 1.5;
    this.grainShadowBoost = 0.8;
    this.bwEnabled = false;
    this.bwContrast = 1.5;
    this.mouseProximityEnabled = true;
    this.mouseProximityStrength = 0.3;
  }

  speed = $state(0);
  innerRadius = $state(0);
  outerRadius = $state(0);
  size = $state(0);

  flareIntensity1 = $state(0);
  flareIntensity2 = $state(0);
  flareIntensity3 = $state(0);
  flareIntensity4 = $state(0);

  colorPreset = $state<ColorPreset>("cycle");
  flareColor = $state<[number, number, number]>([0, 0, 0]);

  grainEnabled = $state(true);
  grainAmount = $state(0);
  grainSize = $state(0);
  grainShadowBoost = $state(0);

  bwEnabled = $state(false);
  bwContrast = $state(0);

  mouseProximityEnabled = $state(true);
  mouseProximityStrength = $state(0);

  mousePosition = $state({ x: 0.5, y: 0.5 });
  mouseTarget = $state({ x: 0.5, y: 0.5 });
  mouseInside = $state(false);

  fps = $state(0);
  showFps = $state(true);

  showControls = $state(true);

  updateFlareColor() {
    if (this.colorPreset === "cycle") {
      const now = performance.now() / 7000;
      const keys = Object.keys(colorPresets).filter((k) => k !== "cycle") as ColorPreset[];
      const idx = Math.floor(now) % keys.length;
      const nextIdx = (idx + 1) % keys.length;
      const t = now % 1;
      const a = colorPresets[keys[idx]];
      const b = colorPresets[keys[nextIdx]];
      // Linear interpolation between colors
      this.flareColor = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    } else {
      this.flareColor = [...colorPresets[this.colorPreset]];
    }
  }

  updateMousePosition(targetX: number, targetY: number) {
    this.mouseTarget.x = targetX;
    this.mouseTarget.y = targetY;
    this.mouseInside = true;
  }

  resetMousePosition() {
    this.mouseTarget.x = 0.5;
    this.mouseTarget.y = 0.5;
    this.mouseInside = false;
  }

  interpolateMousePosition(smoothing = 0.1) {
    this.mousePosition.x += (this.mouseTarget.x - this.mousePosition.x) * smoothing;
    this.mousePosition.y += (this.mouseTarget.y - this.mousePosition.y) * smoothing;
  }

  getShaderUniforms() {
    return {
      speed: this.speed,
      innerRadius: this.innerRadius,
      outerRadius: this.outerRadius,
      size: this.size,
      flareIntensity1: this.flareIntensity1,
      flareIntensity2: this.flareIntensity2,
      flareIntensity3: this.flareIntensity3,
      flareIntensity4: this.flareIntensity4,
      flareColor: this.flareColor,
      grainEnabled: this.grainEnabled,
      grainAmount: this.grainAmount,
      grainSize: this.grainSize,
      grainShadowBoost: this.grainShadowBoost,
      bwEnabled: this.bwEnabled,
      bwContrast: this.bwContrast,
      mouseProximityEnabled: this.mouseProximityEnabled,
      mousePosition: [this.mousePosition.x, this.mousePosition.y] as [number, number],
      mouseProximityStrength: this.mouseProximityStrength,
    };
  }

  animateCycleColor() {
    if (this.colorPreset === "cycle") {
      this.updateFlareColor();
    }
  }

  constructor() {
    this.resetToDefaults();
  }
}

export const eclipseState = new EclipseSceneState();
