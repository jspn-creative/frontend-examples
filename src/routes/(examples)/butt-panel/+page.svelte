<script lang="ts">
  import { Canvas } from "@threlte/core";
  import SVGPanel from "./svgbtn.svelte";
  import Scene from "./DreamyParticleScene.svelte";
  // import Scene from "./MotionBloomScene.svelte";
  // import Scene from "./GlowScene.svelte";
  import { onMount } from "svelte";
  import { innerWidth, innerHeight } from "svelte/reactivity/window";

  let isActive = $state(false);
  let isTextured = $state(false);
  let showTest = $state(false);
  let texture = $state(1);
  let pane: any = null;

  // Post processing settings
  let bloomIntensity = $state(1.3);
  let bloomThreshold = $state(0.15);
  let bloomRadius = $state(0.4);
  let exposure = $state(1);

  // Particle settings
  let particleSize = $state(0.05);
  let maxParticleSize = $state(0.25);
  let particleSpread = $state(10);
  let particleCount = $state(14500);

  let tubeRadius = $state(3);

  function toggleGlow() {
    isActive = !isActive;
  }

  function setupTweakPane() {
    import("tweakpane")
      .then(({ Pane }) => {
        const config = {
          isActive: isActive,
          isTextured: isTextured,
          showTest: showTest,
          texture: texture,
          bloomIntensity: bloomIntensity,
          bloomThreshold: bloomThreshold,
          bloomRadius: bloomRadius,
          exposure: exposure,
          particleSize: particleSize,
          particleSpread: particleSpread,
          particleCount: particleCount,
          maxParticleSize: maxParticleSize,
        };

        // Create a container div positioned lower on the screen
        const container = document.createElement("div");
        container.style.position = "fixed";
        container.style.top = "60%";
        container.style.right = "20px";
        container.style.zIndex = "1000";
        container.style.cursor = "move";
        document.body.appendChild(container);

        // Make container draggable
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        container.addEventListener("mousedown", (e) => {
          isDragging = true;
          const rect = container.getBoundingClientRect();
          dragOffset.x = e.clientX - rect.left;
          dragOffset.y = e.clientY - rect.top;
          container.style.cursor = "grabbing";
          e.preventDefault();
        });

        document.addEventListener("mousemove", (e) => {
          if (!isDragging) return;

          const x = e.clientX - dragOffset.x;
          const y = e.clientY - dragOffset.y;

          // Keep container within viewport bounds
          const maxX = window.innerWidth - container.offsetWidth;
          const maxY = window.innerHeight - container.offsetHeight;

          container.style.left = Math.max(0, Math.min(x, maxX)) + "px";
          container.style.top = Math.max(0, Math.min(y, maxY)) + "px";
          container.style.right = "auto";
        });

        document.addEventListener("mouseup", () => {
          if (isDragging) {
            isDragging = false;
            container.style.cursor = "move";
          }
        });

        pane = new Pane({
          title: "Button Effects Config",
          expanded: true,
          container: container,
        });

        pane
          .addBinding(config, "isActive", {
            label: "Glow Effect",
          })
          .on("change", (event: any) => {
            isActive = event.value;
          });

        pane
          .addBinding(config, "showTest", {
            label: "Show Test Geometry",
          })
          .on("change", (event: any) => {
            showTest = event.value;
          });

        pane
          .addBinding(config, "isTextured", {
            label: "Textured",
          })
          .on("change", (event: any) => {
            isTextured = event.value;
          });

        pane
          .addBinding(config, "texture", {
            label: "Texture",
            options: {
              "Distressed Metal": 1,
              "Corroded Metal": 2,
              "Leathery Metal": 3,
              "Streaked Metal": 4,
              "Scuffed Metal": 5,
              "Grainy Metal": 6,
              "Scratched Metal": 7,
            },
          })
          .on("change", (event: any) => {
            texture = event.value;
          });

        // Post processing folder
        const postProcessingFolder = pane.addFolder({
          title: "Post Processing",
          expanded: false,
        });

        postProcessingFolder
          .addBinding({ bloomIntensity }, "bloomIntensity", {
            label: "Bloom Intensity",
            min: 0,
            max: 3,
            step: 0.1,
          })
          .on("change", (event: any) => {
            bloomIntensity = event.value;
          });

        postProcessingFolder
          .addBinding({ bloomThreshold }, "bloomThreshold", {
            label: "Bloom Threshold",
            min: 0,
            max: 1,
            step: 0.01,
          })
          .on("change", (event: any) => {
            bloomThreshold = event.value;
          });

        postProcessingFolder
          .addBinding({ bloomRadius }, "bloomRadius", {
            label: "Bloom Radius",
            min: 0,
            max: 1,
            step: 0.01,
          })
          .on("change", (event: any) => {
            bloomRadius = event.value;
          });

        postProcessingFolder
          .addBinding({ exposure }, "exposure", {
            label: "Exposure",
            min: 0.1,
            max: 2,
            step: 0.1,
          })
          .on("change", (event: any) => {
            exposure = event.value;
          });

        // Particle controls folder
        const particleFolder = pane.addFolder({
          title: "Particle Controls",
          expanded: true,
        });

        particleFolder
          .addBinding({ particleSize }, "particleSize", {
            label: "Particle Size",
            min: 0.05,
            max: 2,
            step: 0.05,
          })
          .on("change", (event: any) => {
            particleSize = event.value;
          });

        particleFolder
          .addBinding({ maxParticleSize }, "maxParticleSize", {
            label: "Max Particle Size",
            min: 0.25,
            max: 3,
            step: 0.25,
          })
          .on("change", (event: any) => {
            maxParticleSize = event.value;
          });

        particleFolder
          .addBinding({ particleSpread }, "particleSpread", {
            label: "Particle Spread",
            min: 5,
            max: 50,
            step: 1,
          })
          .on("change", (event: any) => {
            particleSpread = event.value;
          });

        particleFolder
          .addBinding({ particleCount }, "particleCount", {
            label: "Particle Count",
            min: 1000,
            max: 15000,
            step: 500,
          })
          .on("change", (event: any) => {
            particleCount = event.value;
          });
      })
      .catch((err) => {
        console.error("Failed to load tweakpane:", err);
      });
  }

  onMount(() => {
    setupTweakPane();

    return () => {
      if (pane) {
        pane.dispose();
        // Clean up the container element
        const containers = document.querySelectorAll('div[style*="position: fixed"][style*="top: 60%"]');
        containers.forEach((container) => container.remove());
      }
    };
  });

  const glowColor = "#ff0000";

  let borderElement: HTMLDivElement;
  let borderRect = $state({ x: 0, y: 0, width: 0, height: 0 });

  // Update border position when window size or border element changes
  $effect(() => {
    const updateBorderRect = () => {
      if (borderElement && innerWidth.current && innerHeight.current) {
        const rect = borderElement.getBoundingClientRect();
        borderRect = {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        };
      }
    };

    updateBorderRect();

    const resizeObserver = new ResizeObserver(updateBorderRect);
    if (borderElement) {
      resizeObserver.observe(borderElement);
    }

    return () => {
      resizeObserver.disconnect();
    };
  });

  // $inspect(borderRect);
  $inspect(innerWidth.current);
