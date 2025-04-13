<script lang="ts">
  import Particles from "$lib/components/Particles.svelte";
</script>

<div class="h-full flex flex-col items-center justify-center relative overflow-hidden">
  <svg class="absolute inset-0 overflow-hidden z-0" width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
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
    </defs>

    <!-- Background gradients -->
    <rect width="100%" height="100%" fill="url(#gradLeft)" />
    <rect width="100%" height="100%" fill="url(#gradRight)" />
    <rect width="100%" height="100%" fill="url(#gradBottom)" />

    <g transform="skewY(-5) skewX(-30)">
      <g id="grid">
        {#each Array(20) as _, row}
          {#each Array(10) as _, col}
            <rect x={col * 200} y={row * 50} width={200} height={50} class="hover:opacity-70 transition-opacity duration-3000 ease-out" fill="var(--color-green-500)" stroke="var(--color-white)" stroke-width="2" stroke-opacity="0.5" opacity={Math.pow(Math.random(), 1) * 0.08} />
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
