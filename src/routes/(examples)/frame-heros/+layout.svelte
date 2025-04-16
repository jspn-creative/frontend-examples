<script>
  import { setSwitcherState } from "./SwitcherState.svelte";

  const { children } = $props();

  setSwitcherState();
</script>

{@render children()}