</script>

<div class="bg-[#0E0F0D] min-h-screen flex flex-col gap-6 items-center justify-center">
  <h2 class="text-[#6A6B66] font-bold">Click the SEAS logo:</h2>
  <div class="relative max-w-full h-[80vh] aspect-[9/16]]">
    <SVGPanel {toggleGlow} isGlowing={isActive} {isTextured} {texture} />
    <div bind:this={borderElement} class="absolute inset-0 pointer-events-none">
      {#if showTest}
        <div class="absolute top-0 left-0 border border-red-500" style="width: {borderRect.width}px; height: {borderRect.height}px; ">
          <div class="p-4">
            <p><span class="font-bold">Border x:</span> {Math.round(borderRect.x)}px</p>
            <p><span class="font-bold">Border y:</span> {Math.round(borderRect.y)}px</p>
            <br />
            <p><span class="font-bold">Border w:</span> {Math.round(borderRect.width)}px</p>
            <p><span class="font-bold">Border h:</span> {Math.round(borderRect.height)}px</p>
            <br />
            <p><span class="font-bold">innerWidth:</span> {Math.round(innerWidth.current ?? 0)}px</p>
            <p><span class="font-bold">innerHeight:</span> {Math.round(innerHeight.current ?? 0)}px</p>
          </div>
        </div>
      {/if}
    </div>
    <div class="absolute -inset-10 pointer-events-none">
      <Canvas>
        {#if import.meta.env.MODE === "development"}
          {#await import("@threlte/studio") then { Studio }}
            <Studio>
              <Scene {isActive} {showTest} {glowColor} innerWidth={innerWidth.current} innerHeight={innerHeight.current} {borderRect} {bloomIntensity} {bloomThreshold} {bloomRadius} {exposure} {particleSize} {particleSpread} {particleCount} {tubeRadius} {maxParticleSize} />
            </Studio>
          {/await}
        {:else}
          <Scene {isActive} {showTest} {glowColor} innerWidth={innerWidth.current} innerHeight={innerHeight.current} {borderRect} {bloomIntensity} {bloomThreshold} {bloomRadius} {exposure} {particleSize} {particleSpread} {particleCount} {tubeRadius} {maxParticleSize} />
        {/if}
      </Canvas>
    </div>
  </div>
</div>
