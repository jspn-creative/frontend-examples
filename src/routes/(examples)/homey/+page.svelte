<script lang="ts">
  import { Motion, MotionValue, useTransform, useSpring, useViewportScroll } from "svelte-motion";
  import { properties } from "./data.svelte";

  const firstRow = properties.slice(0, 5);
  const secondRow = properties.slice(5, 10);
  const thirdRow = properties.slice(10, 15);
  let ref: HTMLDivElement | null = null;

  const { scrollYProgress } = useViewportScroll();

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.1], [0.1, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [-20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig);

  import { ArrowRight, Bath, BedSingle, Ruler } from "@lucide/svelte";
  function formatPrice(price: number) {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    });
  }

  // import Button from '$components/ui/button/button.svelte';
  import { Button } from "$lib/components/ui/button";
</script>

{@render hero()}

<!-- 
<div class="bg-stone-100 min-h-screen">
	<PropertyListings />
</div> -->

{@render testimonials()}
{@render newsletter()}

{#snippet hero()}
  <div bind:this={ref} class="relative flex h-[145rem] flex-col self-auto overflow-hidden py-4 antialiased [perspective:1000px] [transform-style:preserve-3d] bg-background">
    <div class="pointer-events-none relative left-0 top-[20vh] z-10 mx-auto w-full container">
      <h1 class="md:text-left text-center relative font-fraunces text-5xl font-normal [text-wrap:balance] tracking-tight text-stone-700 sm:text-6xl/tight">
        We'll get you from <br /><span class="text-stone-500 font-semibold italic">“<span class="decoration-stone-400/80 underline">just listed</span>” </span>
        to
        <span class="absolut bottom-16 right-14 font-hand text-[11rem] md:text-[11rem]/[0] translate-y-20 lg:translate-y-20 md:translate-y-6 text-stone-600 bg-gradient-to-tl md:from-stone-500/90 to-stone-700 bg-clip-text pr-10 md:text-transparent">Sold!</span>
      </h1>
      <p class="w-1/2 mt-20 text-lg leading-8 text-stone-600 sm:max-w-md lg:max-w-none">No one can make a home stand out from the rest like we can. We put in the work to get more eyes on your listing. That means with us, you're guaranteed to get the most money for your home.</p>
      <div class="mt-10 flex items-center gap-x-6 pointer-events-auto">
        <Button href="/homey/#">Get started</Button>
        <Button href="/homey/#" variant="outline">Book an appointment <span aria-hidden="true" class="ml-1">→</span></Button>
      </div>

      <!-- 		
		<h2 class="text-2xl font-bold dark:text-white md:text-7xl">
			The Ultimate <br /> placehyolder text
		</h2>
		<p class="mt-8 max-w-2xl text-base dark:text-neutral-200 md:text-xl">
			We build beautiful products with the latest technologies and frameworks. We are a team of
			passionate developers and designers that love to build amazing products.
		</p> -->
    </div>
    <Motion
      let:motion
      style={{
        rotateX,
        rotateZ,
        translateY,
        opacity,
      }}
    >
      <div use:motion>
        <Motion let:motion>
          <div use:motion class="mb-20 flex flex-row-reverse space-x-20 space-x-reverse">
            {#each firstRow as property (property.id)}
              {@render HeroCard(property, translateX)}
            {/each}
          </div>
        </Motion>
        <Motion let:motion>
          <div use:motion class="mb-20 flex flex-row space-x-20">
            {#each secondRow as property (property.id)}
              {@render HeroCard(property, translateXReverse)}
            {/each}
          </div>
        </Motion>
        <Motion let:motion>
          <div use:motion class="flex flex-row-reverse space-x-20 space-x-reverse">
            {#each thirdRow as property (property.id)}
              {@render HeroCard(property, translateX)}
            {/each}
          </div>
        </Motion>
      </div>
    </Motion>
  </div>

  <div class="w-full flex justify-center mb-36">
    <Button variant="ghost" href="/homey/#" class="text-lg font-fraunces text-stone-400 tracking-wide sm:text-xl hover:text-rose-400">...Show me more homes!</Button>
  </div>
{/snippet}

{#snippet alternateHero()}
  <div class="bg-white">
    <main>
      <div class="relative isolate">
        <svg class="absolute inset-x-0 top-0 -z-10 h-[32rem] w-full stroke-stone-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]" aria-hidden="true">
          <defs>
            <pattern id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y="-1" class="overflow-visible fill-stone-50">
            <path d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z" stroke-width="0" />
          </svg>
          <rect width="100%" height="100%" stroke-width="0" fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)" />
        </svg>
        <div class="absolute left-1/2 pointer-events-none right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:-ml-72" aria-hidden="true">
          <div class="aspect-[801/1036] w-[100rem] bg-gradient-to-right to-[#e6d9ab] from-[#a8a29e] bg-stone-400 blur-3xl opacity-20" style="clip-path: polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)"></div>
        </div>
        <div class="overflow-hidden">
          <!-- <div class="container pb-32 pt-36 sm:pt-60 lg:pt-32"> -->
          <div class="container pb-32 pt-36 sm:pt-60 lg:pt-16">
            <div class="mx-auto max-w-2xl lg:mx-0 flex flex-col md:flex-row gap-12 justify-between lg:max-w-none lg:items-center">
              <div class="relative w-full max-w-3xl lg:shrink-0">
                <h1 class="md:text-left text-center relative font-fraunces text-5xl font-normal [text-wrap:balance] tracking-tight text-stone-700 sm:text-6xl/tight">
                  We'll get you from <br /><span class="text-stone-500 font-semibold italic">“<span class="decoration-stone-400/80 underline">just listed</span>” </span>
                  to
                  <span class="absolut bottom-16 right-14 font-hand text-[11rem] md:text-[11rem]/[0] transtone-y-20 lg:transtone-y-20 md:transtone-y-6 text-stone-600 bg-gradient-to-tl md:from-stone-500/90 to-stone-700 bg-clip-text pr-10 md:text-transparent">Sold!</span>
                </h1>
                <p class="mt-20 text-lg leading-8 text-stone-600 sm:max-w-md lg:max-w-none">Cupidatat minim id magna ipsum sint dolor qui. Sunt sit in quis cupidatat mollit aute velit. Et labore commodo nulla aliqua proident mollit ullamco exercitation tempor. Sint aliqua anim nulla sunt mollit id pariatur in voluptate cillum.</p>
                <div class="mt-10 flex items-center gap-x-6">
                  <Button href="/homey/#">Get started</Button>
                  <Button href="/homey/#" variant="outline">Schedule an appointment <span aria-hidden="true" class="ml-1">→</span></Button>
                </div>
              </div>
              <div class="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                <div class="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                  <div class="relative">
                    <img src="https://themes.muffingroup.com/be/estate3/wp-content/uploads/2020/05/estate3-gallery-pic1.jpg" alt="" class="aspect-[2/3] w-full rounded-xl bg-stone-900/5 object-cover shadow-lg" />
                    <div class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-stone-900/10"></div>
                  </div>
                </div>
                <div class="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                  <div class="relative">
                    <img src="https://themes.muffingroup.com/be/estate3/wp-content/uploads/2020/05/estate3-gallery-pic2.jpg" alt="" class="aspect-[2/3] w-full rounded-xl bg-stone-900/5 object-cover shadow-lg" />
                    <div class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-stone-900/10"></div>
                  </div>
                  <div class="relative">
                    <img src="https://themes.muffingroup.com/be/estate3/wp-content/uploads/2020/05/estate3-gallery-pic3.jpg" alt="" class="aspect-[2/3] w-full rounded-xl bg-stone-900/5 object-cover shadow-lg" />
                    <div class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-stone-900/10"></div>
                  </div>
                </div>
                <div class="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                  <div class="relative">
                    <img src="https://themes.muffingroup.com/be/estate3/wp-content/uploads/2020/05/estate3-gallery-pic4.jpg" alt="" class="aspect-[2/3] w-full rounded-xl bg-stone-900/5 object-cover shadow-lg" />
                    <div class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-stone-900/10"></div>
                  </div>
                  <div class="relative">
                    <img src="https://themes.muffingroup.com/be/estate3/wp-content/uploads/2020/05/estate3-gallery-pic5.jpg" alt="" class="aspect-[2/3] w-full rounded-xl bg-stone-900/5 object-cover shadow-lg" />
                    <div class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-stone-900/10"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
{/snippet}

{#snippet testimonials()}
  <div class="relative isolate pb-32">
    <div class="absolute inset-x-0 top-1/2 -z-10 -transtone-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl" aria-hidden="true">
      <!-- from-[#ff80b5] to-[#9089fc] -->
      <div class="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr to-[#e1ca7b] from-[#c9ab98]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
    </div>
    <div class="absolute inset-x-0 top-0 -z-10 flex transform-gpu overflow-hidden pt-32 opacity-25 blur-3xl sm:pt-40 xl:justify-end" aria-hidden="true">
      <div class="ml-[-22rem] aspect-[1313/771] w-[82.0625rem] flex-none origin-top-right rotate-[30deg] bg-gradient-to-tr to-[#e1ca7b] from-[#c9ab98] xl:ml-0 xl:mr-[calc(50%-12rem)]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
    </div>
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-xl text-center">
        <h2 class="text-lg font-extrabold leading-8 uppercase tracking-wider text-rose-600">Testimonials</h2>
        <p class="mt-2 text-3xl font-bold font-fraunces tracking-tight text-stone-900 sm:text-4xl">We've worked for hundreds of amazing people</p>
      </div>
      <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-stone-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
        <figure class="rounded bg-white shadow-lg ring-1 ring-stone-900/5 sm:col-span-2 xl:col-start-2 xl:row-end-1">
          <blockquote class="p-6 text-lg font-semibold leading-7 tracking-tight text-stone-900 sm:p-12 sm:text-xl sm:leading-8">
            <p>“I thought this was a joke website at first, but I was pleasantly surprised. Once I learned that her name is actually Gebentley I chose her as my real estate agent out of pity. Boy am I sure glad I did!</p>
          </blockquote>
          <figcaption class="flex flex-wrap items-center gap-x-4 gap-y-4 border-t border-stone-900/10 px-6 py-4 sm:flex-nowrap">
            <img class="h-10 w-10 flex-none rounded-full bg-stone-50" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80" alt="" />
            <div class="flex-auto">
              <div class="font-semibold">Brenna Barn</div>
              <div class="text-stone-600">@bbarn</div>
            </div>
            <img class="h-10 w-auto flex-none" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY6XCF-4muYfuNIC0kbuAnE-ZH8E6aiux2Ivt7iDyQYNF0tveRzDF-BBVr7Aeto_P-Eg&usqp=CAU" alt="" />
          </figcaption>
        </figure>
        <div class="space-y-8 xl:contents xl:space-y-0">
          <div class="space-y-8 xl:row-span-2">
            <figure class="rounded bg-white p-6 shadow-lg ring-1 ring-stone-900/5">
              <blockquote class="text-stone-900">
                <p>"Can you please stop asking me for a review? I'll literally say whatever you want if you leave me alone."</p>
              </blockquote>
              <figcaption class="mt-6 flex items-center gap-x-4">
                <img class="h-10 w-10 rounded-full bg-stone-50" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                <div>
                  <div class="font-semibold">Leslie Alexander</div>
                  <div class="text-stone-600">@lesliealexander</div>
                </div>
              </figcaption>
            </figure>
          </div>
          <div class="space-y-8 xl:row-start-1">
            <figure class="rounded bg-white p-6 shadow-lg ring-1 ring-stone-900/5">
              <blockquote class="text-stone-900">
                <p>"Can you please stop asking me for a review? I'll literally say whatever you want if you leave me alone."</p>
              </blockquote>
              <figcaption class="mt-6 flex items-center gap-x-4">
                <img class="h-10 w-10 rounded-full bg-stone-50" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                <div>
                  <div class="font-semibold">Lindsay Walton</div>
                  <div class="text-stone-600">@lindsaywalton</div>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
        <div class="space-y-8 xl:contents xl:space-y-0">
          <div class="space-y-8 xl:row-start-1">
            <figure class="rounded bg-white p-6 shadow-lg ring-1 ring-stone-900/5">
              <blockquote class="text-stone-900">
                <p>"Can you please stop asking me for a review? I'll literally say whatever you want if you leave me alone."</p>
              </blockquote>
              <figcaption class="mt-6 flex items-center gap-x-4">
                <img class="h-10 w-10 rounded-full bg-stone-50" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                <div>
                  <div class="font-semibold">Tom Apple</div>
                  <div class="text-stone-600">@tomapple</div>
                </div>
              </figcaption>
            </figure>
          </div>
          <div class="space-y-8 xl:row-span-2">
            <figure class="rounded bg-white p-6 shadow-lg ring-1 ring-stone-900/5">
              <blockquote class="text-stone-900">
                <p>"Can you please stop asking me for a review? I'll literally say whatever you want if you leave me alone."</p>
              </blockquote>
              <figcaption class="mt-6 flex items-center gap-x-4">
                <img class="h-10 w-10 rounded-full bg-stone-50" src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                <div>
                  <div class="font-semibold">Leonard Krasner</div>
                  <div class="text-stone-600">@leonardkrasner</div>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </div>
  </div>
{/snippet}

{#snippet newsletter()}
  <div class="relative isolate overflow-hidden bg-stone-800 py-16 sm:py-24 lg:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
        <div class="max-w-xl lg:max-w-lg">
          <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl font-fraunces">Subscribe to my newsletter.</h2>
          <p class="mt-4 text-lg leading-8 text-stone-300">Get the scoop on Albany's local homebuying market including interest rate trends and forecasts—delivered straight to your inbox once per quarter.</p>
          <div class="mt-6 flex max-w-md gap-x-4">
            <label for="email-address" class="sr-only">Email address</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required class="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-rose-500 sm:text-sm sm:leading-6" placeholder="Enter your email" />
            <button type="submit" class="flex-none rounded-md bg-rose-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500">Subscribe</button>
          </div>
        </div>
        <dl class="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
          <div class="flex flex-col items-start">
            <div class="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
              </svg>
            </div>
            <dt class="mt-4 font-semibold text-white">Quarterly updates</dt>
            <dd class="mt-2 leading-7 text-stone-400">Trends & forecasts for Albany's local homebuying market.</dd>
          </div>
          <div class="flex flex-col items-start">
            <div class="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002" />
              </svg>
            </div>
            <dt class="mt-4 font-semibold text-white">No spam</dt>
            <dd class="mt-2 leading-7 text-stone-400">Unsubscribe any time, no hard feelings. See what you're missing.</dd>
          </div>
        </dl>
      </div>
    </div>
    <div class="absolute left-1/2 top-0 -z-10 -transtone-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
      <div class="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr to-[#e1ca7b] from-[#ff80b5] opacity-30" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
    </div>
  </div>
{/snippet}

{#snippet HeroCard(property, translate: MotionValue<number>)}
  <Motion
    let:motion
    style={{
      x: translate,
    }}
  >
    <!-- <div use:motion class="group/product relative h-96 w-[30rem] flex-shrink-0">
		<a href={product.link} class="block group-hover/product:shadow-2xl">
			<img
				src={product.thumbnail}
				height="600"
				width="600"
				class="absolute inset-0 h-full w-full object-cover object-left-top"
				alt={product.title}
			/>
		</a>
		<div
			class="pointer-events-none absolute inset-0 h-full w-full bg-black opacity-0 group-hover/product:opacity-80"
		></div>
		<h2 class="absolute bottom-4 left-4 text-white opacity-0 group-hover/product:opacity-100">
			{product.title}
		</h2>
	</div> -->
    <div use:motion class="group relative h-96 w-[30rem] flex-shrink-0">
      <a href="/homey/#" class="h-full block rounded-xl group-hover:shadow-2xl group-hover:translate-y-2 transition-all duration-500">
        <div class="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full">
          <div class="relative">
            <img src={property.image} alt={property.name} class="w-full h-48 object-cover" />
            <div class="px-2 flex flex-col flex-grow absolute bottom-2 right-2 ring-1 ring-white bg-white/60 backdrop-blur transition-colors shadow-xl hover:bg-white/80 rounded-full">
              <!-- stats -->
              <div class="flex items-center px-2 py-1 rounded">
                <div class="flex space-x-4 text-sm text-stone-600">
                  <span class="flex items-center">
                    <BedSingle class="w-4 h-4 mr-1" />
                    {property.bedrooms}
                  </span>
                  <span class="flex items-center">
                    <Ruler class="w-4 h-4 mr-1" />
                    {property.area}ft²
                  </span>
                  <span class="flex items-center">
                    <Bath class="w-4 h-4 mr-1" />
                    {property.bathrooms}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="p-4 flex flex-col flex-grow">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-xl font-semibold">{property.name}</h3>
            </div>
            <p class="text-stone-600 text-sm mb-2 flex-grow">{property.description}</p>
            {#if property.location}
              <p class="text-stone-500 text-xs">{property.location}</p>
            {/if}
            <div class="flex justify-between items-center mt-4">
              <div>
                <span class="text-2xl font-bold">{formatPrice(property.price)}</span>
              </div>
              <Button>See the deets <ArrowRight class="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      </a>
    </div>
  </Motion>
{/snippet}
