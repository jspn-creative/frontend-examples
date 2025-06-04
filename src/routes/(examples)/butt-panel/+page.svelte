<script lang="ts">
  import { Canvas } from "@threlte/core";
  // import SVGPanel from "./svgbtn.svelte";
  import SVGPanel from "./butt-panel.svelte";
  import Scene from "./DreamyParticleScene.svelte";
  // import Scene from "./MotionBloomScene.svelte";
  // import Scene from "./GlowScene.svelte";
  import { innerWidth, innerHeight } from "svelte/reactivity/window";
  import { ThemeUtils, Pane, Checkbox, List, TabGroup, TabPage, Folder, Slider, type ListOptions } from "svelte-tweakpane-ui";
  // ThemeUtils.setGlobalDefaultTheme(ThemeUtils.presets.translucent);

  let isActive = $state(false);
  let isTextured = $state(true);
  let showTest = $state(false);
  let texture = $state(1);

  // Post processing settings
  let bloomIntensity = $state(1.3);
  let bloomThreshold = $state(0.15);
  let bloomRadius = $state(0.4);
  let exposure = $state(1);

  // Particle settings
  let particleSize = $state(0.05);
  let maxParticleSize = $state(0.25);
  let particleSpread = $state(10);
  let particleCount = $state(14500);

  let tubeRadius = $state(3);

  function toggleGlow() {
    isActive = !isActive;
  }

  const textureOptions: ListOptions<number> = {
    "Distressed Metal": 1,
    "Corroded Metal": 2,
    "Leathery Metal": 3,
    "Streaked Metal": 4,
    "Scuffed Metal": 5,
    "Grainy Metal": 6,
    "Scratched Metal": 7,
  };

  const glowColor = "#ff0000";

  let borderElement: HTMLDivElement;
  let borderRect = $state({ x: 0, y: 0, width: 0, height: 0 });

  $effect(() => {
    const updateBorderRect = () => {
      if (borderElement && innerWidth.current && innerHeight.current) {
        const rect = borderElement.getBoundingClientRect();
        borderRect = {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        };
      }
    };

    updateBorderRect();

    const resizeObserver = new ResizeObserver(updateBorderRect);
    if (borderElement) {
      resizeObserver.observe(borderElement);
    }

    return () => {
      resizeObserver.disconnect();
    };
  });

  // $inspect(borderRect);
  $inspect(innerWidth.current);
</script>

<!-- Tweakpane UI -->
<Pane position="draggable" title="Effect Config" expanded x={innerWidth.current - 350} padding="75px 7px">
  <Checkbox bind:value={isTextured} label="Textured" />
  <List bind:value={texture} label="Texture" options={textureOptions} />

  <TabGroup>
    <TabPage title="3D Settings">
      <Checkbox bind:value={isActive} label="Glow Effect" />
      <Checkbox bind:value={showTest} label="Show Test Geometry" />

      <Folder title="Post Processing" expanded={false}>
        <Slider bind:value={bloomIntensity} label="Bloom Intensity" min={0} max={3} step={0.1} />
        <Slider bind:value={bloomThreshold} label="Bloom Threshold" min={0} max={1} step={0.01} />
        <Slider bind:value={bloomRadius} label="Bloom Radius" min={0} max={1} step={0.01} />
        <Slider bind:value={exposure} label="Exposure" min={0.1} max={2} step={0.1} />
      </Folder>

      <Folder title="3D Controls" expanded={false}>
        <Slider bind:value={tubeRadius} label="Tube Radius" min={1} max={10} step={0.1} />
      </Folder>

      <Folder title="Particle Controls" expanded={false}>
        <Slider bind:value={particleSize} label="Particle Size" min={0.05} max={2} step={0.05} />
        <Slider bind:value={maxParticleSize} label="Max Particle Size" min={0.25} max={3} step={0.25} />
        <Slider bind:value={particleSpread} label="Particle Spread" min={5} max={50} step={1} />
        <Slider bind:value={particleCount} label="Particle Count" min={1000} max={15000} step={500} />
      </Folder>
    </TabPage>
  </TabGroup>
</Pane>

