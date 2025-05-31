<script>
  import { Canvas } from "@threlte/core";
  import { dev } from "$app/environment";

  //   Dissolve effect with particles:
  import Scene from "./Scene.svelte";
</script>

<Canvas>
  <!-- {#if dev} -->
  {#await import("@threlte/studio") then { Studio }}
    <Studio>
      <Scene />
    </Studio>
  {/await}
  <!-- {:else}
    <Scene />
  {/if} -->
</Canvas>
