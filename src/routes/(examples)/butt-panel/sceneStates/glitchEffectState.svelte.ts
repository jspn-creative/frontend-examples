export class GlitchEffectState {
  resetToDefaults() {
    this.delay = [0.2, 1.2];
    this.duration = [0.02, 1.5];
    this.strength = [0.1, 0.9];
    this.dtSize = 1;
    this.columns = 0.03;
    this.ratio = 0.85;
  }

  delay = $state([0, 1]);
  duration = $state([0, 1]);
  strength = $state([0, 1]);
  dtSize = $state(0);
  columns = $state(0);
  ratio = $state(0);

  getUIConfig() {
    return {
      folders: [
        {
          title: "Glitch Controls",
          expanded: true,
          controls: [
            { type: "intervalSlider", key: "delay", label: "Delay", min: 0, max: 5, step: 0.01 },
            { type: "intervalSlider", key: "duration", label: "Duration", min: 0, max: 5, step: 0.01 },
            { type: "intervalSlider", key: "strength", label: "Strength", min: 0, max: 1, step: 0.1 },
            { type: "slider", key: "dtSize", label: "DT Size", min: 0, max: 1, step: 0.01 },
            { type: "slider", key: "columns", label: "Columns", min: 0, max: 0.5, step: 0.01 },
            { type: "slider", key: "ratio", label: "Ratio", min: 0, max: 1, step: 0.01 },
          ],
        },
      ],
    };
  }

  constructor() {
    this.resetToDefaults();
  }
}
