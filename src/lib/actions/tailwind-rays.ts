type RayConfig = {
  height?: string;
  left?: string;
  top?: string;
  width?: string;
  bottom?: string;
  rotation?: number;
  animated?: boolean;
};

type LightSourceConfig = {
  height?: string;
  left?: string;
  top?: string;
  width?: string;
  bottom?: string;
  opacity: number;
};

type RayOptions = {
  minScale?: number;
  maxScale?: number;
  minOpacity?: number;
  maxOpacity?: number;
  minDurationMs?: number;
  maxDurationMs?: number;
  speedMultiplier?: number;
  centered?: boolean;
  color?: string;
  blendMode?: string;
  blur?: string;
  textMaskTarget?: HTMLElement | null;
  debugOverlayTarget?: HTMLElement | null;
  maskSoftness?: number;
  maskIntensity?: number;
};

const defaultOptions = {
  minScale: 0.6,
  maxScale: 1.0,
  minOpacity: 0.5,
  maxOpacity: 1.0,
  minDurationMs: 3000,
  maxDurationMs: 6000,
  speedMultiplier: 4.0,
  centered: false,
  color: "--color-neutral-100",
  blendMode: "normal",
  blur: "1rem",
  textMaskTarget: null as HTMLElement | null,
  debugOverlayTarget: null as HTMLElement | null,
  maskSoftness: 45,
  maskIntensity: 3.0,
};

const rayConfigs: RayConfig[] = [
  { height: "1865px", left: "calc(49.75% - 18px)", top: "-352px", width: "36px", rotation: 0, animated: true },
  { bottom: "147px", left: "calc(49.5% - 11px)", top: "-357px", width: "22px", rotation: 25, animated: true },
  { bottom: "-7px", left: "calc(49.5% - 12px)", top: "-354px", width: "24px", rotation: 11, animated: true },
  { bottom: "-128px", left: "calc(49.5833% - 12.5px)", top: "-350px", width: "25px", rotation: -12 },
  { bottom: "-920px", left: "calc(50% - 17.5px)", top: "-352px", width: "35px", rotation: -24 },
  { bottom: "-164px", left: "calc(49.4167% - 18.5px)", top: "-348px", width: "37px", rotation: -18, animated: true },
  { bottom: "-296px", left: "calc(49.8333% - 8px)", top: "-352px", width: "16px", rotation: -5, animated: true },
  { bottom: "-121px", left: "calc(49.75% - 5.5px)", top: "-352px", width: "11px", rotation: -3 },
  { bottom: "29px", left: "calc(49.75% - 7px)", top: "-354px", width: "14px", rotation: 18 },
  { bottom: "-121px", left: "calc(49.6667% - 7px)", top: "-353px", width: "14px", rotation: 6 },
];

const lightSourceConfigs: LightSourceConfig[] = [
  { bottom: "-46px", left: "calc(50% - 599px)", top: "-352px", width: "1198px", opacity: 0.3 },
  { height: "929px", left: "calc(50% - 432.5px)", top: "-252px", width: "865px", opacity: 0.46 },
  { height: "639px", left: "calc(50% - 389px)", top: "-393px", width: "778px", opacity: 0.72 },
];

function createRayElement(config: RayConfig, color: string): HTMLElement {
  const div = document.createElement("div");
  const classes = ["ray", "absolute", "z-[1]", "overflow-hidden", "[transform-origin:100%_0%_0px]"];

  if (config.animated) {
    classes.push("animated");
    div.style.willChange = "transform";
  }

  div.className = classes.join(" ");
  div.style.background = `radial-gradient(50% 50% at 50% 50%, ${color} 0%, transparent 100%)`;

  Object.entries(config).forEach(([key, value]) => {
    if (key === "rotation" && typeof value === "number") {
      div.style.transform = `rotate(${value}deg)`;
    } else if (key !== "animated" && typeof value === "string") {
      div.style[key as any] = value;
    }
  });

  return div;
}

function createLightSourceElement(config: LightSourceConfig, color: string): HTMLElement {
  const div = document.createElement("div");
  div.className = `light-source absolute z-[1] flex-none overflow-hidden [origin-x:1px] [origin-y:0]`;
  div.style.background = `radial-gradient(50% 50% at 50% 50%, ${color} 0%, transparent 100%)`;

  Object.entries(config).forEach(([key, value]) => {
    if (key === "opacity") {
      div.style.opacity = value.toString();
    } else {
      div.style[key as any] = value as string;
    }
  });

  return div;
}

