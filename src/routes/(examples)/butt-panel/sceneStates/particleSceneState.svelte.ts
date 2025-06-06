export class ParticleSceneState {
  // Post processing settings
  bloomIntensity = $state(1.5);
  bloomThreshold = $state(0.15);
  bloomRadius = $state(0.4);
  exposure = $state(1);
  
  // Particle settings
  particleSize = $state(1.0);
  maxParticleSize = $state(2.0);
  particleSpread = $state(15);
  particleCount = $state(1500);
  tubeRadius = $state(20);
  
  // Get props for the scene component
  getSceneProps() {
    return {
      bloomIntensity: this.bloomIntensity,
      bloomThreshold: this.bloomThreshold,
      bloomRadius: this.bloomRadius,
      exposure: this.exposure,
      particleSize: this.particleSize,
      maxParticleSize: this.maxParticleSize,
      particleSpread: this.particleSpread,
      particleCount: this.particleCount,
      tubeRadius: this.tubeRadius,
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
          title: '3D Controls',
          expanded: false,
          controls: [
            { type: 'slider', key: 'tubeRadius', label: 'Tube Radius', min: 5, max: 50, step: 1 },
          ]
        },
        {
          title: 'Particle Controls',
          expanded: true,
          controls: [
            { type: 'slider', key: 'particleSize', label: 'Particle Size', min: 0.1, max: 5, step: 0.1 },
            { type: 'slider', key: 'maxParticleSize', label: 'Max Particle Size', min: 0.5, max: 10, step: 0.5 },
            { type: 'slider', key: 'particleSpread', label: 'Particle Spread', min: 5, max: 50, step: 1 },
            { type: 'slider', key: 'particleCount', label: 'Particle Count', min: 100, max: 5000, step: 100 },
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
    this.particleSize = 1.0;
    this.maxParticleSize = 2.0;
    this.particleSpread = 15;
    this.particleCount = 1500;
    this.tubeRadius = 20;
  }
}