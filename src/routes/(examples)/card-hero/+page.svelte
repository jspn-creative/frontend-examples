<script lang="ts">
  import SpinningText from "$lib/components/SpinningText.svelte";
  import { ArrowRight, ArrowUpRight } from "lucide-svelte";
</script>

<div class="min-h-screen bg-zinc-950 sm:bg-[#0c1414] p-4 md:p-8 flex items-center justify-center">
  <div class="bg-black min-h-[80vh] max-h-[1200px] rounded-xl sm:rounded-2xl border border-zinc-700 p-1 flex w-full max-w-7xl relative overflow-hidden">
    <!-- Left Sidebar -->
    <aside class="w-1/4 flex flex-col justify-between pt-4 px-2 md:px-4 pb-2 md:pb-8 text-white">
      <div class="text-xl sm:text-2xl md:text-3xl/7 font-bold whitespace-nowrap">
        <span class="block">jspn</span>
        <span class="block text-zinc-400">creative</span>
      </div>

      <div class="flex flex-col gap-8">
        <div class="">
          <h3 class="text-xs sm:text-sm font-semibold md:uppercase md:tracking-widest text-zinc-400 mb-2 sm:mb-4">Follow us:</h3>
          <p class="hidden md:block text-[10px] sm:text-xs text-zinc-400 mb-2 sm:mb-4">By reaching out to connect with us, you're taking the first step toward unlocking the full potential of your online presence.</p>
          <div class="flex space-x-4 text-zinc-400">
            <div class="hover:text-white bg-zinc-800 rounded-full size-6 flex items-center justify-center text-sm">in</div>
            <div class="hover:text-white bg-zinc-800 rounded-full size-6 flex items-center justify-center text-sm">f</div>
            <div class="hover:text-white bg-zinc-800 rounded-full size-6 flex items-center justify-center text-sm">ig</div>
          </div>
        </div>
        <button class="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1 md:py-2 text-sm flex items-center justify-center w-full hover:bg-zinc-700 transition-colors duration-200 group gap-2">
          <span class="">Let's Go</span>
          <span class="bg-white text-black rounded-full p-1 transform transition-transform duration-200 group-hover:translate-x-1">
            <ArrowRight class="size-3 sm:size-4" />
          </span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="w-3/4 bg-[#2E4B4B] rounded-lg sm:rounded-xl p-4 sm:p-8 flex flex-col relative overflow-hidden">
      <!-- Navigation -->
      <nav class="flex justify-between items-center mb-8 sm:mb-16">
        <ul class="flex space-x-1 md:space-x-2 items-center leading-3 text-xs md:text-sm *:px-2 *:py-1 md:*:px-5 md:*:py-2 *:rounded-full *:font-medium">
          <li class=" bg-green-300 text-black">Home</li>
          <li class=" text-green-100 hover:text-white">Services</li>
          <li class=" text-green-100 hover:text-white">Projects</li>
          <li class=" text-green-100 hover:text-white">About Us</li>
        </ul>
        <button class="px-3 sm:px-6 py-1 sm:py-2 border border-white/50 text-white rounded-full leading-3 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors duration-200"> Contact Us </button>
      </nav>

      <!-- Abstract Background Shapes -->
      <div class="absolute inset-0 z-0 overflow-hidden">
        <div class="absolute top-[-5%] left-[-10%] w-[120%] h-[60%] bg-gradient-to-br from-[#6e9a98]/50 to-[#4f7a77]/80 rounded-[100%] rotate-[-15deg] opacity-50 blur-xl"></div>
        <div class="absolute bottom-[5%] right-[5%] w-[40%] h-[50%] bg-gradient-to-tl from-[#6e9a98]/40 to-[#4f7a77]/70 rounded-[100%] rotate-[25deg] opacity-40 blur-lg"></div>
        <div class="absolute top-[20%] right-[35%] w-32 h-32 rounded-full bg-gradient-radial from-yellow-400 via-yellow-600 to-green-800 shadow-xl blur-sm"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 flex-grow flex flex-col justify-center">
        <div class="relative max-w-lg">
          <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl/16 font-bold text-white mb-2 sm:mb-4 drop-shadow-md uppercase">
            We<br />Build<br />Digital.
          </h1>
          <p class="text-sm sm:text-base text-green-100 mb-4 sm:mb-8 max-w-md">From web design and development to digital marketing strategies, we craft tailored solutions to drive your online success.</p>
          <div class="absolute top-[1rem] left-[15rem] sm:left-[20rem] size-28 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rotate-[-15deg] bg-black/20 backdrop-blur-sm">
            <SpinningText children="learn more • earn more • grow more •" radius={9}></SpinningText>
            <div class="absolute size-12 bg-white rounded-full flex items-center justify-center text-black">
              <ArrowUpRight class="size-4 sm:size-6" />
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Right Section -->
      <div class="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 z-10 bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-6 max-w-xs text-white">
        <h4 class="font-semibold mb-1 sm:mb-2 text-green-100 text-xs sm:text-base">WHAT WE DO?</h4>
        <p class="text-[10px] sm:text-xs mb-2 sm:mb-4 text-green-200">We specialize in creating dynamic digital experiences tailored to your brand's needs.</p>
        <div class="flex items-center justify-between">
          <div class="flex -space-x-2 sm:-space-x-3">
            <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 border-2 border-white/50"></div>
            <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-pink-300 to-purple-500 border-2 border-white/50"></div>
            <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-lime-300 to-emerald-500 border-2 border-white/50"></div>
          </div>
          <a href="/" class="text-[10px] sm:text-xs flex items-center text-green-200 hover:text-white">
            Connect with our experts
            <ArrowRight class="size-3 sm:size-4 ml-1" />
          </a>
        </div>
      </div>
    </main>
  </div>
</div>
