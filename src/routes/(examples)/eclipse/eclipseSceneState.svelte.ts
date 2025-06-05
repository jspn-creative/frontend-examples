
export const colorPresets = {
  default: [1.0, 0.5, 0.2] as const,
  blue: [0.2, 0.4, 1.0] as const,
  purple: [0.8, 0.2, 1.0] as const,
  green: [0.2, 1.0, 0.4] as const,
  red: [1.0, 0.2, 0.2] as const,
  gold: [1.0, 0.8, 0.1] as const,
  cyan: [0.0, 0.8, 1.0] as const,
  white: [1.0, 1.0, 1.0] as const,
} as const;

export type ColorPreset = keyof typeof colorPresets;

class EclipseSceneState {
  // Core shader parameters
  speed = $state(0.8);
  innerRadius = $state(200.0);
  outerRadius = $state(600.0);
  size = $state(800.0);
  
  // Flare intensities
  flareIntensity1 = $state(1.5);
  flareIntensity2 = $state(1.5);
  flareIntensity3 = $state(1.5);
  flareIntensity4 = $state(1.5);
  
  // Color settings
  colorPreset = $state<ColorPreset>('blue');
  flareColor = $state<[number, number, number]>([1.0, 0.5, 0.2]);
  
  // Film grain settings
  grainEnabled = $state(true);
  grainAmount = $state(0.05);
  grainSize = $state(1.5);
  grainShadowBoost = $state(0.8);
  
  // Black and white settings
  bwEnabled = $state(false);
  bwContrast = $state(1.2);
  
  // Mouse interaction settings
  mouseProximityEnabled = $state(true);
  mouseProximityStrength = $state(0.03);
  
  // Mouse position tracking
  mousePosition = $state({ x: 0.5, y: 0.5 });
  mouseTarget = $state({ x: 0.5, y: 0.5 });
  mouseInside = $state(false);
  
  // Performance tracking
  fps = $state(0);
  showFps = $state(true);
  
  // UI state
  showControls = $state(true);
  
  // Update flare color when preset changes
  updateFlareColor() {
    this.flareColor = [...colorPresets[this.colorPreset]];
  }
  
  // Update mouse position with smooth interpolation
  updateMousePosition(targetX: number, targetY: number) {
    this.mouseTarget.x = targetX;
    this.mouseTarget.y = targetY;
    this.mouseInside = true;
  }
  
  // Set mouse to center when leaving
  resetMousePosition() {
    this.mouseTarget.x = 0.5;
    this.mouseTarget.y = 0.5;
    this.mouseInside = false;
  }
  
  // Smooth mouse interpolation (call in animation loop)
  interpolateMousePosition(smoothing = 0.1) {
    this.mousePosition.x += (this.mouseTarget.x - this.mousePosition.x) * smoothing;
    this.mousePosition.y += (this.mouseTarget.y - this.mousePosition.y) * smoothing;
  }
  
  // Get shader uniforms object
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
  
  // Reset all parameters to defaults
  resetToDefaults() {
    this.speed = 0.8;
    this.innerRadius = 150.0;
    this.outerRadius = 400.0;
    this.size = 400.0;
    this.flareIntensity1 = 0.5;
    this.flareIntensity2 = 1.5;
    this.flareIntensity3 = 0.5;
    this.flareIntensity4 = 1.0;
    this.colorPreset = 'default';
    this.grainEnabled = true;
    this.grainAmount = 0.05;
    this.grainSize = 1.5;
    this.grainShadowBoost = 0.8;
    this.bwEnabled = false;
    this.bwContrast = 1.2;
    this.mouseProximityEnabled = true;
    this.mouseProximityStrength = 0.03;
  }
}

export const eclipseState = new EclipseSceneState(); 