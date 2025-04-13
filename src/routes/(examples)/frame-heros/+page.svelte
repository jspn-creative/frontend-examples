<script lang="ts">
  import { onMount } from "svelte";
  import { scramble } from "$lib/actions/scramble";
  import HeroLabel from "./HeroLabel.svelte";
  import PerspectiveGrid from "./heroes/PerspectiveGrid.svelte";
  import Grid from "./heroes/Grid.svelte";
  import Rays from "./heroes/Rays.svelte";
  import Video from "./heroes/Video.svelte";
  import HeroSwitcher from "./HeroSwitcher.svelte";
  import type { Hero } from "./HeroSwitcher.svelte";
  import Inspect from "svelte-inspect-value";

  const heroOptions: Hero[] = [
    { component: PerspectiveGrid, name: "PerspectiveGrid", bg: "var(--color-white)" },
    { component: Video, name: "Video", bg: "var(--color-slate-950)" },
    { component: Rays, name: "Rays", bg: "var(--color-white)" },
    { component: Grid, name: "Grid", bg: "var(--color-neutral-900)" },
  ];

  let activeHero = $state(heroOptions[0]);
  let useFrame = $state(false);

  function toggleFrame() {
    useFrame = !useFrame;
    localStorage.setItem("useFrame", useFrame.toString());
  }

  onMount(() => {
    const savedHeroName = localStorage.getItem("activeHero");
    if (savedHeroName) {
      const savedHero = heroOptions.find((hero) => hero.name === savedHeroName);
      if (savedHero) activeHero = savedHero;
    }
    const savedUseFrame = localStorage.getItem("useFrame");
    if (savedUseFrame) {
      useFrame = savedUseFrame === "true";
    }
  });

  function handleHeroChange(hero: Hero) {
    activeHero = hero;
    localStorage.setItem("activeHero", hero.name);
  }
</script>

<Inspect.Values {activeHero} {useFrame} />

<div style="--color:{activeHero.bg}; background-color:var(--color)" class="{useFrame ? 'p-6 h-screen' : ''} ">
  {@render hero(useFrame)}
</div>

<HeroSwitcher {heroOptions} {activeHero} onHeroChange={handleHeroChange} {toggleFrame} />

{#snippet container(hero: Hero)}
  <div class="relative">
    <h1 class="text-3xl absolute top-4 p-4 inset-x-20 flex items-center justify-center rounded-full z-20 bg-white/80">
      jspn<span class="font-bold">creative</span>
    </h1>

    <div class="relative h-[100vh]">
      <hero.component />
    </div>
  </div>
{/snippet}

{#snippet frame(hero: Hero)}
  <HeroLabel color={hero.bg} rounded="lg" class="before:opacity-10 rounded-2xl h-full relative overflow-hidden">
    <h1 class="pb-4 pt-2 pl-6 pr-8 text-3xl" style="color: color-contrast(var(--color) vs #fff, #000);">
      jspn<span class="font-bold">creative</span>
    </h1>
    {#snippet src()}
      <hero.component />
    {/snippet}
  </HeroLabel>
{/snippet}

{#snippet hero(useFrame: boolean)}
  {#if useFrame}
    {@render frame(activeHero)}
  {:else}
    {@render container(activeHero)}
  {/if}
{/snippet}
