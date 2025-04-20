<script lang="ts">
  import SVGPanel from "./svgbtn.svelte";
  import { fade } from "svelte/transition";
  let isGlowing = $state(false);
  function toggleGlow() {
    isGlowing = !isGlowing;
  }
</script>

<div class="bg-[#0E0F0D] min-h-screen flex flex-col gap-6 items-center justify-center">
  <h2 class="text-[#6A6B66] font-bold">Click the SEAS logo:</h2>
  <div class="relative max-w-full h-[80vh] aspect-[9/16]]">
    <SVGPanel {toggleGlow} {isGlowing} />
    {#if isGlowing}
      <div class="absolute inset-0 pointer-events-none mix-blend-color-dodge [filter:blur(10px)] [clip-path:inset(0_0_0_0_round_10px)]" transition:fade={{ duration: 300 }}>
        <div class="w-full h-full glow"></div>
      </div>
    {/if}
  </div>
</div>

<style>
  @property --gradient-angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
  }

  @keyframes rotation {
    0% {
      --gradient-angle: 0deg;
    }
    100% {
      --gradient-angle: 360deg;
    }
  }

  .glow {
    background: linear-gradient(var(--gradient-angle), #b7d9f1, #a6e9ff, #97c4d3);
    animation: rotation 5s linear infinite;
    --shape: 0 0, 100% 0, 100% 100%, 0 100%, 0 0;
    clip-path: polygon(var(--shape));
    --s: -8px;
    padding: calc(-1 * var(--s));
    clip-path: polygon(evenodd, var(--s) var(--s), calc(100% - var(--s)) var(--s), calc(100% - var(--s)) calc(100% - var(--s)), var(--s) calc(100% - var(--s)), var(--s) var(--s), var(--shape)) content-box;
  }
</style>
