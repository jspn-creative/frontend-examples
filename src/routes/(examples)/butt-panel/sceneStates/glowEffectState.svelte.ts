export class GlowEffectState {
  resetToDefaults() {
    this.noiseSpeed = 0.9;
    this.highlightSpeed = 0.9;
    this.colorShiftSpeed = 0.9;
    this.highlightIntensity = 5.0;
    this.highlightColor = "#0ad2d2";
    this.tubeRadius = 3;
    this.color = "#009cff";
  }

  noiseSpeed = $state(0);
  highlightSpeed = $state(0);
  colorShiftSpeed = $state(0);
  highlightIntensity = $state(0);
  highlightColor = $state("#ffd700");

  tubeRadius = $state(0);
  color = $state("#ffd700");

  getShaderUniforms() {
    return {
      noiseAnimSpeed: this.noiseSpeed,
      highlightSpeed: this.highlightSpeed,
      colorShiftSpeed: this.colorShiftSpeed,
      highlightIntensity: this.highlightIntensity,
      highlightColor: this.highlightColor,
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
          title: "Animation Controls",
          expanded: true,
          controls: [
            { type: "slider", key: "noiseSpeed", label: "Noise Speed", min: 0, max: 10, step: 0.1 },
            { type: "slider", key: "highlightSpeed", label: "Highlight Speed", min: 0, max: 10, step: 0.1 },
            { type: "slider", key: "colorShiftSpeed", label: "Color Shift Speed", min: 0, max: 10, step: 0.1 },
            { type: "color", key: "highlightColor", label: "Highlight Color" },
            { type: "slider", key: "highlightIntensity", label: "Highlight Intensity", min: 0, max: 10, step: 0.1 },
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