export function rays(node: HTMLElement, options: RayOptions = {}) {
  const opts = { ...defaultOptions, ...options };
  let animatedRaysData: {
    element: HTMLElement;
    duration: number;
    phaseOffset: number;
    originalRotation: string;
    config: RayConfig;
    rayIndex: number;
  }[] = [];
  let allRayElements: HTMLElement[] = [];
  let animationFrame: number;
  let resizeObserver: ResizeObserver;

  // Set container styles with blend mode support
  const blendModeClass = opts.blendMode !== "normal" ? `mix-blend-${opts.blendMode}` : "";
  node.className = `flex-none h-[1200px] overflow-hidden absolute -top-[620px] min-w-screen w-[1200px] pointer-events-none ${blendModeClass} ${!opts.centered ? "-rotate-33 -left-80 [mask:radial-gradient(90%_50%_at_60%_50%,_rgb(0,_0,_0)_0%,_rgba(0,_0,_0,_1)_0%,_#ffffff00_100%)]" : "[mask:radial-gradient(50%_50%_at_40%_50%,_rgb(0,_0,_0)_0%,_rgba(0,_0,_0,_1)_0%,_#ffffff00_100%)]"}`;
  node.style.filter = `blur(${opts.blur})`;
  if (opts.blendMode !== "normal") {
    node.style.mixBlendMode = opts.blendMode;
  }

  // Store ray animation state for mask generation
  let rayAnimationState: { opacity: number; scale: number }[] = rayConfigs.map(() => ({
    opacity: 0.3,
    scale: opts.minScale,
  }));

  // Store calculated geometry for each ray relative to the text mask target
  let rayGeometries: { angle: number; offset: number; width: number }[] = [];

  function calculateRayGeometry() {
    if (!opts.textMaskTarget) return;

    const textRect = opts.textMaskTarget.getBoundingClientRect();
    const textCenter = {
      x: textRect.left + textRect.width / 2,
      y: textRect.top + textRect.height / 2,
    };

    // Container rotation (approximate based on CSS class)
    const containerRotation = opts.centered ? 0 : -33;

    rayGeometries = rayConfigs.map((config, index) => {
      const el = allRayElements[index];
      if (!el) return { angle: 0, offset: 0, width: 20 };

      const rect = el.getBoundingClientRect();
      const rayCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      const dx = rayCenter.x - textCenter.x;
      const dy = rayCenter.y - textCenter.y;

      const rayRotation = config.rotation || 0;
      const totalRotation = containerRotation + rayRotation;

      // Gradient angle is perpendicular to ray
      // CSS linear-gradient angle: 0deg = Up (0, -1). 90deg = Right (1, 0).
      const gradientAngle = totalRotation + 90;

      // Convert to radians for projection
      const rad = (gradientAngle * Math.PI) / 180;
      const gx = Math.sin(rad);
      const gy = -Math.cos(rad);

      // Project vector (dx, dy) onto gradient normal (gx, gy)
      // This gives the distance from text center to ray center along the gradient line
      const offset = dx * gx + dy * gy;

      const width = parseFloat(config.width || "20");

      return { angle: gradientAngle, offset, width };
    });

    // Force an update after calculation
    updateMask();
  }

  function generateMaskGradient(): string {
    if (rayGeometries.length === 0) return "none";

    const gradients = rayConfigs.map((config, index) => {
      const { opacity, scale } = rayAnimationState[index];
      const { angle, offset, width } = rayGeometries[index];

      // Ray width and scale affect the band thickness
      const baseBandWidth = Math.max(2, width / 2); // Half width for radius
      const bandRadius = baseBandWidth * scale;

      // Create soft gradient band centered at 50% + offset
      // We use calc() to combine percentage and pixels

      // Softer falloff for more realistic light blending
      // transparent -> white (opacity) -> transparent
      const softness = opts.maskSoftness ?? 20;
      const intensity = opts.maskIntensity ?? 1.0;
      const maskOpacity = Math.min(1, opacity * intensity);

      // Use a single smooth gradient from center to edge
      // The total width is determined by bandRadius (base size) + softness (blur/spread)
      const totalWidth = bandRadius + softness;

      return `linear-gradient(${angle}deg, transparent calc(50% + ${offset - totalWidth}px), rgba(255,255,255,${maskOpacity}) calc(50% + ${offset}px), transparent calc(50% + ${offset + totalWidth}px))`;
    });

    return gradients.join(", ");
  }

  function updateMask() {
    if (!opts.textMaskTarget && !opts.debugOverlayTarget) return;
    const maskValue = generateMaskGradient();

    // Update text mask - apply directly to target element
    if (opts.textMaskTarget) {
      opts.textMaskTarget.style.maskImage = maskValue;
      opts.textMaskTarget.style.webkitMaskImage = maskValue;
      // Ensure gradients are added together
      opts.textMaskTarget.style.maskComposite = "add";
      opts.textMaskTarget.style.setProperty("-webkit-mask-composite", "source-over");
    }

    // Update debug overlay - show the mask as a visible gradient
    if (opts.debugOverlayTarget) {
      // Convert the white-based mask gradient to a colored version for visibility
      const debugGradient = maskValue.replace(/rgba\(255,255,255,([^)]+)\)/g, "rgba(255,100,0,$1)");
      opts.debugOverlayTarget.style.background = debugGradient;
    }
  }

  function init() {
    // Clear any existing content
    node.innerHTML = "";
    animatedRaysData = [];
    allRayElements = [];
    rayAnimationState = rayConfigs.map(() => ({
      opacity: 0.3,
      scale: opts.minScale,
    }));

    // Create rays
    rayConfigs.forEach((config, index) => {
      const rayElement = createRayElement(config, opts.color);
      node.appendChild(rayElement);
      allRayElements.push(rayElement);

      if (config.animated) {
        const duration = Math.random() * (opts.maxDurationMs - opts.minDurationMs) + opts.minDurationMs;
        const phaseOffset = Math.random() * 2 * Math.PI;
        const rotation = config.rotation ? `rotate(${config.rotation}deg)` : "";

        animatedRaysData.push({
          element: rayElement,
          duration,
          phaseOffset,
          originalRotation: rotation,
          config,
          rayIndex: index,
        });
      }
    });

    // Create light sources
    lightSourceConfigs.forEach((config) => {
      const lightElement = createLightSourceElement(config, opts.color);
      node.appendChild(lightElement);
    });

    // Calculate initial geometry after a brief delay to ensure layout
    requestAnimationFrame(() => {
      calculateRayGeometry();
      updateMask();
    });

    // Setup resize observer
    resizeObserver = new ResizeObserver(() => {
      calculateRayGeometry();
    });
    if (opts.textMaskTarget) {
      resizeObserver.observe(opts.textMaskTarget);
      resizeObserver.observe(node); // Also observe the rays container
    }

    if (animatedRaysData.length > 0) {
      animationFrame = requestAnimationFrame(animateRays);
    }
  }

  function animateRays(timestamp: number) {
    animatedRaysData.forEach((rayData) => {
      const { element, duration, phaseOffset, originalRotation, rayIndex } = rayData;
      const cycleProgress = ((timestamp * opts.speedMultiplier) / duration + phaseOffset) % (2 * Math.PI);
      const progressFactor = (Math.sin(cycleProgress) + 1) / 2;

      const currentScale = opts.minScale + (opts.maxScale - opts.minScale) * progressFactor;
      const currentOpacity = opts.minOpacity + (opts.maxOpacity - opts.minOpacity) * progressFactor;

      // Update visible ray
      element.style.opacity = currentOpacity.toString();
      element.style.transform = `scale(${currentScale}) ${originalRotation}`;

      // Update ray animation state for mask (both opacity and scale)
      if (rayIndex !== undefined) {
        rayAnimationState[rayIndex] = {
          opacity: currentOpacity,
          scale: currentScale,
        };
      }
    });

    // Update the CSS mask
    updateMask();

    animationFrame = requestAnimationFrame(animateRays);
  }

  init();

  return {
    update(newOptions: RayOptions) {
      Object.assign(opts, { ...defaultOptions, ...newOptions });
      init();
    },
    destroy() {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      animatedRaysData = [];
      allRayElements = [];
      node.innerHTML = "";
    },
  };
}
