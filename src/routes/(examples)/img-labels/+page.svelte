<script lang="ts">
  import { scramble } from "$lib/actions/scramble";
  import ImgLabel from "$lib/components/ImgLabel.svelte";
  import TooltipAvatars from "$lib/components/ui/tooltipAvatars/tooltipAvatars.svelte";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  const people = [
    {
      id: 1,
      name: "Robert Johnson",
      designation: "Product Manager",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },

    {
      id: 2,
      name: "Emily Davis",
      designation: "UX Designer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },

    {
      id: 3,
      name: "Dora",
      designation: "The Explorer",
      image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
    },
  ];

  const sampleTexts = ["What if?", "Who is this?", "When did I say that?", "Where is it?", "Now why did I do that?"];
  const longerSampleTexts = ["What if?", "What if you never knew, but, like, you really wanted to know?", "Who is this person to you? Your dad or your girlfriend?", "When did I say that? Oh, yeah... Venezuela. I thought I had forgotten that part of my life forever.", "Where is that thing you lost? No, I'm talking about your dignity you low-down bastard.", "Now why did I do that? I don't know, but I'm sure it was for the an excellent reason."];
</script>

<div class="bg-secondary-foreground min-h-screen min-w-screen p-4">
  <div class="grid grid-cols-3 gap-4 grid-flow-row-dense">
    <!-- Original example -->
    <!-- <div class="relative h-screen w-screen p-4 bg-neutral-600" style="--lips:var(--color-neutral-600)">

    <img src="https://framerusercontent.com/images/yzpRxn2HI5TBopZVeE1K1WuVA.jpg" alt="" class="object-cover max-h-full rounded-3xl" />

    <div class="absolute bg-neutral-600 top-4 left-4 w-auto rounded-br-3xl">
      <div class="relative w-full h-full flex items-center justify-center">
        <p class="text-white py-4 pl-2 pr-6 text-xl">

          <span use:scramble={{ texts: longerSampleTexts, interval: 3000, scrambleTime: 50 }}> Loading... </span>
        </p>


        <div class="absolute -bottom-4 left-0 size-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full -rotate-90">
            <path d="M100 100 V0 H0 A100 100 0 0 1 100 100" fill="var(--lips)" />
          </svg>
        </div>


        <div class="absolute -right-4 top-0 size-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full rotate-90">
            <path d="M0 0 V100 H100 A100 100 0 0 1 0 0" fill="var(--lips)" />
          </svg>
        </div>
      </div>
    </div>
  </div> -->

    <ImgLabel src="https://framerusercontent.com/images/yzpRxn2HI5TBopZVeE1K1WuVA.jpg" position="top-right" color="var(--color-secondary-foreground)" class="h-[25rem] row-span-2">
      <p class="text-secondary text-xl py-4 pr-2 pl-6 text-x">
        <span use:scramble={{ texts: longerSampleTexts, interval: 3000, scrambleTime: 50 }}> Loading... </span>
      </p>
    </ImgLabel>
    <ImgLabel rounded="4xl" src="https://framerusercontent.com/images/rQXeeWMbrXXzxko63WI4Z1ZVIk.jpg" position="bottom-left" color="var(--color-secondary-foreground)" class="h-48">
      <!-- Stacked avatars -->
      <!-- {#each people as person}
        <Avatar.Root class="-ml-2">
          <Avatar.Image src={person.image} alt={person.name} />
          <Avatar.Fallback>CN</Avatar.Fallback>
        </Avatar.Root>
      {/each} -->

      <div class="h-full w-full flex items-center gap-2 justify-center p-4">
        <div class=" flex flex-col text-xs/3 items-end font-medium text-secondary">
          <p>Top rated</p>
          <p class="text-accent font-bold text-base/5">agents:</p>
        </div>
        <TooltipAvatars items={people} />
      </div>
    </ImgLabel>

    <ImgLabel position="bottom-right" color="var(--color-secondary-foreground)" class="row-span-2 h-[25rem]">
      <p class="text-secondary py-4 pr-2 pl-6 text-xl">
        <span use:scramble={{ texts: sampleTexts, interval: 3000, scrambleTime: 50 }}> Loading... </span>
      </p>
      {#snippet src()}
        <video class="max-w-full object-cover h-[25rem] opacity-0" onloadeddata={(e) => e.currentTarget.classList.remove("opacity-0")} autoplay loop muted playsinline src="https://l4wlsi8vxy8hre4v.public.blob.vercel-storage.com/video/glass-animation-5-f0gPcjmKFIV3ot5MGOdNy2r4QHBoXt.mp4"></video>
      {/snippet}
    </ImgLabel>

    <ImgLabel src="https://framerusercontent.com/images/RQA2wDd4pBGiWeZ2ktDtcszRbrM.jpg?scale-down-to=1024" position="bottom-right" color="var(--color-secondary-foreground)" class="h-48">
      <p class="text-secondary py-4 pr-2 pl-6 text-xl">
        <span use:scramble={{ texts: sampleTexts, interval: 3000, scrambleTime: 50 }}> Loading... </span>
      </p>
    </ImgLabel>
  </div>
</div>
