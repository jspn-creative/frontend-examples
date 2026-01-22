<script lang="ts">
  import { page } from "$app/state";
  import { setSwitcherState } from "./SwitcherState.svelte";

  const { children } = $props();

  // Get initial hero from URL param
  const initialHero = page.url.searchParams.get("hero");
  setSwitcherState(initialHero ?? undefined);
</script>

{@render children()}
