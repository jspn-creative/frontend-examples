<script lang="ts">
  let text = "This is a text label.";
  let labelElement: HTMLDivElement;
  let width = $state(0);
  let height = $state(0);

  $effect(() => {
    if (labelElement) {
      width = labelElement.offsetWidth;
      height = labelElement.offsetHeight;
    }
  });
</script>

<div class="relative w-full h-full isolate z-[99999] m-4">
  <!-- Main image -->
  <div class="w-[400px] h-[600px] bg-orange-300 rounded-3xl overflow-hidden">
    <!-- Photo content would go here -->
  </div>

  <!-- Image label -->
  <div bind:this={labelElement} class="absolute bg-white top-0 left-0 w-auto rounded-br-3xl">
    <div class="relative w-full h-full flex items-center justify-center">
      <p class="text-orange-800 py-4 pl-2 pr-6">{text}</p>

      <!-- Lower lip -->
      <div class="absolute top-0 left-0 w-4 h-4" style="transform: translateY({height}px)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full -rotate-90 text-white">
          <path d="M100 100 V0 H0 A100 100 0 0 1 100 100" fill="currentColor" />
        </svg>
      </div>

      <!-- Upper lip -->
      <div class="absolute top-0 left-0 w-4 h-4 text-white" style="transform: translateX({width}px)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full rotate-90">
          <path d="M0 0 V100 H100 A100 100 0 0 1 0 0" fill="currentColor" />
        </svg>
      </div>
    </div>
  </div>
</div>
