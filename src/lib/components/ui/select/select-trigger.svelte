<script lang="ts">
  import { Select as SelectPrimitive, type WithoutChild } from "bits-ui";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import { cn } from "$lib/utils";
  let { ref = $bindable(null), class: className, children, ...restProps }: WithoutChild<SelectPrimitive.TriggerProps> = $props();
</script>

<SelectPrimitive.Trigger bind:ref class={cn("border-input bg-background ring-offset-background data-[placeholder]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className)} {...restProps}>
  {@render children?.()}
</SelectPrimitive.Trigger>
