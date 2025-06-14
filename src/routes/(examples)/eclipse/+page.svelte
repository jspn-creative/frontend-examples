<script lang="ts">
  import { Canvas } from "@threlte/core";
  import { Button, Checkbox, Pane, Folder, Slider, Color as TweakpaneColor, List, Point, Separator, Element } from "svelte-tweakpane-ui";
  import Scene from "./Scene.svelte";
  import { eclipseState, colorPresets, type ColorPreset } from "./eclipseSceneState.svelte";
  import { onMount } from "svelte";

  let customCursor: HTMLElement;
  let fpsDisplay: HTMLElement;
  let lastFrameTime = 0;
  let frameCount = 0;

  // Mouse tracking for custom cursor and shader interaction
  function handleMouseMove(event: MouseEvent) {
    // Update custom cursor position
    if (customCursor) {
      customCursor.style.left = `${event.clientX}px`;
      customCursor.style.top = `${event.clientY}px`;
    }

    // Update eclipse state for shader interaction
    eclipseState.updateMousePosition(event.clientX / window.innerWidth, 1.0 - event.clientY / window.innerHeight);
  }

  function handleMouseLeave() {
    eclipseState.resetMousePosition();
  }

  // FPS tracking
  function updateFPS() {
    frameCount++;
    const currentTime = performance.now();

    if (currentTime - lastFrameTime >= 1000) {
      eclipseState.fps = Math.round((frameCount * 1000) / (currentTime - lastFrameTime));
      frameCount = 0;
      lastFrameTime = currentTime;
    }

    requestAnimationFrame(updateFPS);
  }

  // Watch for color preset changes
  $effect(() => {
    // Access the colorPreset to make this effect reactive to it
    eclipseState.colorPreset;
    eclipseState.updateFlareColor();
  });

  onMount(() => {
    updateFPS();
  });
</script>

<svelte:window on:mousemove={handleMouseMove} on:mouseleave={handleMouseLeave} />

