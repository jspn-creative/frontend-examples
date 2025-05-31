<script lang="ts">
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  import { dev } from "$app/environment";
  import Inspect from "svelte-inspect-value";
  import { setGlobalInspectOptions } from "svelte-inspect-value";

  setGlobalInspectOptions(() => ({
    renderIf: dev,
    theme: "dark",
    embedMedia: true,
    // borderless: true,
    showPreview: false,
    expandLevel: 0,
  }));

  let { children } = $props();
</script>

<!-- <Inspect value={dev} name="dev" /> -->
<!-- <Inspect.Values {dev} {RenderScan} /> -->

<Toaster richColors />
{@render children()}
{#if dev}
  {#await import("svelte-render-scan") then { RenderScan }}
    <RenderScan initialEnabled={false} offsetLeft={30} duration={2000} />
  {/await}
{/if}

<style>
  :global(.svelte-inspect-value) {
    --background-color: rgba(0, 0, 0, 1);
    opacity: 0.1;
    height: 1%;
    position: absolute;
    width: 100%;
    z-index: 1000;

    &:hover {
      opacity: 1;
      height: auto;
    }
  }
</style>
