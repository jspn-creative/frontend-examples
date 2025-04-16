<script lang="ts">
  import { getSwitcherState } from "./SwitcherState.svelte";
  const switcherState = getSwitcherState();

  import { scramble } from "$lib/actions/scramble";
  import HeroLabel from "./HeroLabel.svelte";
  import HeroSwitcher from "./HeroSwitcher.svelte";
  import type { Hero } from "./HeroSwitcher.svelte";
</script>

<div style="--color:{switcherState.activeHero.bg}; background-color:var(--color)" class="{switcherState.useFrame ? 'p-6 h-screen' : ''} ">
  {@render hero(switcherState.useFrame)}
</div>
<HeroSwitcher />

{#snippet container(hero: Hero)}
  <div class="relative" style="--color:{switcherState.activeHero.bg};">
    <h1 class="text-3xl absolute top-4 p-4 inset-x-20 flex items-center justify-center rounded-full z-20 bg-(--color)/50 text-foreground">
      jspn<span class="font-bold">creative</span>
    </h1>

    <div class="relative h-[100vh]">
      <svelte:component this={hero.component} />
    </div>
  </div>
{/snippet}

{#snippet frame(hero: Hero)}
  <HeroLabel color={hero.bg} rounded="lg" class="before:opacity-10 rounded-2xl h-full relative overflow-hidden">
    <h1 class="pb-4 pt-2 pl-6 pr-8 text-3xl" style="color: color-contrast(var(--color) vs #fff, #000);">
      jspn<span class="font-bold">creative</span>
    </h1>
    {#snippet src()}
      <svelte:component this={hero.component} />
    {/snippet}
  </HeroLabel>
{/snippet}

{#snippet hero(useFrame: boolean)}
  {#if useFrame}
    {@render frame(switcherState.activeHero)}
  {:else}
    {@render container(switcherState.activeHero)}
  {/if}
{/snippet}
