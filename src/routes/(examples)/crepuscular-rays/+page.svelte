<script lang="ts">
  // import { rays } from "$lib/actions/rays";
  import { rays } from "$lib/actions/tailwind-rays";
</script>

<!-- after:bg-[radial-gradient(90vw_90vh_at_0%_0%,rgb(228_33_33)_0%,oklch(0.8_0.12_92.67)_30%,oklch(0.59_0.16_167.85)_80%,oklch(1_0_0)_100%)] after:content-[''] after:absolute after:inset-0 -->
<div class="before:opacity-10 flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(90vw_90vh_at_0%_0%,oklch(0.54_0.29_267.69)_50%,oklch(0.67_0.28_247.58)_50%,oklch(0_0_0)_100%)] before:blur-[9rem]">
  <div use:rays={{ centered: false, color: "rgb(139,92,246)" }}></div>

  <div class="max-w-4xl space-y-4 relative z-10">
    <div class="space-y-2">
      <div class="inline-block rounded-lg backdrop-blur-xs bg-gray-950/20 border-gray-800/80 border px-6 py-2">
        <span class="bg-gradient-to-r from-purple-400 via-indigo-500 to-sky-500 bg-clip-text text-sm font-medium text-transparent drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]"> Much gradients 👍 </span>
      </div>

      <h1 class="bg-gradient-to-br from-white via-sky-100 to-sky-400/50 bg-clip-text text-2xl sm:text-4xl/[1.1] font-bold text-shadow-white tracking-tight text-transparent [text-wrap:balance] md:text-6xl/[1.1] drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">Websites That Perform as Beautifully as They Look.</h1>
    </div>

    <p class="text-xs sm:text-sm md:text-lg/relaxed text-sky-100/80 text-shadow-sm">Specializing in custom web development where pixel-perfect design meets blazing-fast performance. Go beyond templates. Invest in quality.</p>

    <button class="inline-flex items-center rounded-lg bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-3 font-medium text-black shadow-lg hover:opacity-90">
      Get Started
      <svg class="ml-2 h-4 w-4" viewBox="0 0 16 16" fill="none">
        <path d="M6.5 3.5L11 8L6.5 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</div>
