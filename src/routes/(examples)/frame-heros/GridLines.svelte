<script lang="ts">
  let { startingOffsets = [0, 0, 0, 0, 0] } = $props<{
    startingOffsets?: number[];
  }>();
</script>

<div aria-hidden="true" class="*:col-end-[span_4] grid-container BackgroundGrid_backgroundGrid__oXHXt grid-cols z-10">
  {#each Array(5) as _, i}
    {@const offset = startingOffsets[i]}
    <div class="{offset > 1 ? 'bg-[linear-gradient(to_bottom,transparent_var(--col-border-start-offset),--alpha(var(--color)/var(--line-opacity))_240px)]' : 'bg-white/12'} grid-col" style="--col-border-start-offset:{offset}px; --color:var(--color-white); --line-opacity:12%"></div>
  {/each}
</div>

<style>
  .grid-container {
    --gutter-h: 4rem;
    --gutter-v: 4rem;
    position: absolute;
    top: 0;
    left: calc(var(--gutter-h));
    width: calc(100% - var(--gutter-h) * 2);
    height: 100%;
    box-sizing: border-box;
    pointer-events: none;
    user-select: none;
    display: grid;
    grid-template-columns: repeat(16, 1fr);
    gap: 0;
    display: grid;
  }

  .grid-col:first-of-type {
    grid-area: 1/1/1/1;
  }

  .grid-col:nth-of-type(2) {
    grid-area: 1/5/1/9;
  }

  .grid-col:nth-of-type(3) {
    grid-area: 1/9/1/13;
  }

  .grid-col:nth-of-type(4) {
    grid-area: 1/13/1/17;
  }

  .grid-col {
    @apply w-px;
    /* width: 10px; */
    /* background-color: var(--theme-border-color); */
  }

  .grid-col:nth-of-type(5) {
    grid-area: 1/17/1/17;
  }

  * {
    box-sizing: border-box;
  }

  @media (max-width: 1600px) {
    .grid-col {
      grid-template-columns: repeat(16, 1fr);
    }
  }

  @media (max-width: 400px) {
    .grid-col {
      grid-template-columns: repeat(8, 1fr);
    }
  }

  @media (max-width: 768px) {
    .grid-col {
      grid-template-columns: repeat(8, 1fr);
    }

    .grid-col:nth-of-type(2) {
      display: none;
    }
  }

  @media (max-width: 1024px) {
    .grid-col {
      grid-template-columns: repeat(8, 1fr);
    }

    .grid-col:nth-of-type(3),
    .grid-col:nth-of-type(4) {
      display: none;
    }
  }
</style>
