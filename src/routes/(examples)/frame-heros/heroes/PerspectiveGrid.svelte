<script lang="ts">
  import Particles from "$lib/components/Particles.svelte";

  let mouseX = $state(0);
  let mouseY = $state(0);
  let hovering = $state(false);

  // Scale factor to account for the perspective skew effect
  // This is much simpler than trying to compute the exact inverse transformation
  const SCALE_X = 1.2;
  const SCALE_Y = 1.1;
  const BASE_OFFSET_X = 0; // Base horizontal offset
  const Y_FACTOR = -0.3; // How much to increase offset as Y increases

  // Maximum distance for glow effect
  const GLOW_RADIUS = 650;

  // Controls the overall intensity of the glow effect (0-1)
  const GLOW_INTENSITY_SCALE = 0.47;

  // Grid aspect ratio compensation - account for the fact that grid cells are 200x50
  // This makes the effect appear more circular by scaling the Y component
  const ASPECT_RATIO_COMPENSATION = 3; // Ratio of cell width to height

  // How fast the effect follows the mouse (1 = instant, closer to 0 = slower)
  const FOLLOW_SPEED = 1;

  // Target position (for smooth following)
  let targetX = $state(0);
  let targetY = $state(0);

  // Actual position used for highlighting (smoothed)
  let effectX = $state(0);
  let effectY = $state(0);

  // Animation frame for smooth movement
  let animationFrame: number;

  // Generate unique base colors for each cell
  const cellColors = Array(20)
    .fill(0)
    .map(() =>
      Array(10)
        .fill(0)
        .map(() => {
          // Generate a random variation of green
          const hue = 140 + (Math.random() * 20 - 10); // Green hue with slight variations
          const saturation = 40 + Math.random() * 20;
          const lightness = 55 + Math.random() * 30;
          return `hsl(${hue}deg ${saturation}% ${lightness}%)`;
        })
    );

  function updatePosition() {
    // Smooth movement toward target position
    effectX = effectX + (targetX - effectX) * FOLLOW_SPEED;
    effectY = effectY + (targetY - effectY) * FOLLOW_SPEED;

    // Continue animation loop
    animationFrame = requestAnimationFrame(updatePosition);
  }

  // Start the animation loop
  $effect(() => {
    updatePosition();

    // Cleanup on component unmount
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  });

  function handleMouseMove(event: MouseEvent) {
    const svg = event.currentTarget as SVGElement;
    const rect = svg.getBoundingClientRect();

    // Get mouse position in SVG coordinates
    mouseX = (event.clientX - rect.left) * (1920 / rect.width);
    mouseY = (event.clientY - rect.top) * (1080 / rect.height);

    // Calculate dynamic offset based on Y position - more offset as Y increases
    const dynamicOffset = BASE_OFFSET_X + mouseY * Y_FACTOR;

    // Set target position with scaling to account for skew
    targetX = mouseX * SCALE_X - dynamicOffset;
    targetY = mouseY * SCALE_Y;

    hovering = true;
  }

  function handleMouseLeave() {
    hovering = false;
  }

  function calculateGlow(col: number, row: number): number {
    if (!hovering) return 0;

    // Calculate center position of this rectangle in grid space
    const rectX = col * 200 + 100; // center of rect
    const rectY = row * 50 + 25; // center of rect

    // Calculate distance from mouse to this rectangle
    // Scale the Y component to account for the grid's aspect ratio
    const dx = effectX - rectX;
    const dy = (effectY - rectY) * ASPECT_RATIO_COMPENSATION;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Calculate glow intensity based on distance (closer = more intense)
    if (distance > GLOW_RADIUS) return 0;

    // Normalized intensity from 0 to 1, with 1 being closest
    // Using a smoother easing function to make transitions less abrupt
    // Scale by the global intensity factor
    return Math.pow(1 - distance / GLOW_RADIUS, 1.5) * GLOW_INTENSITY_SCALE;
  }

  function getHighlightColor(baseColor: string, intensity: number): string {
    if (intensity <= 0.05) return baseColor;

    // Target highlight color - bright green
    const highlightColor = "hsl(140deg 85% 40%)";

    // Calculate percentage for color-mix
    const percent = Math.min(100, Math.round(intensity * 100));

    return `color-mix(in srgb, ${baseColor}, ${highlightColor} ${percent}%)`;
  }
