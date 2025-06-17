const colorPresets = {
  monochrome: {
    glow: [0.05, 0.05, 0.05],
    ring1: [0.9, 0.9, 0.9],
    ring2: [0.6, 0.6, 0.6],
    ring3: [0.75, 0.75, 0.75],
    ring4: [0.4, 0.4, 0.4],
  },
  teal: {
    glow: [34 / 255, 30 / 255, 38 / 255],
    ring1: [10 / 255, 205 / 255, 203 / 255],
    ring2: [46 / 255, 72 / 255, 82 / 255],
    ring3: [54 / 255, 147 / 255, 147 / 255],
    ring4: [30 / 255, 100 / 255, 120 / 255],
  },
  sunset: {
    glow: [15 / 255, 15 / 255, 30 / 255],
    ring1: [255 / 255, 180 / 255, 80 / 255],
    ring2: [240 / 255, 90 / 255, 40 / 255],
    ring3: [180 / 255, 50 / 255, 120 / 255],
    ring4: [120 / 255, 30 / 255, 80 / 255],
  },
  ocean: {
    glow: [10 / 255, 20 / 255, 30 / 255],
    ring1: [60 / 255, 220 / 255, 250 / 255],
    ring2: [30 / 255, 90 / 255, 180 / 255],
    ring3: [20 / 255, 150 / 255, 200 / 255],
    ring4: [40 / 255, 120 / 255, 160 / 255],
  },
  magma: {
    glow: [200 / 255, 20 / 255, 10 / 255],
    ring1: [255 / 255, 180 / 255, 80 / 255],
    ring2: [240 / 255, 90 / 255, 40 / 255],
    ring3: [255 / 255, 180 / 255, 80 / 255],
    ring4: [220 / 255, 90 / 255, 40 / 255],
  },
  synthwave: {
    glow: [0.1, 0.05, 0.2],
    ring1: [1.0, 0.5, 0.0], // Orange inner
    ring2: [1.0, 0.0, 0.0], // Red
    ring3: [0.0, 0.0, 1.0], // Blue
    ring4: [0.5, 0.0, 1.0], // Purple
  },
  neoneaster: {
    glow: [5 / 255, 5 / 255, 15 / 255],
    ring1: [255 / 255, 50 / 255, 220 / 255], // pink
    ring2: [140 / 255, 240 / 255, 120 / 255], // green
    ring3: [0 / 255, 180 / 255, 255 / 255], // blue
    ring4: [220 / 255, 220 / 255, 90 / 255], //
  },
  retrowave: {
    glow: [20 / 255, 10 / 255, 40 / 255],
    ring1: [255 / 255, 60 / 255, 220 / 255],
    ring2: [120 / 255, 40 / 255, 180 / 255],
    ring3: [10 / 255, 230 / 255, 230 / 255],
    ring4: [180 / 255, 20 / 255, 200 / 255],
  },
};

export type ColorPreset = keyof typeof colorPresets;

export class InnerGlowEffectState {
  resetToDefaults() {
    this.intensity = 0.15;
    this.speed = 0.2;
    this.blur = 0.01;
    this.cornerRadius = 0.05;
    this.ambientRadius = 0.06;
    this.ambientIntensity = 1;
    this.ambientAlpha = 0.4;
    this.colorPreset = "sunset";
  }

  colorPreset = $state<ColorPreset>("sunset");
  intensity = $state(0);
  speed = $state(0);
  blur = $state(0);
  cornerRadius = $state(0);
  ambientRadius = $state(0);
  ambientIntensity = $state(0);
  ambientAlpha = $state(0);

  get currentColors() {
    const preset = colorPresets[this.colorPreset];
    return [preset.ring1, preset.ring2, preset.ring3, preset.ring4, preset.glow];
  }

  get ambientGlowColor() {
    const preset = colorPresets[this.colorPreset];
    return preset.glow;
  }

  updateFromPreset() {
    const preset = this.colorPreset;

    // if (preset === "monochrome") {
    //   this.intensity = 0.15;
    //   this.radius = 0.08;
    //   this.speed = 0.1;
    //   this.blur = 0.005;
    // } else if (preset === "neon") {
    //   this.intensity = 0.3;
    //   this.radius = 0.12;
    //   this.speed = 0.25;
    //   this.blur = 0.015;
    // } else if (preset === "retrowave") {
    //   this.intensity = 0.25;
    //   this.radius = 0.1;
    //   this.speed = 0.3;
    //   this.blur = 0.02;
    // } else {
    //   // Default values for other presets
    //   this.intensity = 0.2;
    //   this.radius = 0.1;
    //   this.speed = 0.2;
    //   this.blur = 0.01;
    // }
  }

  getShaderUniforms() {
    const colors = this.currentColors;
    return {
      intensity: this.intensity,
      speed: this.speed,
      blur: this.blur,
      cornerRadius: this.cornerRadius,
      color0: colors[0],
      color1: colors[1],
      color2: colors[2],
      color3: colors[3],
      color4: colors[4],
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
          controls: [{ type: "slider", key: "cornerRadius", label: "Corner Radius", min: 0.0, max: 0.2, step: 0.01 }],
        },
        {
          title: "Ambient Glow",
          expanded: true,
          controls: [
            { type: "slider", key: "ambientRadius", label: "Radius", min: 0.0, max: 0.2, step: 0.001 },
            { type: "slider", key: "ambientIntensity", label: "Intensity", min: 0.0, max: 10.0, step: 0.1 },
            { type: "slider", key: "ambientAlpha", label: "Alpha", min: 0.0, max: 5.0, step: 0.1 },
          ],
        },
        {
          title: "Animation",
          expanded: true,
          controls: [
            { type: "slider", key: "intensity", label: "Intensity", min: 0.0, max: 1.0, step: 0.01 },
            { type: "slider", key: "speed", label: "Speed", min: 0.0, max: 1.0, step: 0.01 },
            { type: "slider", key: "blur", label: "Blur", min: 0.001, max: 10, step: 0.001 },
            {
              type: "radiogrid",
              key: "colorPreset",
              label: "Color Preset",
              values: Object.keys(colorPresets) as ColorPreset[],
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
