<script lang="ts">
  import { rays } from "$lib/actions/tailwind-rays";
  import Particles from "$lib/components/Particles.svelte";
  import { Pane, Checkbox, Folder, Slider } from "svelte-tweakpane-ui";

  let maskTarget: HTMLElement | undefined = $state();
  let debugOverlay: HTMLElement | undefined = $state();

  const controls = $state({
    showMaskDebug: false,
    maskSoftness: 40,
    maskIntensity: 3.0,
  });
</script>

<Pane position="draggable" title="Rays Debug" expanded>
  <Folder title="Mask Visualization" expanded>
    <Checkbox bind:value={controls.showMaskDebug} label="Show Mask Overlay" />
    <Slider bind:value={controls.maskSoftness} min={0} max={100} label="Mask Softness" />
    <Slider bind:value={controls.maskIntensity} min={0} max={5} step={0.1} label="Mask Intensity" />
  </Folder>
</Pane>

<!-- Full-screen grid container -->
<div class="group bg-stone-950 h-full grid grid-cols-1 grid-rows-1 place-items-center relative overflow-hidden">
  <!-- Background glow -->
  <div class="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-amber-500/10 group-hover:bg-amber-500/30 transition-colors duration-[3000ms] rounded-full blur-[50vw]"></div>
  <div class="absolute -bottom-2/3 -right-1/4 w-screen h-[50vh] bg-amber-500/5 rounded-full blur-[20vw]"></div>
  <div class="absolute inset-0 bg-gradient-to-br from-stone-950 via-transparent to-transparent z-[1]"></div>

  <Particles ease={100} staticity={150} color="--color-amber-500" quantity={300} className="absolute inset-0 opacity-30 z-[2]" />

  <!-- Base text layer -->
  <div style="max-inline-size: 80vw;" class="col-start-1 row-start-1 flex flex-col gap-5 items-center justify-center px-6 z-[4]">
    <h1 class="text-center opacity-50 bg-gradient-to-r from-amber-200/50 via-orange-300/50 to-amber-100/50 bg-clip-text text-transparent text-2xl sm:text-4xl/[1.1] font-bold tracking-tight [text-wrap:balance] md:text-6xl/[1.1]">
      Craft Digital Experiences That <span class="bg-gradient-to-br from-amber-300/20 via-orange-400/50 to-amber-500/50 bg-clip-text text-transparent">Ignite</span> and Inspire.
    </h1>
    <p class="text-center [text-wrap:balance] text-xs sm:text-sm md:text-lg/relaxed text-stone-600 max-w-2xl">Where bold vision meets relentless precision. We build immersive, high-performance websites that don't just exist—they captivate.</p>
  </div>

  <!-- Illuminated text layer -->
  <div class="col-start-1 row-start-1 w-full h-full grid place-items-center z-[5] pointer-events-none gradient-mask">
    <div bind:this={maskTarget} aria-hidden="true" class="w-full h-full grid place-items-center">
      <div style="max-inline-size: 80vw;" class="flex flex-col gap-5 items-center justify-center px-6">
        <div class="text-center bg-gradient-to-r from-amber-200 via-orange-300 to-amber-100 bg-clip-text text-2xl sm:text-4xl/[1.1] font-bold tracking-tight [text-wrap:balance] text-transparent md:text-6xl/[1.1]">
          Craft Digital Experiences That <span class="bg-gradient-to-br from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">Ignite</span> and Inspire.
        </div>
        <div class="text-center [text-wrap:balance] text-xs sm:text-sm md:text-lg/relaxed text-amber-100/80 max-w-2xl">Where bold vision meets relentless precision. We build immersive, high-performance websites that don't just exist—they captivate.</div>
      </div>
    </div>
  </div>

  <!-- Debug overlay -->
  <div bind:this={debugOverlay} class="col-start-1 row-start-1 w-full h-full pointer-events-none z-[10] transition-opacity duration-300 gradient-mask" class:opacity-0={!controls.showMaskDebug}></div>

  <div use:rays={{ centered: false, color: "rgb(245,158,11)", textMaskTarget: maskTarget ?? null, debugOverlayTarget: debugOverlay ?? null, speedMultiplier: 4, maskSoftness: controls.maskSoftness, maskIntensity: controls.maskIntensity }} class="z-[3]"></div>
</div>

<style>
  .gradient-mask {
    mask-image: radial-gradient(120% 60% at 0% 0%, black 0%, rgba(0, 0, 0, 0.7) 80%, transparent 100%);
  }
</style>
