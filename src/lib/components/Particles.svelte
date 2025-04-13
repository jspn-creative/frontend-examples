<script lang="ts">
  import { onMount } from "svelte";

  export let className: string = "";
  export let quantity: number = 100;
  export let staticity: number = 50;
  export let ease: number = 50;
  export let size: number = 0.4;
  export let color: string = "#ffffff";
  export let vx: number = 0;
  export let vy: number = 0;

  let canvasRef: HTMLCanvasElement;
  let canvasContainerRef: HTMLDivElement;
  let context: CanvasRenderingContext2D | null = null;
  let circles: any[] = [];
  let mouse = { x: 0, y: 0 };
  let canvasSize = { w: 0, h: 0 };
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  function parseColor(color: string): number[] {
    // Check if the color is actually a hex/rgb/oklch value already
    if (color.startsWith("#") || color.startsWith("rgb") || color.startsWith("oklch")) {
      // Direct color values
      if (color.startsWith("#")) return hexToRgb(color);
      if (color.startsWith("rgb")) return parseRgb(color);
      if (color.startsWith("oklch")) return oklchToRgb(color);
    }

    // Handle CSS variables
    let cssVar = color;
    if (!cssVar.startsWith("--")) {
      cssVar = `--${cssVar}`;
    }

    const rgbValues = cssVarToRgb(cssVar);
    return rgbValues;
  }

  function cssVarToRgb(cssVar: string): number[] {
    // Check if we're in a browser environment
    const isBrowser = typeof window !== "undefined" && typeof document !== "undefined" && document.documentElement !== undefined;

    if (!isBrowser) {
      return [255, 255, 255];
    }

    try {
      // Get the computed value of the CSS variable
      const computedValue = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();

      if (!computedValue) {
        return [255, 255, 255];
      }

      // If the variable exists, parse it based on its format
      if (computedValue.startsWith("#")) {
        return hexToRgb(computedValue);
      } else if (computedValue.startsWith("oklch")) {
        return oklchToRgb(computedValue);
      } else if (computedValue.startsWith("rgb")) {
        return parseRgb(computedValue);
      } else {
        // Try again with # prefix in case it's a hex without the #
        if (/^[0-9A-Fa-f]{3,8}$/.test(computedValue)) {
          return hexToRgb(`#${computedValue}`);
        }

        return [255, 255, 255];
      }
    } catch (e) {
      // Fallback if any errors
      return [255, 255, 255];
    }
  }

  function parseRgb(rgb: string): number[] {
    // Extract numbers from rgb/rgba string
    const matches = rgb.match(/\d+/g);
    if (matches && matches.length >= 3) {
      // Make sure values are within the valid 0-255 range
      return [Math.min(255, Math.max(0, parseInt(matches[0]))), Math.min(255, Math.max(0, parseInt(matches[1]))), Math.min(255, Math.max(0, parseInt(matches[2])))];
    }
    return [255, 255, 255]; // Default to white
  }

  function oklchToRgb(oklch: string): number[] {
    // Create a temporary div element to use the browser's color parsing
    if (typeof document !== "undefined") {
      try {
        // Method 1: Canvas API for color conversion
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        if (ctx) {
          // Draw a pixel with the color
          ctx.fillStyle = oklch;
          ctx.fillRect(0, 0, 1, 1);

          // Read the pixel data back
          try {
            const pixelData = ctx.getImageData(0, 0, 1, 1).data;
            const values = [pixelData[0], pixelData[1], pixelData[2]];
            return values;
          } catch (e) {
            // Try method 2 if getImageData fails (might happen with CORS issues)
          }
        }
      } catch (e) {}

      try {
        // Method 2: DOM-based approach
        const temp = document.createElement("div");
        temp.style.color = oklch;
        temp.style.display = "none";
        document.body.appendChild(temp);

        const computedStyle = window.getComputedStyle(temp);
        const color = computedStyle.color;
        document.body.removeChild(temp);

        if (color && color !== "rgb(0, 0, 0)" && color !== "#000000") {
          const values = parseRgb(color);
          return values;
        }
      } catch (e) {}
    }

    // Basic approximation for SSR or if browser methods fail
    try {
      const matches = oklch.match(/oklch\(\s*([^%\s]+)(?:\s*%\s*|\s+)([^%\s]+)(?:\s*%\s*|\s+)([^\/\s]+)/i);
      if (matches && matches.length >= 4) {
        // Convert OKLCH to approximate RGB using a more accurate method
        const l = parseFloat(matches[1]) / 100; // Lightness (0-1)
        const c = parseFloat(matches[2]); // Chroma
        const h = parseFloat(matches[3]); // Hue (degrees)

        // Better approximation using the hue
        let r, g, b;

        // Normalize hue to 0-360
        const hue = ((h % 360) + 360) % 360;

        // Simplified conversion that's more accurate than before
        if (hue < 60) {
          r = 255;
          g = (hue / 60) * 255;
          b = 0;
        } else if (hue < 120) {
          r = ((120 - hue) / 60) * 255;
          g = 255;
          b = 0;
        } else if (hue < 180) {
          r = 0;
          g = 255;
          b = ((hue - 120) / 60) * 255;
        } else if (hue < 240) {
          r = 0;
          g = ((240 - hue) / 60) * 255;
          b = 255;
        } else if (hue < 300) {
          r = ((hue - 240) / 60) * 255;
          g = 0;
          b = 255;
        } else {
          r = 255;
          g = 0;
          b = ((360 - hue) / 60) * 255;
        }

        // Apply lightness and chroma
        const factor = l * (1 + c * 0.3);
        const values = [Math.min(255, Math.max(0, Math.round(r * factor))), Math.min(255, Math.max(0, Math.round(g * factor))), Math.min(255, Math.max(0, Math.round(b * factor)))];

        return values;
      }
    } catch (e) {}

    return [255, 255, 255];
  }

  function hexToRgb(hex: string): number[] {
    hex = hex.replace("#", "");

    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }

    const hexInt = parseInt(hex, 16);
    const red = (hexInt >> 16) & 255;
    const green = (hexInt >> 8) & 255;
    const blue = hexInt & 255;
    return [red, green, blue];
  }

  // Track the last parsed color to avoid unnecessary redraws
  let lastColor = "";
  let rgb: number[] = [255, 255, 255];

  $: if (color !== lastColor) {
    lastColor = color;
    rgb = parseColor(color);

    // If we're already mounted, update particles
    if (canvasRef && context) {
      drawParticles();
    }
  }

  function circleParams() {
    const x = Math.floor(Math.random() * canvasSize.w);
    const y = Math.floor(Math.random() * canvasSize.h);
    const translateX = 0;
    const translateY = 0;
    const pSize = Math.floor(Math.random() * 2) + size;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.1;
    const dy = (Math.random() - 0.5) * 0.1;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  }

  function resizeCanvas() {
    if (canvasContainerRef && canvasRef && context) {
      circles.length = 0;
      canvasSize.w = canvasContainerRef.offsetWidth;
      canvasSize.h = canvasContainerRef.offsetHeight;
      canvasRef.width = canvasSize.w * dpr;
      canvasRef.height = canvasSize.h * dpr;
      canvasRef.style.width = `${canvasSize.w}px`;
      canvasRef.style.height = `${canvasSize.h}px`;
      context.scale(dpr, dpr);
    }
  }

  function clearContext() {
    if (context) {
      context.clearRect(0, 0, canvasSize.w, canvasSize.h);
    }
  }

  function drawCircle(
    circle: {
      x: number;
      y: number;
      translateX: number;
      translateY: number;
      size: number;
      alpha: number;
      targetAlpha: number;
      dx: number;
      dy: number;
      magnetism: number;
    },
    update = false
  ) {
    if (context) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.translate(translateX, translateY);
      context.beginPath();
      context.arc(x, y, size, 0, 2 * Math.PI);
      context.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
      context.fill();
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.push(circle);
      }
    }
  }

  function drawParticles() {
    clearContext();
    for (let i = 0; i < quantity; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  }

  function remapValue(value: number, start1: number, end1: number, start2: number, end2: number): number {
    let remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  }

  function animate() {
    clearContext();
    circles.forEach((circle, i) => {
      const edge = [circle.x + circle.translateX - circle.size, canvasSize.w - circle.x - circle.translateX - circle.size, circle.y + circle.translateY - circle.size, canvasSize.h - circle.y - circle.translateY - circle.size];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));
      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }
      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;
      circle.translateX += (mouse.x / (staticity / circle.magnetism) - circle.translateX) / ease;
      circle.translateY += (mouse.y / (staticity / circle.magnetism) - circle.translateY) / ease;

      drawCircle(circle, true);

      if (circle.x < -circle.size || circle.x > canvasSize.w + circle.size || circle.y < -circle.size || circle.y > canvasSize.h + circle.size) {
        circles.splice(i, 1);
        const newCircle = circleParams();
        drawCircle(newCircle);
      }
    });
    window.requestAnimationFrame(animate);
  }

  function onMouseMove(event: MouseEvent) {
    if (canvasRef) {
      let rect = canvasRef.getBoundingClientRect();
      let { w, h } = canvasSize;
      let x = event.clientX - rect.left - w / 2;
      let y = event.clientY - rect.top - h / 2;
      let inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.x = x;
        mouse.y = y;
      }
    }
  }

  onMount(() => {
    if (canvasRef) {
      context = canvasRef.getContext("2d");
      resizeCanvas();
      animate();
      window.addEventListener("resize", resizeCanvas);
      window.addEventListener("mousemove", onMouseMove);
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
    };
  });

  $: {
    if (canvasRef) {
      drawParticles();
      //   animate();
    }
  }
  //   Building Stage
</script>

<div class={className} bind:this={canvasContainerRef} aria-hidden="true">
  <canvas bind:this={canvasRef} class="size-full"></canvas>
</div>

<style>
  .size-full {
    width: 100%;
    height: 100%;
  }
</style>
