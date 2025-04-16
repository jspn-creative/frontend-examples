import type { Action } from "svelte/action";
import { dev } from "$app/environment";

const presets = {
  miniGrid: {
    lineSize: 10,
    lineLength: 0.07,
    lineWidth: 8,
    lineAlpha: 0.04,
    spotlightEnabled: false,
  },
  grid: {
    lineSize: 24,
    lineLength: 0.07,
    lineWidth: 8,
    lineAlpha: 0.04,
    spotlightEnabled: false,
  },
};
export type PointerBgParameters = {
  spotlightSize?: number;
  spotlightIntensity?: number;
  lineSize?: number;
  lineAlpha?: number;
  lineLength?: number;
  lineWidth?: number;
  lineSpeed?: number;
  threshold?: number;
  maskAngle?: number;
  stopOne?: number;
  stopTwo?: number;
  spotlightEnabled?: boolean;
  color?: string;
};

export const pointerBg: Action<HTMLElement, PointerBgParameters> = (node, params) => {
  const options = {
    spotlightSize: 300,
    spotlightIntensity: 0.75,
    lineSize: 24,
    lineAlpha: 0.15,
    lineLength: 0.2,
    lineWidth: 2,
    lineSpeed: 5,
    threshold: 0.01,
    maskAngle: 180,
    stopOne: 50,
    stopTwo: 100,
    spotlightEnabled: true,
    color: "currentColor",
    ...params,
  };

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let cells: Array<{ x: number; y: number; a: number; t: number }> = [];
  let mx = 0;
  let my = 0;
  let animationFrame: number;
  let sizeObserver: ResizeObserver;
  let targetX = 0;
  let targetY = 0;
  let pane: any = null;
  let resolvedColor = "currentColor";

  const container = document.createElement("div");
  container.className = "pointer-bg-container";
  container.setAttribute("data-spotlight", options.spotlightEnabled ? "true" : "false");

  const spotlightWrapper = document.createElement("div");
  spotlightWrapper.className = "mask-spotlight";

  canvas = document.createElement("canvas");
  canvas.className = "w-full h-full";

  const styleElement = document.createElement("style");
  styleElement.textContent = `
    .pointer-bg-container {
      position: absolute;
      inset: 0;
      z-index: -1;
    }
    [data-spotlight="true"] .mask-spotlight {
      width: 100%;
      height: 100%;
      --size: calc(var(--mask-size, 100) * 1px);
      mask: radial-gradient(
        var(--size) var(--size) at calc(var(--mx, 0) * 1px) calc(var(--my, 0) * 1px),
        hsl(0 0% 100%),
        hsl(0 0% 100% / var(--spotlightIntensity, 0.2)) 80%
      );
    }
    canvas {
      width: 100%;
      height: 100%;
      mask: linear-gradient(
        calc(var(--mask-angle, 90) * 1deg),
        #fff calc(var(--mask-s1, 100) * 1%),
        #0000 calc(var(--mask-s2, 100) * 1%)
      );
    }
  `;

  spotlightWrapper.appendChild(canvas);
  container.appendChild(spotlightWrapper);
  node.appendChild(styleElement);
  node.appendChild(container);

  const nodeStyle = window.getComputedStyle(node);
  if (nodeStyle.position === "static") {
    node.style.position = "relative";
  }

  function initializeLines() {
    if (!canvas || !ctx) return;

    const DPR = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * DPR;
    canvas.height = height * DPR;
    ctx.scale(DPR, DPR);

    cells = [];
    for (let x = 0; x < width; x += options.lineSize) {
      for (let y = 0; y < height; y += options.lineSize) {
        cells.push({
          x: x + options.lineSize * 0.5,
          y: y + options.lineSize * 0.5,
          a: 0,
          t: 0,
        });
      }
    }

    targetX = width / 2;
    targetY = height / 2;
  }

  function getShortestRotation(current: number, target: number) {
    let diff = target - current;
    if (diff > Math.PI) diff -= 2 * Math.PI;
    if (diff < -Math.PI) diff += 2 * Math.PI;
    return diff;
  }

  function drawLines() {
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateLineAngles();

    cells.forEach((cell) => {
      ctx?.save();
      ctx?.translate(cell.x, cell.y);
      ctx?.rotate(cell.a);
      ctx?.beginPath();
      if (ctx) ctx.globalAlpha = options.lineAlpha;
      if (ctx) ctx.lineWidth = options.lineWidth;
      if (ctx) ctx.strokeStyle = resolvedColor;

      const actualLineSize = Math.min(cell.x, cell.y) * 0.2 * options.lineLength;

      ctx?.moveTo(-actualLineSize / 2, 0);
      ctx?.lineTo(actualLineSize / 2, 0);
      ctx?.stroke();
      ctx?.restore();
    });

    animationFrame = requestAnimationFrame(drawLines);
  }

  function updateLineAngles() {
    if (!canvas) return;

    const { left, top } = canvas.getBoundingClientRect();

    cells.forEach((cell) => {
      const dx = targetX - (cell.x + left);
      const dy = targetY - (cell.y + top);
      const newAngle = Math.atan2(dy, dx);
      const diff = getShortestRotation(cell.a, newAngle);

      if (Math.abs(diff) > options.threshold) {
        const speedFactor = Math.log(options.lineSpeed + 1) * 0.025;
        cell.a += diff * speedFactor;
        cell.a = ((cell.a + Math.PI) % (2 * Math.PI)) - Math.PI;
      } else {
        cell.a = newAngle;
      }
      cell.t = newAngle;
    });
  }

  function handlePointerMove(event: PointerEvent) {
    if (!container || !canvas) return;

    const { left, top } = canvas.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    mx = Math.floor(x - left);
    my = Math.floor(y - top);
    targetX = x;
    targetY = y;

    container.style.setProperty("--mx", mx.toString());
    container.style.setProperty("--my", my.toString());
  }

  function updateContainerProperties() {
    if (container) {
      container.style.setProperty("--spotlightIntensity", (1 - options.spotlightIntensity).toString());
      container.style.setProperty("--mask-size", options.spotlightSize.toString());
      container.style.setProperty("--mask-s1", options.stopOne.toString());
      container.style.setProperty("--mask-s2", options.stopTwo.toString());
      container.style.setProperty("--mask-angle", options.maskAngle.toString());
      container.style.setProperty("--color", options.color);
      container.dataset.spotlight = options.spotlightEnabled ? "true" : "false";
    }
  }

  function setupTweakPane() {
    if (!dev) return;

    import("tweakpane")
      .then(({ Pane }) => {
        const config = { ...options };

        pane = new Pane({
          title: "PointerBG Config",
          expanded: false,
        });

        // Create tabs instead of folders
        const tab = pane.addTab({
          pages: [{ title: "Lines" }, { title: "Masks" }],
        });

        // Lines tab (page 0)
        tab.pages[0]
          .addBinding(config, "lineSize", {
            min: 10,
            max: 100,
            step: 1,
            label: "lineSize",
          })
          .on("change", (event: any) => {
            options.lineSize = event.value;
            initializeLines();
          });

        tab.pages[0]
          .addBinding(config, "lineLength", {
            min: 0.01,
            max: 1,
            step: 0.01,
            label: "lineLength",
          })
          .on("change", (event: any) => {
            options.lineLength = event.value;
          });

        tab.pages[0]
          .addBinding(config, "lineWidth", {
            min: 1,
            max: 10,
            step: 1,
            label: "lineWidth",
          })
          .on("change", (event: any) => {
            options.lineWidth = event.value;
          });

        tab.pages[0]
          .addBinding(config, "lineAlpha", {
            min: 0.01,
            max: 1,
            step: 0.01,
            label: "lineAlpha",
          })
          .on("change", (event: any) => {
            options.lineAlpha = event.value;
          });

        tab.pages[0]
          .addBinding(config, "lineSpeed", {
            min: 1,
            max: 20,
            step: 1,
            label: "lineSpeed",
          })
          .on("change", (event: any) => {
            options.lineSpeed = event.value;
          });

        tab.pages[0]
          .addBinding(config, "color", {
            picker: "inline",
            expanded: true,
          })
          .on("change", (event: any) => {
            options.color = event.value;
            updateResolvedColor();
            updateContainerProperties();
          });

        tab.pages[0]
          .addBinding(config, "threshold", {
            min: 0.001,
            max: 0.1,
            step: 0.001,
            label: "threshold",
          })
          .on("change", (event: any) => {
            options.threshold = event.value;
          });

        // Masks tab (page 1)
        // Main Mask settings
        const mainFolder = tab.pages[1].addFolder({ title: "Main", expanded: true });

        mainFolder
          .addBinding(config, "stopOne", {
            label: "stopOne",
            min: 0,
            max: 100,
            step: 1,
          })
          .on("change", (event: any) => {
            options.stopOne = event.value;
            updateContainerProperties();
          });

        mainFolder
          .addBinding(config, "stopTwo", {
            label: "stopTwo",
            min: 0,
            max: 100,
            step: 1,
          })
          .on("change", (event: any) => {
            options.stopTwo = event.value;
            updateContainerProperties();
          });

        mainFolder
          .addBinding(config, "maskAngle", {
            label: "maskAngle",
            min: 0,
            max: 360,
            step: 45,
          })
          .on("change", (event: any) => {
            options.maskAngle = event.value;
            updateContainerProperties();
          });

        // Spotlight settings
        const spotFolder = tab.pages[1].addFolder({ title: "Spotlight", expanded: true });

        spotFolder
          .addBinding(config, "spotlightEnabled", {
            label: "spotlightEnabled",
          })
          .on("change", (event: any) => {
            options.spotlightEnabled = event.value;
            updateContainerProperties();
          });

        spotFolder
          .addBinding(config, "spotlightSize", {
            label: "spotlightSize",
            min: 10,
            max: 300,
            step: 1,
          })
          .on("change", (event: any) => {
            options.spotlightSize = event.value;
            updateContainerProperties();
          });

        spotFolder
          .addBinding(config, "spotlightIntensity", {
            label: "spotlightIntensity",
            min: 0.01,
            max: 1,
            step: 0.01,
          })
          .on("change", (event: any) => {
            options.spotlightIntensity = event.value;
            updateContainerProperties();
          });
      })
      .catch((err) => {
        console.error("Failed to load tweakpane:", err);
      });
  }

  function init() {
    if (!canvas) return;

    ctx = canvas.getContext("2d");
    if (!ctx) return;

    container.style.setProperty("--mx", "0");
    container.style.setProperty("--my", "0");
    updateContainerProperties();
    updateResolvedColor();

    initializeLines();
    animationFrame = requestAnimationFrame(drawLines);

    sizeObserver = new ResizeObserver(() => {
      initializeLines();
    });
    sizeObserver.observe(canvas);

    window.addEventListener("pointermove", handlePointerMove);

    // Setup tweakpane in development mode only
    setupTweakPane();
  }

  function destroy() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }

    if (sizeObserver) {
      sizeObserver.disconnect();
    }

    if (pane) {
      pane.dispose();
    }

    window.removeEventListener("pointermove", handlePointerMove);

    if (node.contains(container)) {
      node.removeChild(container);
    }
    if (node.contains(styleElement)) {
      node.removeChild(styleElement);
    }
  }

  // Function to resolve CSS variables to actual colors
  function resolveColor(color: string): string {
    if (!color || typeof color !== "string") return "currentColor";

    if (color.startsWith("var(--") || color === "currentColor") {
      const tempEl = document.createElement("div");
      tempEl.style.color = color;
      node.appendChild(tempEl);
      const computedColor = getComputedStyle(tempEl).color;
      node.removeChild(tempEl);
      return computedColor;
    }
    return color;
  }

  // Update the resolved color
  function updateResolvedColor() {
    resolvedColor = resolveColor(options.color);
  }

  init();

  return {
    update(newParams: PointerBgParameters) {
      const oldColor = options.color;
      Object.assign(options, newParams);
      updateContainerProperties();

      // Only resolve color if it changed
      if (oldColor !== options.color) {
        updateResolvedColor();
      }
    },
    destroy,
  };
};

export default pointerBg;
