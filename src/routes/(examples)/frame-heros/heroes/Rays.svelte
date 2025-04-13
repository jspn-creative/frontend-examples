<script lang="ts">
  import { rays } from "$lib/actions/tailwind-rays";
  import Particles from "$lib/components/Particles.svelte";
</script>

<div class="bg-slate-950 h-full flex flex-col items-center justify-center relative overflow-hidden">
  <div use:rays={{ centered: false, color: "rgb(139,92,246)" }}></div>
  <Particles color="--color-accent" quantity={300} className="absolute inset-0 opacity-40" />

  <div class="max-w-4xl flex flex-col gap-4 items-center justify-center px-6 relative z-10">
    <h1 class="text-center text-sky-50 text-2xl sm:text-4xl/[1.1] font-bold tracking-tight [text-wrap:balance] md:text-6xl/[1.1]">Websites That Perform as Beautifully as They Look.</h1>

    <p class="text-center [text-wrap:balance] text-xs sm:text-sm md:text-lg/relaxed text-slate-200 font-medium">Specializing in custom web development where pixel-perfect design meets blazing-fast performance. Go beyond templates. Invest in quality.</p>
  </div>
</div>
