<script lang="ts">
  import { Motion, useTransform, AnimatePresence, useMotionValue, useSpring } from "svelte-motion";

  export let items: {
    id: number;
    name: string;
    designation: string;
    image: string;
  }[];

  let hoveredIndex: number | null = null;
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0); // going to set this value on mouse move
  // rotate the tooltip
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig);
  // translate the tooltip
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig);
  const handleMouseMove = (event: MouseEvent) => {
    // @ts-ignore
    const halfWidth = event.target?.offsetWidth / 2;
    x.set(event.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
  };
</script>

<!-- <div class="flex justify-center items-center w-full -mr-2"> -->
<div class="group flex flex-row mr-3">
  {#each items as item, idx (item.name)}
    <div class="relative -mr-2 flex-none" role="presentation" onmouseenter={() => (hoveredIndex = item.id)} onmouseleave={() => (hoveredIndex = null)}>
      <AnimatePresence show={true}>
        {#if hoveredIndex === item.id}
          <Motion
            let:motion
            initial={{ opacity: 0, y: 20, scale: 0.6 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 10,
              },
            }}
            exit={{ opacity: 0, y: 20, scale: 0.6 }}
            style={{
              translateX: translateX,
              rotate: rotate,
              whiteSpace: "nowrap",
            }}
          >
            <div use:motion class="absolute -left-1/2 -top-16 z-50 flex translate-x-1/2 flex-col items-center justify-center rounded-md bg-secondary-foreground/50 backdrop-blur-sm px-4 py-2 text-xs shadow-xl">
              <div class="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
              <div class="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent"></div>
              <div class="relative z-30 whitespace-nowrap text-base font-bold text-secondary text-shadow-lg/100 text-shadow-secondary-foreground">
                {item.name}
              </div>
              <div class="whitespace-nowrap text-xs text-accent">{item.designation}</div>
            </div>
          </Motion>
        {/if}
      </AnimatePresence>
      <img onmousemove={handleMouseMove} height={100} width={100} src={item.image} alt={item.name} class="relative !m-0 size-8 rounded-full border-2 border-accent object-cover object-top !p-0 transition duration-500 group-hover:z-30 group-hover:scale-105 inset-shadow-sm/50" />
    </div>
  {/each}
</div>
<!-- </div> -->
