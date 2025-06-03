<script lang="ts">
  import { Canvas } from "@threlte/core";
  // import SVGPanel from "./svgbtn.svelte";
  import SVGPanel from "./butt-panel.svelte";
  import Scene from "./DreamyParticleScene.svelte";
  // import Scene from "./MotionBloomScene.svelte";
  // import Scene from "./GlowScene.svelte";
  import { onMount } from "svelte";
  import { innerWidth, innerHeight } from "svelte/reactivity/window";

  let isActive = $state(false);
  let isTextured = $state(true);
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
    // isActive = !isActive;
    isActive = false;
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
        container.style.top = "10%";
        container.style.right = "20px";
        container.style.zIndex = "1000";
        document.body.appendChild(container);

        pane = new Pane({
          title: "Effect Config",
          expanded: true,
          container: container,
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

        // Create tab for 3D settings
        const threeDTab = pane.addTab({
          pages: [{ title: "3D Settings" }],
        });

        // General 3D controls
        threeDTab.pages[0]
          .addBinding(config, "isActive", {
            label: "Glow Effect",
          })
          .on("change", (event: any) => {
            toggleGlow();
          });

        threeDTab.pages[0]
          .addBinding(config, "showTest", {
            label: "Show Test Geometry",
          })
          .on("change", (event: any) => {
            showTest = event.value;
          });

        // Post processing folder in the 3D tab
        const postProcessingFolder = threeDTab.pages[0].addFolder({
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

        // 3D Controls folder in the 3D tab
        const threeDFolder = threeDTab.pages[0].addFolder({
          title: "3D Controls",
          expanded: false,
        });

        threeDFolder
          .addBinding({ tubeRadius }, "tubeRadius", {
            label: "Tube Radius",
            min: 1,
            max: 10,
            step: 0.1,
          })
          .on("change", (event: any) => {
            tubeRadius = event.value;
          });

        // Particle controls folder in the 3D tab
        const particleFolder = threeDTab.pages[0].addFolder({
          title: "Particle Controls",
          expanded: false,
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
  <!-- <h2 class="text-[#6A6B66] font-bold">Click the SEAS logo:</h2> -->
  <div class="relative max-w-full h-[80vh] aspect-[9/16]]">
    <SVGPanel {toggleGlow} isGlowing={isActive} {isTextured} {texture} />
    <div class="@container bg-[#000] border-4 border-[#090B09] absolute top-[3%] inset-x-[15%] h-6 pointer-events-none">
      <div class="relative">
        <!-- User Avatar: -->
        <div class="@max-[250px]:scale-80 @max-[180px]:scale-50 @max-[180px]:-left-6 absolute -top-3.5 -left-3 w-10 h-11 bg-[conic-gradient(from_45deg_at_50%_50%,_#ffffff39_0%_10%,_#838483_10%_30%,_#ffffff39_30%_60%,_#838483_60%_80%,_#ffffff39_80%_100%)] [clip-path:shape(from_50%_0%,_line_to_100%_30%,_line_to_100%_70%,_line_to_50%_100%,_line_to_0%_70%,_line_to_0%_30%,_close)] flex items-center justify-center">
          <div class="bg-gradient-to-br w-[2.35rem] h-[2.6rem] from-[#121412] to-[#191D1A] [clip-path:shape(from_50%_0%,_line_to_100%_30%,_line_to_100%_70%,_line_to_50%_100%,_line_to_0%_70%,_line_to_0%_30%,_close)] flex items-center justify-center">
            <span class="text-[#838483] text-xs font-bold">JS</span>
          </div>
        </div>

        <!-- Alert Button: -->
        <div class="@max-[250px]:scale-80 @max-[180px]:scale-50 @max-[180px]:-right-6 absolute -top-3.5 -right-3 w-10 h-11 bg-[conic-gradient(#ffffff39_0%_10%,_#838483_10%_30%,_#ffffff39_30%_60%,_#838483_60%_80%,_#ffffff39_80%_100%)] [clip-path:shape(from_50%_0%,_line_to_100%_30%,_line_to_100%_70%,_line_to_50%_100%,_line_to_0%_70%,_line_to_0%_30%,_close)] flex items-center justify-center">
          <div class="bg-gradient-to-br w-[2.35rem] h-[2.6rem] from-[#121412] to-[#191D1A] [clip-path:shape(from_50%_0%,_line_to_100%_30%,_line_to_100%_70%,_line_to_50%_100%,_line_to_0%_70%,_line_to_0%_30%,_close)] flex items-center justify-center">
            <svg class="w-4 h-4 text-[#838483]" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <!-- Notification badge -->
          <div class="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
            <span class="text-[8px] text-red-500 font-bold">3</span>
          </div>
        </div>
      </div>
    </div>
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