<!-- Main container with noise overlay -->
<div class="fixed inset-0 overflow-hidden cursor-none bg-[#111] tracking-tight">
  <!-- Film grain noise overlay -->
  <div
    class="
    fixed inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2
    opacity-100 pointer-events-none z-[100]
    bg-[url('http://assets.iceable.com/img/noise-transparent.png')]
    bg-repeat bg-[length:300px_300px]
    animate-[noise_0.3s_steps(5)_infinite]
  "
  ></div>

  <!-- 3D Scene -->
  <div class="fixed inset-0 z-[2]">
    {#await import("@threlte/studio") then { Studio }}
      <Canvas>
        <Studio>
          <Scene />
        </Studio>
      </Canvas>
    {/await}
  </div>

  <!-- Content overlay -->
  <div
    class=" pointer-events-none
    [--font-primary:'Boldonse',_sans-serif]
    [--font-secondary:'Bodoni_Moda',_serif]
    fixed inset-0 z-[20]
    flex flex-col justify-center items-center
    p-5 text-center text-[var(--color-neutral-200)]
  "
  >
    <div class="max-w-[90%] overflow-hidden flex flex-col gap-8">
      <div
        class="
        [font-family:var(--font-secondary)] text-2xl opacity-70
      "
      >
        The stillness before a star is born.
      </div>

      <div
        class="
        [font-family:var(--font-primary)] text-[7rem]
        leading-[1.3] tracking-[-0.02em] uppercase
      "
      >
        <p class="text-[10rem]">Jaspin</p>
        Creating
      </div>

      <div
        class="
        [font-family:var(--font-secondary)] text-2xl
        italic opacity-70
      "
      >
        Where dust becomes light, and silence writes the sky
      </div>
    </div>
  </div>

  <!-- Custom cursor -->
  <div
    bind:this={customCursor}
    class="
      fixed w-4 h-4 rounded-full
      bg-white/50 pointer-events-none
      mix-blend-difference z-[9999]
      -translate-x-1/2 -translate-y-1/2
      transition-[width,height] duration-200
    "
  ></div>

  <!-- FPS Counter -->
  {#if eclipseState.showFps}
    <div
      class="
      fixed top-5 right-5 z-[100]
      text-white text-xs font-mono
      bg-black/50 px-2.5 py-1 rounded
    "
    >
      FPS: {eclipseState.fps}
    </div>
  {/if}

  <!-- Tweakpane Controls -->
  {#if eclipseState.showControls}
    <div class="fixed top-5 left-5 z-[101] w-80">
      <Pane title="Eclipse Controls" expanded={true} padding="75px 7px">
        <!-- Quick Actions -->
        <Folder title="Quick Actions" expanded={true}>
          <Button title="Reset to Defaults" on:click={eclipseState.resetToDefaults} />
          <Separator />
          <Checkbox bind:value={eclipseState.showFps} label="Show FPS" />
        </Folder>

        <Separator />

        <!-- Core Parameters -->
        <Folder title="Core" expanded={true}>
          <Slider bind:value={eclipseState.speed} label="Speed" min={0.1} max={2} step={0.1} />
          <Slider bind:value={eclipseState.innerRadius} label="Inner Radius" min={50} max={200} step={1} />
          <Slider bind:value={eclipseState.outerRadius} label="Outer Radius" min={200} max={600} step={1} />
          <Slider bind:value={eclipseState.size} label="Size" min={100} max={800} step={1} />
        </Folder>

        <Separator />

        <!-- Flare Intensities -->
        <Folder title="Flares" expanded={true}>
          <Slider bind:value={eclipseState.flareIntensity1} label="Flare 1" min={0} max={2} step={0.1} />
          <Slider bind:value={eclipseState.flareIntensity2} label="Flare 2" min={0} max={2} step={0.1} />
          <Slider bind:value={eclipseState.flareIntensity3} label="Flare 3" min={0} max={2} step={0.1} />
          <Slider bind:value={eclipseState.flareIntensity4} label="Flare 4" min={0} max={2} step={0.1} />
        </Folder>

        <Separator />

        <!-- Color Settings -->
        <Folder title="Colors" expanded={true}>
          <List bind:value={eclipseState.colorPreset} label="Color Preset" options={Object.keys(colorPresets)} />
          <Checkbox bind:value={eclipseState.bwEnabled} label="Black & White" />
          <Slider bind:value={eclipseState.bwContrast} label="B&W Contrast" min={0.5} max={2} step={0.1} />
        </Folder>

        <Separator />

        <!-- Film Grain -->
        <Folder title="Film Grain" expanded={true}>
          <Checkbox bind:value={eclipseState.grainEnabled} label="Enable Grain" />
          <Slider bind:value={eclipseState.grainAmount} label="Grain Amount" min={0} max={0.2} step={0.01} />
          <Slider bind:value={eclipseState.grainSize} label="Grain Size" min={0.5} max={5} step={0.1} />
          <Slider bind:value={eclipseState.grainShadowBoost} label="Shadow Boost" min={0} max={2} step={0.1} />
        </Folder>

        <Separator />

        <!-- Mouse Effect -->
        <Folder title="Mouse Effect" expanded={false}>
          <Checkbox bind:value={eclipseState.mouseProximityEnabled} label="Enable Mouse Effect" />
          <Slider bind:value={eclipseState.mouseProximityStrength} label="Mouse Strength" min={0} max={1} step={0.01} />
        </Folder>
      </Pane>
    </div>
  {/if}
</div>

<style>
  /* Noise animation keyframes */
  @keyframes noise {
    0% {
      transform: translate(0, 0);
    }
    10% {
      transform: translate(-2%, -3%);
    }
    20% {
      transform: translate(-4%, 2%);
    }
    30% {
      transform: translate(2%, -4%);
    }
    40% {
      transform: translate(-2%, 5%);
    }
    50% {
      transform: translate(-4%, 2%);
    }
    60% {
      transform: translate(3%, 0);
    }
    70% {
      transform: translate(0, 3%);
    }
    80% {
      transform: translate(-3%, 0);
    }
    90% {
      transform: translate(2%, 2%);
    }
    100% {
      transform: translate(1%, 0);
    }
  }
</style>
