<script lang="ts">
  let {
    src,
    alt = "",
    color = "white",
    rounded = "xl",
    loading = "lazy",
    class: className = "",
    children,
  } = $props<{
    src: string | (() => string);
    alt?: string;
    color?: string;
    rounded?: string;
    loading?: "eager" | "lazy";
    class?: string;
    children?: any;
  }>();

  let imgError = $state(false);
</script>

<div class="relative {className}" style="--color:{color}">
  <div class="relative *:relative w-full h-full rounded-{rounded} overflow-hidden">
    {@render src()}
  </div>

  <div class="rounded-tl-{rounded} rounded-br-{rounded} absolute w-auto max-w-[80%] top-0 left-0 z-10 bg-[var(--color)]">
    <div class="relative w-full h-full flex items-center justify-center">
      {@render children()}

      <div class="absolute size-2 bottom-start -bottom-2 left-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full" style="transform: rotate(-90deg)">
          <path d="M100 100 V0 H0 A100 100 0 0 1 100 100" fill="var(--color)" />
        </svg>
      </div>
      <div class="absolute size-2 right-start top-0 -right-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full" style="transform: rotate(-90deg)">
          <path d="M100 100 V0 H0 A100 100 0 0 1 100 100" fill="var(--color)" />
        </svg>
      </div>
    </div>
  </div>
</div>

<style>
  @source inline("rounded-sm rounded-md rounded-lg rounded-xl rounded-2xl rounded-3xl rounded-4xl rounded-tl-xs rounded-tr-xs rounded-bl-xs rounded-br-xs rounded-tl-sm rounded-tr-sm rounded-bl-sm rounded-br-sm rounded-tl-md rounded-tr-md rounded-bl-md rounded-br-md rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-xl rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-2xl rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl rounded-br-3xl rounded-tl-4xl rounded-tr-4xl rounded-bl-4xl rounded-br-4xl");
</style>
