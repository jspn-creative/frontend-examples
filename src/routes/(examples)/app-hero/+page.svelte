<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { headline } from "$lib/utils/headline";
  import grid from "$lib/images/warp-grid.svg";

  const headlines = ["What if your website was more than a digital business card?", "What if your website could replace your lead lists?", "What if your website generated enough leads?"];

  let headlineIndex = -1;

  // setInterval(() => {
  //   headlineIndex = (headlineIndex + 1) % headlines.length;
  // }, 3000);
</script>

<section id="hero" class="md:relative isolate">
  <!-- Masked gradient blobs -->
  <!-- <div class="absolute right-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:right-[calc(50%-18rem)] lg:right-48 lg:top-[calc(50%-20rem)] xl:right-[calc(50%-24rem)]" aria-hidden="true">
    <div class="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r/oklch bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20" style="clip-path: polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)"></div>
  </div> -->

  <!-- Grid BG & Mask -->
  <!-- <svg class="absolute inset-0 -z-10 size-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" aria-hidden="true">
    <defs>
      <pattern id="grid" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
        <path d="M.5 200V.5H200" fill="none" />
      </pattern>
    </defs>
    <svg x="50%" y="-1" class="overflow-visible fill-gray-800/20">
      <path d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z" stroke-width="0" />
    </svg>
    <rect width="100%" height="100%" stroke-width="0" fill="url(#grid)" />
  </svg> -->

  <!-- <img src={grid} alt="Grid" class="absolute inset-x-0 top-[60vh] lg:top-[30vh] -z-10" /> -->

  <!-- Dumb grid bg -->
  <!-- <svg class="absolute inset-0 size-full stroke-white/10" width="100%" height="100%" viewBox="0 0 1000 600">
    <rect width="100%" height="100%" fill="none" />

    <g filter="url(#url)" stroke-width="0.5">
      <path d="M 0,100 L 1000,100" />
      <path d="M 0,200 L 1000,200" />
      <path d="M 0,300 L 1000,300" />
      <path d="M 0,400 L 1000,400" />
      <path d="M 0,500 L 1000,500" />

      <path d="M 100,0 L 100,600" />
      <path d="M 200,0 L 200,600" />
      <path d="M 300,0 L 300,600" />
      <path d="M 400,0 L 400,600" />
      <path d="M 500,0 L 500,600" />
      <path d="M 600,0 L 600,600" />
      <path d="M 700,0 L 700,600" />
      <path d="M 800,0 L 800,600" />
      <path d="M 900,0 L 900,600" />
    </g>
  </svg> -->

  <div class="container pb-24 pt-10 sm:pb-32 lg:flex lg:py-40">
    <div class="max-w-2xl shrink-0 lg:mx-0 pt-4 lg:pt-8">
      <!-- Subtitle -->
      <div class="mt-12 sm:mt-24 lg:mt-6 mb-2">
        <a href="/#" class="inline-flex flex-wrap space-x-6">
          <span class="rounded-full bg-emerald-500/10 max-xs:-ml-2 px-3 py-1 text-xs/snug sm:text-sm/6 font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">What's new</span>
          <span class="inline-flex items-center space-x-2 text-xs/snug sm:text-sm/6 font-medium text-gray-300">
            <span>Just shipped v1.0</span>
            <svg class="size-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
              <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
            </svg>
          </span>
        </a>
      </div>

      <!-- Title -->
      <h1 use:headline={{ maxLines: 2, lineHeight: 1 }} class="mt-4 text-pretty text-5xl font-semibold tracking-tight sm:text-7xl">
        <!-- text-transparent bg-clip-text bg-linear-[175deg] from-white via-white to-background/40 -->
        {#if headlineIndex >= 0}
          {headlines[headlineIndex]}
        {:else}
          Get
          <span class="relative inline-block before:absolute before:-inset-y-1 before:-inset-x-2 before:-right-4 before:mix-blend-plus-lighter before:rounded before:block before:-skew-y-0.5 before:bg-radial before:from-sky-200/20 before:to-sky-500/10">
            <span class="text-sky-500">10<span class="text-4xl sm:text-6xl font-black">✕</span></span> <span class="">more leads</span>
          </span>
          from your website
        {/if}
      </h1>

      <!-- Description -->
      <p class="mt-8 font-light text-pretty text-lg text-gray-300 sm:text-xl/8">Real estate professionals trust HomePage to deliver more leads and get connected to more clients.</p>

      <!-- Buttons -->
      <div class="mt-10 flex items-center gap-x-6">
        <Button variant="flat" href="#">Learn more</Button>
        <Button class="bg-emerald-500 hover:bg-emerald-600" variant="flat" href="#">Learn more</Button>
        <Button variant="outline" href="#">Learn moreeee</Button>
        <a href="/#" class="text-sm/6 font-semibold text-white hover:text-sky-500 transition-colors duration-200">Learn less <span aria-hidden="true">→</span></a>
      </div>
    </div>

    <!-- Image -->
    <div id="hero-image" class="max-md:relative mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
      <div class="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
        <img src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png" alt="App screenshot" width="2432" height="1442" class="w-[76rem] max-w-full rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 mix-blend-color-dodge" />
      </div>

      <!-- Blurry bg gradient ellipse ellipse -->
      <div id="bg-graphic" class="absolute -top-20 right-0 -left-20 md:top-[90vh] lg:top-[70vh] md:inset-x-0 -z-10 h-screen" aria-hidden="true">
        <div class="relative">
          <img src={grid} alt="" class="absolute max-w-full -rotate-12 max-lg:scale-200 lg:scale-120 left-0 -right-20 bottom-30 lg:-bottom-full mix-blend-plus-lighter" />
          <div class="relative w-[80vw] h-[12rem] lg:h-[6rem] mx-auto rounded-full bg-sky-400 blur-[100px] md:blur-[7vw]">
            <div class="w-[40vw] h-[1rem] ml-auto rounded-full bg-emerald-400"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
