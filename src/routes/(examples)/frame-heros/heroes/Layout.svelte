<script lang="ts">
  import { pointerBg } from "$lib/actions";
  import { Button } from "$lib/components/ui/button";
  import { cn } from "$lib/utils";
  import GridLines from "../GridLines.svelte";

  const primaryNavLinks = [
    { name: "Home", href: "#" },
    { name: "Technology", href: "#" },
    { name: "About", href: "#" },
    { name: "Team", href: "#" },
    { name: "FAQ", href: "#" },
  ];

  const secondaryNavLinks = [
    { name: "Request a Demo", href: "#" },
    { name: "Testimonials", href: "#" },
  ];
</script>

<div class=" *:py-10 *:lg:py-16 *:relative *:flex *:flex-col *:gap-8 *:overflow-x-hidden">
  <!-- Hero section -->
  <div class="relative w-full min-h-[500px] grow flex flex-col bg-black overflow-hidden">
    <GridLines startingOffsets={[20, 40, 200, 200, 80]} />

    <div use:pointerBg={{ color: "var(--color-white)", lineLength: 0.07, lineWidth: 8, lineAlpha: 0.04, spotlightEnabled: false }} class="absolute inset-0 z-0">
      <!-- Red glow -->
      <div class="absolute inset-0 [background:radial-gradient(ellipse_at_70%_65%,rgba(255,0,0,0.15)_0%,transparent_70%)]"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 container mx-auto px-4 py-16 flex flex-col h-full">
      <!-- Logo -->
      <div class="absolute top-4 left-4 sm:top-8 sm:left-8">
        <div class="text-foreground/90 flex items-center">
          <span class="font-bold text-sm sm:text-xl">jspncreative</span>
        </div>
      </div>

      <!-- Hero content -->
      <div class="max-w-lg mt-10">
        <h1 class="text-4xl sm:text-5xl font-bold text-foreground mb-4">Unlocking Tomorrow's Security Today</h1>
        <p class="text-foreground/80 mb-4">Our AI learns and adapts to user behavior, instantly spotting anomalies and neutralizing threats.</p>
        <p class="text-foreground/60 text-sm mb-6">Zeonite is a forward-thinking cyber threat security solution, AI-powered to detect and neutralize threats in real-time across networks, endpoints, data, and users. Its focus on facial recognition, fingerprint scanning, behavioral analysis, and advanced threat detection positions it as a market leader in secure storage solutions.</p>
        <Button variant="destructive" class="rounded-none px-6 py-2 text-sm font-medium">Learn more</Button>
      </div>
    </div>
  </div>

  <!-- Nav -->
  <div class="w-full border-t border-border shrink-0">
    <GridLines />

    <!-- Primary Navigation -->
    <div class="border-b border-border">
      <div class="container mx-auto px-0">
        <div class="grid grid-cols-5">
          {#each primaryNavLinks as link}
            <a href={link.href} class="py-4 flex justify-center items-center text-foreground font-medium hover:text-foreground/60 transition-colors border-r last:border-r-0 border-border">
              <span class="uppercase text-sm tracking-wider">{link.name}</span>
            </a>
          {/each}
        </div>
      </div>
    </div>

    <!-- Secondary Navigation -->
    <div>
      <div class="container mx-auto px-0">
        <div class="grid grid-cols-2">
          {#each secondaryNavLinks as link, i}
            <a href={link.href} class={cn("py-6 flex justify-center items-center font-medium text-foreground hover:text-foreground/60 transition-colors", i === 0 ? "border-r border-border" : "")}>
              <span class="uppercase text-sm tracking-wider">{link.name}</span>
            </a>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes ping {
    0%,
    100% {
      opacity: 0.8;
      transform: scale(1);
    }
    50% {
      opacity: 0.4;
      transform: scale(0.8);
    }
  }
</style>
