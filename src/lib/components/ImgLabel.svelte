<script lang="ts">
  type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right";

  type CornerConfig = {
    edge: "top" | "right" | "bottom" | "left";
    alignment: "start" | "end";
    rotation: number;
  };

  let {
    src,
    alt = "",
    color = "white",
    rounded = "xl",
    loading = "lazy",
    position = "top-left" as Position,
    class: className = "",
    children,
  } = $props<{
    src: string | (() => string);
    alt?: string;
    color?: string;
    rounded?: string;
    loading?: "eager" | "lazy";
    position?: Position;
    class?: string;
    children?: any;
  }>();

  let imgError = $state(false);

  const cornerConfigMap: Record<Position, CornerConfig[]> = {
    "top-left": [
      { edge: "bottom", alignment: "start", rotation: -90 },
      { edge: "right", alignment: "start", rotation: -90 },
    ],
    "top-right": [
      { edge: "bottom", alignment: "end", rotation: 0 },
      { edge: "left", alignment: "start", rotation: 0 },
    ],
    "bottom-left": [
      { edge: "top", alignment: "start", rotation: 180 },
      { edge: "right", alignment: "end", rotation: 180 },
    ],
    "bottom-right": [
      { edge: "top", alignment: "end", rotation: 90 },
      { edge: "left", alignment: "end", rotation: 90 },
    ],
  };

  let cornerConfigs = $derived(getCornerConfigs());

  function getCornerConfigs(): CornerConfig[] {
    return cornerConfigMap[position as Position];
  }
</script>

<div class="relative {className}" style="--color:{color}" data-error={imgError}>
  {#if imgError}
    <div class="rounded-tl-{rounded} rounded-tr-{rounded} rounded-bl-{rounded} rounded-br-{rounded} bg-gray-200 w-full h-full flex items-center justify-center">
      <span class="text-gray-500">Failed to load image</span>
    </div>
  {:else}
    <div class=" inset-shadow-sm/100 relative *:relative w-full h-full rounded-{rounded} overflow-hidden *:duration-[2000ms] *:transition-opacity">
      {#if typeof src !== "function"}
        <img
          {src}
          {alt}
          {loading}
          class="opacity-0 object-cover w-full h-full"
          onload={(e) => e.currentTarget.classList.remove("opacity-0")}
          onerror={() => {
            imgError = true;
          }}
        />
      {:else}
        {@render src()}
      {/if}
    </div>
  {/if}

  {#if !imgError}
    <div class="{position == 'top-left' || position == 'bottom-right' ? `rounded-tl-${rounded} rounded-br-${rounded} ` : `rounded-tr-${rounded} rounded-bl-${rounded} `}  label-container label-{position} label-container label-{position}" style="background-color:var(--color)">
      <div class="relative w-full h-full flex items-center justify-center">
        {@render children()}

        {#each cornerConfigs as config}
          {@render corner(config)}
        {/each}
      </div>
    </div>
  {/if}
</div>

{#snippet corner({ edge, alignment, rotation }: CornerConfig)}
  <div class="absolute size-4 {edge === 'top' && alignment === 'start' ? 'top-start -top-4 left-0' : edge === 'top' && alignment === 'end' ? 'top-end -top-4 right-0' : edge === 'right' && alignment === 'start' ? 'right-start top-0 -right-4 ' : edge === 'right' && alignment === 'end' ? 'right-end bottom-0 -right-4' : edge === 'bottom' && alignment === 'start' ? 'bottom-start -bottom-4 left-0' : edge === 'bottom' && alignment === 'end' ? 'bottom-end -bottom-4 right-0' : edge === 'left' && alignment === 'start' ? 'left-start top-0 -left-4' : '-left-4 bottom-0'}">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full" style="transform: rotate({rotation}deg)">
      <path d="M100 100 V0 H0 A100 100 0 0 1 100 100" fill="var(--color)" />
    </svg>
  </div>
{/snippet}

<style>
  @source inline("rounded-sm rounded-md rounded-lg rounded-xl rounded-2xl rounded-3xl rounded-4xl rounded-tl-xs rounded-tr-xs rounded-bl-xs rounded-br-xs rounded-tl-sm rounded-tr-sm rounded-bl-sm rounded-br-sm rounded-tl-md rounded-tr-md rounded-bl-md rounded-br-md rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-xl rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-2xl rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl rounded-br-3xl rounded-tl-4xl rounded-tr-4xl rounded-bl-4xl rounded-br-4xl");

  .label-container {
    position: absolute;
    max-width: 80%;
    width: auto;
  }

  .label-top-left {
    top: 0;
    left: 0;
  }

  .label-top-right {
    top: 0;
    right: 0;
  }

  .label-bottom-left {
    bottom: 0;
    left: 0;
  }

  .label-bottom-right {
    bottom: 0;
    right: 0;
  }
</style>
