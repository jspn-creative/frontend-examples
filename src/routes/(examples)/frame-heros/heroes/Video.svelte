<script lang="ts">
  import Particles from "$lib/components/Particles.svelte";
  import crt from "$lib/images/crt.gif";
  let { crtOverlay = true } = $props<{ crtOverlay?: boolean }>();
</script>

<div class="relative min-h-full min-w-full">
  <video class="min-h-full h-screen object-cover min-w-full object- opacity-100 hue-rotate-15" onloadeddata={(e) => e.currentTarget.classList.add("opacity-30")} autoplay loop muted playsinline src="https://l4wlsi8vxy8hre4v.public.blob.vercel-storage.com/video/glass-animation-5-f0gPcjmKFIV3ot5MGOdNy2r4QHBoXt.mp4"></video>

  {#if crtOverlay}
    <div class="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30">
      <div class="h-full w-full bg-repeat" style="background-image: url({crt}); background-size: 300px; image-rendering: pixelated;"></div>
    </div>
  {/if}

  <div class="contents">
    <!-- <div class="absolute inset-0 bg-sky-600/30 bg-gradient-to-br from-sky-900/20 to-violet-800/20"></div> -->
    <Particles size={150} quantity={20} staticity={10} color="--color-violet-800" className="absolute inset-0 blur-3xl" />

    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <div class="px-6 max-w-4xl space-y-4 relative">
        <div class="gap-8 flex flex-col items-center justify-center">
          <div class="inline-block rounded-lg backdrop-blur-xs bg-gray-950/20 border-gray-800/80 border px-6 py-2">
            <span class="bg-gradient-to-r from-purple-400 via-indigo-500 to-sky-500 bg-clip-text text-sm font-medium text-transparent drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]"> Much gradients 👍 </span>
          </div>

          <h1 class="text-center text-slate-100 text-2xl sm:text-4xl/[1.1] font-bold tracking-tight [text-wrap:balance] md:text-6xl/[1.1]">Websites That Perform as Beautifully as They Look.</h1>
          <p class="text-center [text-wrap:balance] text-xs sm:text-sm md:text-lg/relaxed text-slate-300 font-medium">Specializing in custom web development where pixel-perfect design meets blazing-fast performance. Go beyond templates. Invest in quality.</p>

          <button class="inline-flex items-center rounded-lg bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-3 font-medium text-black shadow-lg hover:opacity-90">
            Get Started
            <svg class="ml-2 h-4 w-4" viewBox="0 0 16 16" fill="none">
              <path d="M6.5 3.5L11 8L6.5 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
