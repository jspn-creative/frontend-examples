<script lang="ts">
  import { cn } from "$lib/utils";
  interface Props {
    class?: string;
    showRadialGradient?: boolean;
    children?: import("svelte").Snippet;
    [key: string]: any;
  }
  let { class: _class = "", showRadialGradient = true, children, ...rest }: Props = $props();
</script>

<div class={cn("relative flex flex-col h-[100vh] items-center justify-center bg-zinc-50 dark:bg-zinc-950 transition-bg", _class)} {...rest}>
  <div class="absolute inset-0 overflow-hidden">
    <div
      style="--white-gradient:repeating-linear-gradient(100deg,rgb(255 255 255) 0%,rgb(255 255 255) 7%,rgba(255 255 255 / 0%) 10%,rgba(255 255 255 / 0%) 12%,rgb(255 255 255) 16%);
    --dark-gradient:repeating-linear-gradient(100deg,rgb(0 0 0) 0%,rgb(0 0 0) 7%,rgba(255 255 255 / 0%) 10%,rgba(255 255 255 / 0%) 12%,rgb(0 0 0) 16%);
    --aurora:repeating-linear-gradient(100deg, rgb(59 130 246) 10%, rgb(196 181 253) 15%, rgb(147 197 253) 20%, rgb(221 214 254) 25%, rgb(96 165 250) 30%);"
      class={cn(
        `
      [background-image:var(--white-gradient),var(--aurora)]
    dark:[background-image:var(--dark-gradient),var(--aurora)]
    [background-size:300%,_200%]
    [background-position:50%_50%,50%_50%]
    filter blur-[10px] invert dark:invert-0
    after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)]
    after:dark:[background-image:var(--dark-gradient),var(--aurora)]
    after:[background-size:200%,_100%]
    after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
    pointer-events-none absolute -inset-[10px] opacity-50 will-change-transform`,
        showRadialGradient && `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]`
      )}
    ></div>
  </div>
  {@render children?.()}
</div>
