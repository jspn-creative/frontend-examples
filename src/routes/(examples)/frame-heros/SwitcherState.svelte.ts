import { getContext, setContext } from "svelte";
import type { Hero } from "./HeroSwitcher.svelte";
import White from "./heroes/White.svelte";
import Aurora from "./heroes/Aurora.svelte";
import Layout from "./heroes/Layout.svelte";
import PerspectiveGrid from "./heroes/PerspectiveGrid.svelte";
import Grid from "./heroes/Grid.svelte";
import Rays from "./heroes/Rays.svelte";
import Video from "./heroes/Video.svelte";
import Tail from "./heroes/Tail.svelte";

const heroes: Hero[] = [
  { component: PerspectiveGrid, name: "PerspectiveGrid", bg: "var(--color-white)" },
  { component: White, name: "White", bg: "var(--color-white)" },
  { component: Video, name: "Video", bg: "var(--color-slate-950)" },
  { component: Rays, name: "Rays", bg: "var(--color-white)" },
  { component: Grid, name: "Grid", bg: "var(--color-neutral-900)" },
  { component: Aurora, name: "Aurora", bg: "var(--color-neutral-950)" },
  { component: Layout, name: "Layout", bg: "var(--color-neutral-950)" },
  { component: Tail, name: "Tail", bg: "var(--color-neutral-400)" },
];

interface SwitcherState {
  activeHero: Hero;
  heroOptions: Hero[];
  useFrame: boolean;
  mode: "dark" | "light";
  setActiveHero: (hero: Hero) => void;
  toggleFrame: () => void;
  switchMode: () => void;
  setBg: (bg: string) => void;
}

class SwitcherStateClass implements SwitcherState {
  heroOptions = heroes;
  activeHero = $state<Hero>(this.heroOptions[0]);
  useFrame = $state(false);
  mode = $state<"dark" | "light">("dark");
  bg = $state("bg-white");
  setActiveHero = (hero: Hero) => {
    // Create a new object to ensure reactivity
    this.activeHero = { ...hero };
  };
  toggleFrame = () => {
    this.useFrame = !this.useFrame;
  };
  switchMode = () => {
    this.mode = this.mode === "dark" ? "light" : "dark";
  };
  setBg = (bg: string) => {
    this.activeHero = { ...this.activeHero, bg };
  };
}

const DEFAULT_KEY = "$_switcher_state";

export const getSwitcherState = (key = DEFAULT_KEY) => {
  return getContext<SwitcherState>(key);
};

export const setSwitcherState = (key = DEFAULT_KEY) => {
  const switcherState = new SwitcherStateClass();
  return setContext(key, switcherState);
};
