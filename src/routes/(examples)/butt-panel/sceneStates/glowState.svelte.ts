export class GlowState {
  // Post processing settings
  bloomIntensity = $state(1.5);
  bloomThreshold = $state(0.15);
  bloomRadius = $state(0.4);
  exposure = $state(1);
  
  // Glow specific settings
  glowWidth = $state(50);
  flareIntensity = $state(1.0);
  speed = $state(1.0);
  
  // Get props for the scene component
  getSceneProps() {
    return {
      bloomIntensity: this.bloomIntensity,
      bloomThreshold: this.bloomThreshold,
      bloomRadius: this.bloomRadius,
      exposure: this.exposure,
      glowWidth: this.glowWidth,
      flareIntensity: this.flareIntensity,
      speed: this.speed,
    };
  }
  
  // Get UI configuration for tweakpane
  getUIConfig() {
    return {
      folders: [
        {
          title: 'Post Processing',
          expanded: false,
          controls: [
            { type: 'slider', key: 'bloomIntensity', label: 'Bloom Intensity', min: 0, max: 3, step: 0.1 },
            { type: 'slider', key: 'bloomThreshold', label: 'Bloom Threshold', min: 0, max: 1, step: 0.01 },
            { type: 'slider', key: 'bloomRadius', label: 'Bloom Radius', min: 0, max: 1, step: 0.01 },
            { type: 'slider', key: 'exposure', label: 'Exposure', min: 0.1, max: 2, step: 0.1 },
          ]
        },
        {
          title: 'Glow Effects',
          expanded: true,
          controls: [
            { type: 'slider', key: 'glowWidth', label: 'Glow Width', min: 10, max: 200, step: 5 },
            { type: 'slider', key: 'flareIntensity', label: 'Flare Intensity', min: 0, max: 3, step: 0.1 },
            { type: 'slider', key: 'speed', label: 'Animation Speed', min: 0.1, max: 3, step: 0.1 },
          ]
        }
      ]
    };
  }
  
  // Reset to defaults
  resetToDefaults() {
    this.bloomIntensity = 1.5;
    this.bloomThreshold = 0.15;
    this.bloomRadius = 0.4;
    this.exposure = 1;
    this.glowWidth = 50;
    this.flareIntensity = 1.0;
    this.speed = 1.0;
  }
}