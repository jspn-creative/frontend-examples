<script module lang="ts">
  export type Hero = { name: string; component: any; bg: string };
</script>

<script lang="ts">
  import { getSwitcherState } from "./SwitcherState.svelte";
  const switcherState = getSwitcherState();

  import Button from "$lib/components/ui/button/button.svelte";
  import * as Select from "$lib/components/ui/select/index";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import { SwatchBook, Crop } from "lucide-svelte";

  let isOpen = $state(false);

  function handleValueChange(v: any) {
    const selectedHero = switcherState.heroOptions.find((option: Hero) => option.name === v);
    if (selectedHero) {
      switcherState.setActiveHero(selectedHero);
    }
  }
</script>

<div class="fixed bottom-8 left-8 flex gap-2 z-50 *:first:rounded-bl-xl">
  <Button size="lg" class="has-[>svg]:px-2 bg-background text-xs backdrop-blur-md border border-border shadow-[2px_2px_var(--color-border)] hover:bg-background hoverw:text-primary text-secondary-foreground" onclick={() => switcherState.toggleFrame()}>
    <Crop class="size-5 transition-all duration-1000 ease-out text-primary" />
    <span class="sr-only">Toggle Frame</span>
  </Button>

  <div role="presentation" class="group {isOpen ? 'w-auto ' : 'hover:w-auto size-10'} bg-background backdrop-blur-md border border-border shadow-[2px_2px_var(--color-border)] transition-all duration-300 ease-in-out items-center rounded h-10">
    <!-- Select -->

    <Select.Root value={switcherState.activeHero.name} type="single" onValueChange={handleValueChange} onOpenChange={(open) => (isOpen = open)}>
      <Select.Trigger id="hero-switcher" class="{isOpen ? 'gap-5' : 'group-hover:gap-5 justify-center'} w-full text-sm font-medium bg-transparent border-0">
        <SwatchBook class="{isOpen ? 'size-6' : 'group-hover:size-6 size-5'} transition-all duration-1000 ease-out text-primary shrink-0" />
        <div class="{isOpen ? 'opacity-100 w-auto' : 'group-hover:opacity-100 w-0 group-hover:w-auto'} text-secondary-foreground hover:text-primary hover:flex items-center truncate text-xs">
          {switcherState.activeHero.name}
        </div>
        <ChevronDown class="{isOpen ? 'size-4' : 'group-hover:size-4 size-0 text-secondary-foreground'} opacity-50" />
      </Select.Trigger>
      <Select.Content class="{isOpen ? 'w-auto' : 'w-0 group-hover:w-auto'} overflow-hidden rounded border border-border bg-background/80 shadow-[2px_2px_var(--color-border)]" sideOffset={4}>
        <Select.Group class="space-y-1">
          {#each switcherState.heroOptions as option, i (i + option.name)}
            <Select.Item value={option.name} label={option.name} class="data-[selected]:bg-primary data-[selected]:text-secondary text-xs w-auto cursor-pointer rounded-sm py-1.5 px-2.5 transition-colors flex items-center hover:bg-background hover:text-foreground">
              {#snippet children({ selected })}
                {option.name}
              {/snippet}
            </Select.Item>
          {/each}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  </div>
</div>
