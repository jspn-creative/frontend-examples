export class GlowEffectState {
  resetToDefaults() {
    this.speed = 0.3;
    this.flareIntensity1 = 5.0;
    this.flareIntensity2 = 5.0;
    this.flareIntensity3 = 5.0;
    this.flareIntensity4 = 5.0;
    this.flareColor = "#0ad2d2";
    this.tubeRadius = 10;
    this.color = "#009cff";
  }

  speed = $state(0);
  flareIntensity1 = $state(0);
  flareIntensity2 = $state(0);
  flareIntensity3 = $state(0);
  flareIntensity4 = $state(0);
  flareColor = $state("#ffd700");

  tubeRadius = $state(0);
  color = $state("#ffd700");

  getShaderUniforms() {
    return {
      speed: this.speed,
      flareIntensity1: this.flareIntensity1,
      flareIntensity2: this.flareIntensity2,
      flareIntensity3: this.flareIntensity3,
      flareIntensity4: this.flareIntensity4,
      flareColor: this.flareColor,
    };
  }

  getSceneProps() {
    return {
      ...this.getShaderUniforms(),
      tubeRadius: this.tubeRadius,
      color: this.color,
    };
  }

  getUIConfig() {
    return {
      folders: [
        {
          title: "Flare Controls",
          expanded: true,
          controls: [
            { type: "slider", key: "speed", label: "Speed", min: 0, max: 2, step: 0.01 },
            { type: "color", key: "flareColor", label: "Flare Color" },
          ],
        },
        {
          title: "Flare Intensities",
          expanded: false,
          controls: [
            { type: "slider", key: "flareIntensity1", label: "Intensity 1", min: 0, max: 5, step: 0.1 },
            { type: "slider", key: "flareIntensity2", label: "Intensity 2", min: 0, max: 5, step: 0.1 },
            { type: "slider", key: "flareIntensity3", label: "Intensity 3", min: 0, max: 5, step: 0.1 },
            { type: "slider", key: "flareIntensity4", label: "Intensity 4", min: 0, max: 5, step: 0.1 },
          ],
        },
        {
          title: "Tube",
          expanded: true,
          controls: [
            { type: "slider", key: "tubeRadius", label: "Tube Radius", min: 1, max: 50, step: 1 },
            { type: "color", key: "color", label: "Tube Color" },
          ],
        },
      ],
    };
  }

  constructor() {
    this.resetToDefaults();
  }
}