<div class="bg-[#0E0F0D] min-h-screen flex flex-col gap-6 items-center justify-center">
  <!-- <h2 class="text-[#6A6B66] font-bold">Click the SEAS logo:</h2> -->
  <div class="relative max-w-full h-[80vh] aspect-[9/16]]">
    <SVGPanel {toggleGlow} isGlowing={isActive} {isTextured} {texture} />
    <div class="@container bg-[#000] border-4 border-[#090B09] absolute top-[3%] inset-x-[15%] h-6 pointer-events-none">
      <div class="relative">
        <!-- User Avatar: -->
        <div class="@max-[250px]:scale-80 @max-[180px]:scale-50 @max-[180px]:-left-6 absolute -top-3.5 -left-3 w-10 h-11 bg-[conic-gradient(from_45deg_at_50%_50%,_#ffffff39_0%_10%,_#838483_10%_30%,_#ffffff39_30%_60%,_#838483_60%_80%,_#ffffff39_80%_100%)] [clip-path:shape(from_50%_0%,_line_to_100%_30%,_line_to_100%_70%,_line_to_50%_100%,_line_to_0%_70%,_line_to_0%_30%,_close)] flex items-center justify-center">
          <div class="bg-gradient-to-br w-[2.35rem] h-[2.6rem] from-[#121412] to-[#191D1A] [clip-path:shape(from_50%_0%,_line_to_100%_30%,_line_to_100%_70%,_line_to_50%_100%,_line_to_0%_70%,_line_to_0%_30%,_close)] flex items-center justify-center">
            <span class="text-[#838483] text-xs font-bold">JS</span>
          </div>
        </div>

        <!-- Alert Button: -->
        <div class="@max-[250px]:scale-80 @max-[180px]:scale-50 @max-[180px]:-right-6 absolute -top-3.5 -right-3 w-10 h-11 bg-[conic-gradient(#ffffff39_0%_10%,_#838483_10%_30%,_#ffffff39_30%_60%,_#838483_60%_80%,_#ffffff39_80%_100%)] [clip-path:shape(from_50%_0%,_line_to_100%_30%,_line_to_100%_70%,_line_to_50%_100%,_line_to_0%_70%,_line_to_0%_30%,_close)] flex items-center justify-center">
          <div class="bg-gradient-to-br w-[2.35rem] h-[2.6rem] from-[#121412] to-[#191D1A] [clip-path:shape(from_50%_0%,_line_to_100%_30%,_line_to_100%_70%,_line_to_50%_100%,_line_to_0%_70%,_line_to_0%_30%,_close)] flex items-center justify-center">
            <svg class="w-4 h-4 text-[#838483]" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <!-- Notification badge -->
          <div class="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
            <span class="text-[8px] text-red-500 font-bold">3</span>
          </div>
        </div>
      </div>
    </div>
    <div bind:this={borderElement} class="absolute inset-0 pointer-events-none">
      {#if showTest}
        <div class="absolute top-0 left-0 border border-red-500" style="width: {borderRect.width}px; height: {borderRect.height}px; ">
          <div class="p-4">
            <p><span class="font-bold">Border x:</span> {Math.round(borderRect.x)}px</p>
            <p><span class="font-bold">Border y:</span> {Math.round(borderRect.y)}px</p>
            <br />
            <p><span class="font-bold">Border w:</span> {Math.round(borderRect.width)}px</p>
            <p><span class="font-bold">Border h:</span> {Math.round(borderRect.height)}px</p>
            <br />
            <p><span class="font-bold">innerWidth:</span> {Math.round(innerWidth.current ?? 0)}px</p>
            <p><span class="font-bold">innerHeight:</span> {Math.round(innerHeight.current ?? 0)}px</p>
          </div>
        </div>
      {/if}
    </div>
    <div class="absolute -inset-10 pointer-events-none">
      <Canvas>
        {#if import.meta.env.MODE === "development"}
          {#await import("@threlte/studio") then { Studio }}
            <Studio>
              <Scene {isActive} {showTest} {glowColor} innerWidth={innerWidth.current} innerHeight={innerHeight.current} {borderRect} {bloomIntensity} {bloomThreshold} {bloomRadius} {exposure} {particleSize} {particleSpread} {particleCount} {tubeRadius} {maxParticleSize} />
            </Studio>
          {/await}
        {:else}
          <Scene {isActive} {showTest} {glowColor} innerWidth={innerWidth.current} innerHeight={innerHeight.current} {borderRect} {bloomIntensity} {bloomThreshold} {bloomRadius} {exposure} {particleSize} {particleSpread} {particleCount} {tubeRadius} {maxParticleSize} />
        {/if}
      </Canvas>
    </div>
  </div>
</div>