</script>

<div class="h-full flex flex-col items-center justify-center relative overflow-hidden">
  <svg class="absolute inset-0 overflow-hidden z-0" width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" onmousemove={handleMouseMove} onmouseleave={handleMouseLeave}>
    <defs>
      <!-- Upper left radial gradient -->
      <radialGradient id="gradLeft" cx="15%" cy="-5%" r="30%">
        <stop offset="0%" style="stop-color:var(--color-green-400); stop-opacity:0.4" />
        <stop offset="100%" style="stop-color:white; stop-opacity:0" />
      </radialGradient>

      <!-- Middle right radial gradient -->
      <radialGradient id="gradRight" cx="80%" cy="20%" r="30%">
        <stop offset="0%" style="stop-color:var(--color-green-400); stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:white; stop-opacity:0" />
      </radialGradient>

      <!-- bottom left radial gradient -->
      <radialGradient id="gradBottom" cx="0%" cy="40%" r="30%">
        <stop offset="0%" style="stop-color:var(--color-green-400); stop-opacity:0.3" />
        <stop offset="100%" style="stop-color:white; stop-opacity:0" />
      </radialGradient>

      <!-- Glow filter for rectangles -->
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Background gradients -->
    <rect width="100%" height="100%" fill="url(#gradLeft)" />
    <rect width="100%" height="100%" fill="url(#gradRight)" />
    <rect width="100%" height="100%" fill="url(#gradBottom)" />

    <g transform="skewY(-5) skewX(-30)">
      <g id="grid">
        {#each Array(20) as _, row}
          {#each Array(10) as _, col}
            {@const glowIntensity = calculateGlow(col, row)}
            {@const baseOpacity = Math.pow(Math.random(), 1) * 0.08}
            {@const finalOpacity = baseOpacity + glowIntensity * 0.9}
            {@const baseColor = cellColors[row][col]}
            {@const mixedColor = getHighlightColor(baseColor, glowIntensity)}

            <rect x={col * 200} y={row * 50} width={200} height={50} class="transition-all duration-500 ease-out" fill={mixedColor} stroke="var(--color-white)" stroke-width={2 + glowIntensity * 3} stroke-opacity={0.5 + glowIntensity * 0.5} opacity={finalOpacity} filter={glowIntensity > 0.2 ? "url(#glow)" : ""} />
          {/each}
        {/each}
      </g>
    </g>

    <!-- White rectangles -->
    <rect class="animate-pulse" x="1240" y="225" width="400" height="100" fill="none" stroke="white" stroke-opacity="0.75" stroke-width="1.5" transform="skewY(-5) skewX(-30)" />
    <rect class="animate-pulse" x="1560" y="625" width="400" height="100" fill="none" stroke="white" stroke-opacity="0.75" stroke-width="1.5" transform="skewY(-5) skewX(-30)" />
    <rect class="animate-pulse" x="60" y="525" width="400" height="100" fill="none" stroke="white" stroke-opacity="0.75" stroke-width="1.5" transform="skewY(-5) skewX(-30)" />
  </svg>
  <Particles color="--color-white" size={1} quantity={200} className="absolute inset-0 pointer-events-none" />

  <div class="max-w-4xl flex flex-col gap-4 items-center justify-center px-6 relative z-10 pointer-events-none">
    <h1 class="text-center bg-gradient-to-br from-slate-900 to-green-700 bg-clip-text text-2xl sm:text-4xl/[1.1] font-bold tracking-tight text-transparent [text-wrap:balance] md:text-6xl/[1.1] drop-shadow-[0_0_2px_--alpha(var(--color-sky-100)/30%)]">Websites That Perform as Beautifully as They Look.</h1>

    <p class="text-center [text-wrap:balance] text-xs sm:text-sm md:text-lg/relaxed text-slate-800 font-medium">Specializing in custom web development where pixel-perfect design meets blazing-fast performance. Go beyond templates. Invest in quality.</p>
  </div>
</div>
