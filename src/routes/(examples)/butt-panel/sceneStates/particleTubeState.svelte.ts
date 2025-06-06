export class ParticleTubeState {
  // Post processing settings
  bloomIntensity = $state(1.5);
  bloomThreshold = $state(0.15);
  bloomRadius = $state(0.4);
  exposure = $state(1);
  
  // Particle settings
  particleSize = $state(0.01);
  maxParticleSize = $state(0.02);
  particleSpread = $state(15);
  particleCount = $state(100);
  tubeRadius = $state(3);
  
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
            { type: 'slider', key: 'tubeRadius', label: 'Tube Radius', min: 1, max: 10, step: 0.1 },
          ]
        },
        {
          title: 'Particle Controls',
          expanded: false,
          controls: [
            { type: 'slider', key: 'particleSize', label: 'Particle Size', min: 0.001, max: 0.1, step: 0.001 },
            { type: 'slider', key: 'maxParticleSize', label: 'Max Particle Size', min: 0.01, max: 0.5, step: 0.01 },
            { type: 'slider', key: 'particleSpread', label: 'Particle Spread', min: 5, max: 50, step: 1 },
            { type: 'slider', key: 'particleCount', label: 'Particle Count', min: 50, max: 500, step: 10 },
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
    this.particleSize = 0.01;
    this.maxParticleSize = 0.02;
    this.particleSpread = 15;
    this.particleCount = 100;
    this.tubeRadius = 3;
  }
}