<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import { cn } from "$lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    inset,
    children,
    ...restProps
  }: DropdownMenuPrimitive.SubTriggerProps & {
    inset?: boolean;
  } = $props();
</script>

<DropdownMenuPrimitive.SubTrigger bind:ref data-slot="dropdown-menu-sub-trigger" class={cn("focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground outline-hidden flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm", inset && "pl-8", className)} {...restProps}>
  {@render children?.()}
  <ChevronRight class="ml-auto size-4" />
</DropdownMenuPrimitive.SubTrigger>
