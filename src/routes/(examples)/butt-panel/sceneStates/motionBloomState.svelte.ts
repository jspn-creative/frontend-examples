export class MotionBloomState {
  // Motion bloom specific settings
  strength = $state(1.0);
  radius = $state(0.1);
  threshold = $state(0.5);
  resolution = $state({ x: 256, y: 256 });
  
  // Particle settings for motion bloom scene
  showParticles = $state(true);
  particleCount = $state(150);
  particleSize = $state(0.015);
  maxParticleSize = $state(0.03);
  particleSpread = $state(80);
  
  // Get props for the scene component
  getSceneProps() {
    return {
      strength: this.strength,
      radius: this.radius,
      threshold: this.threshold,
      resolution: this.resolution,
      showParticles: this.showParticles,
      particleCount: this.particleCount,
      particleSize: this.particleSize,
      maxParticleSize: this.maxParticleSize,
      particleSpread: this.particleSpread,
    };
  }
  
  // Get UI configuration for tweakpane
  getUIConfig() {
    return {
      folders: [
        {
          title: 'Motion Bloom',
          expanded: true,
          controls: [
            { type: 'slider', key: 'strength', label: 'Strength', min: 0, max: 3, step: 0.1 },
            { type: 'slider', key: 'radius', label: 'Radius', min: 0, max: 1, step: 0.01 },
            { type: 'slider', key: 'threshold', label: 'Threshold', min: 0, max: 1, step: 0.01 },
          ]
        },
        {
          title: 'Particle Controls',
          expanded: false,
          controls: [
            { type: 'checkbox', key: 'showParticles', label: 'Show Particles' },
            { type: 'slider', key: 'particleCount', label: 'Particle Count', min: 50, max: 500, step: 10 },
            { type: 'slider', key: 'particleSize', label: 'Particle Size', min: 0.005, max: 0.1, step: 0.005 },
            { type: 'slider', key: 'maxParticleSize', label: 'Max Particle Size', min: 0.01, max: 0.2, step: 0.01 },
            { type: 'slider', key: 'particleSpread', label: 'Particle Spread', min: 10, max: 150, step: 5 },
          ]
        }
      ]
    };
  }
  
  // Reset to defaults
  resetToDefaults() {
    this.strength = 1.0;
    this.radius = 0.1;
    this.threshold = 0.5;
    this.resolution = { x: 256, y: 256 };
    this.showParticles = true;
    this.particleCount = 150;
    this.particleSize = 0.015;
    this.maxParticleSize = 0.03;
    this.particleSpread = 80;
  }
}