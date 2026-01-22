<script lang="ts">
  import { Canvas } from "@threlte/core";
  import { Grid } from "@threlte/extras";
  import SVGPanel from "./butt-panel.svelte";
  import ParticleTubeScene from "./ParticleTubeScene.svelte";
  import GlowEffectScene from "./GlowEffectScene.svelte";
  import FireEffectScene from "./FireEffectScene.svelte";
  import GlitchEffectScene from "./GlitchEffectScene.svelte";
  import RainbowEffectScene from "./RainbowEffectScene.svelte";
  import InnerGlowEffectScene from "./InnerGlowEffectScene.svelte";
  import { innerWidth, innerHeight } from "svelte/reactivity/window";
  import { ThemeUtils, IntervalSlider, Pane, Checkbox, List, TabGroup, TabPage, Folder, Slider, Button, Separator, Color, RadioGrid } from "svelte-tweakpane-ui";

  import { buttPanelState, sceneOptions, textureOptions, overlayOptions } from "./buttPanelState.svelte";
  import { onMount } from "svelte";

  const sceneComponents = [ParticleTubeScene, GlowEffectScene, FireEffectScene, GlitchEffectScene, RainbowEffectScene, InnerGlowEffectScene];
  const Scene = $derived(sceneComponents[buttPanelState.selectedScene]);
  const currentSceneState = $derived(buttPanelState.currentSceneState);
  const debug = $derived(buttPanelState.debug);
  let glowColor = $derived(buttPanelState.glowColor);
  const overlay = $derived(buttPanelState.overlay);
  const hasOverlay = $derived(buttPanelState.hasOverlay);

  let borderElement: HTMLDivElement;

  onMount(() => {
    ThemeUtils.setGlobalDefaultTheme(ThemeUtils.presets.translucent);
  });

  $effect(() => {
    const updateBorderRect = () => {
      if (borderElement && innerWidth.current && innerHeight.current) {
        const rect = borderElement.getBoundingClientRect();
        buttPanelState.updateBorderRect({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
          innerWidth: innerWidth.current,
          innerHeight: innerHeight.current,
        });
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

  function handleSceneChange(value: number) {
    buttPanelState.updateSelectedScene(value);
  }

  const uiConfig = $derived(currentSceneState.getUIConfig());

  class SecuritySystem {
    keyStatus = $state<"disconnected" | "connecting" | "connected">("disconnected");
    protocolStatus = $state<"inactive" | "active">("inactive");
    connectionProgress = $state(0);

    get keyButtonText() {
      if (this.keyStatus === "connecting") return "Connecting...";
      if (this.keyStatus === "connected") return "Disconnect Security Key";
      return "Connect Security Key";
    }

    get protocolButtonText() {
      if (this.protocolStatus === "active") return "Disable Security Protocol";
      return "Initiate Security Protocol";
    }

    get keyButtonDisabled() {
      return this.keyStatus === "connecting";
    }

    get keyStatusText() {
      if (this.keyStatus === "connected") return "Connected";
      if (this.keyStatus === "connecting") return "Connecting...";
      return "Disconnected";
    }

    get keyStatusColor() {
      if (this.keyStatus === "connected") return "text-green-400";
      if (this.keyStatus === "connecting") return "text-blue-400";
      return "text-yellow-400";
    }

    get protocolStatusText() {
      return this.protocolStatus === "active" ? "Active" : "Inactive";
    }

    get protocolStatusColor() {
      return this.protocolStatus === "active" ? "text-green-400" : "text-red-400";
    }

    get statusLightColors() {
      let firstLight = "bg-yellow-500";
      if (this.keyStatus === "connecting") {
        firstLight = "bg-blue-500";
      } else if (this.keyStatus === "connected") {
        firstLight = "bg-green-500";
      }

      const secondLight = this.protocolStatus === "active" ? "bg-green-500" : "bg-red-500";

      return [firstLight, secondLight];
    }

    get protocolButtonDisabled() {
      return false;
    }

    async connectKey() {
      if (this.keyStatus === "connected") {
        this.keyStatus = "disconnected";
        this.protocolStatus = "inactive";
        this.connectionProgress = 0;
        buttPanelState.hasOverlay = false;
        buttPanelState.isActive = false;
        return;
      }

      this.keyStatus = "connecting";
      this.connectionProgress = 0;
      buttPanelState.isActive = true;

      const duration = 2000;
      const startTime = Date.now();

      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);
        this.connectionProgress = progress;

        if (progress < 100) {
          requestAnimationFrame(updateProgress);
        }
      };

      requestAnimationFrame(updateProgress);

      await new Promise((resolve) => setTimeout(resolve, duration));

      this.keyStatus = "connected";
      buttPanelState.overlay = 1;
      buttPanelState.hasOverlay = true;
    }

    toggleProtocol() {
      this.protocolStatus = this.protocolStatus === "active" ? "inactive" : "active";

      this.protocolStatus === "active" ? (buttPanelState.overlay = 0) : (buttPanelState.overlay = 1);
    }
  }

  const securitySystem = new SecuritySystem();

  // Combined toggle function for SVGPanel button
  function combinedToggle() {
    buttPanelState.toggleGlow();
    securitySystem.toggleProtocol();
  }
</script>

<!-- Tweakpane UI -->
<Pane position="draggable" title="Effect Config" expanded={(innerWidth.current ?? 0) > 800} x={innerWidth.current ?? 1200} padding="5rem 40px" width={370} theme={ThemeUtils.presets.translucent}>
  <!-- Global Controls -->
  <Checkbox bind:value={buttPanelState.isTextured} label="Textured" />
  {#if buttPanelState.isTextured}
    <List bind:value={buttPanelState.texture} label="Texture" options={textureOptions} />
  {/if}
  <Checkbox bind:value={buttPanelState.isActive} label="Glow Effect" />
  {#if buttPanelState.isActive}
    <List value={buttPanelState.selectedScene} on:change={(e) => handleSceneChange(e.detail.value as number)} label="Effect Type" options={sceneOptions} />
  {/if}
  <Checkbox bind:value={buttPanelState.hasOverlay} label="Enable Overlay" />
  {#if buttPanelState.hasOverlay}
    <List bind:value={buttPanelState.overlay} label="Overlay Color" options={overlayOptions} />
  {/if}

  <Separator />
  <Folder title="Global Settings" expanded={false}>
    <Checkbox bind:value={buttPanelState.showTest} label="Show Test Geometry" />
    <Checkbox bind:value={buttPanelState.debug} label="Debug" />
  </Folder>

  <Separator />

  <Folder title="{Object.keys(sceneOptions)[buttPanelState.selectedScene]} — Scene Settings" expanded={false}>
    {#each uiConfig.folders as folder}
      <Folder title={folder.title} expanded={folder.expanded}>
        {#each folder.controls as control}
          {#if control.type === "slider"}
            {@const state = currentSceneState as unknown as Record<string, number>}
            <Slider bind:value={state[control.key]} label={control.label} min={control.min} max={control.max} step={control.step} />
          {:else if control.type === "checkbox"}
            {@const state = currentSceneState as unknown as Record<string, boolean>}
            <Checkbox bind:value={state[control.key]} label={control.label} />
          {:else if control.type === "color"}
            {@const state = currentSceneState as unknown as Record<string, string>}
            <Color bind:value={state[control.key]} label={control.label} />
          {:else if control.type === "intervalSlider"}
            {@const state = currentSceneState as unknown as Record<string, [number, number]>}
            <IntervalSlider bind:value={state[control.key]} label={control.label} min={control.min} max={control.max} step={control.step} />
          {:else if control.type === "list"}
            {@const state = currentSceneState as unknown as Record<string, number>}
            {@const listControl = control as typeof control & { options: any[] }}
            <List bind:value={state[control.key]} label={control.label} options={listControl.options} />
          {:else if control.type === "radiogrid"}
            {@const state = currentSceneState as unknown as Record<string, string>}
            {@const radioGridControl = control as typeof control & { values: string[]; columns: number }}
            <RadioGrid bind:value={state[control.key]} label={control.label} values={radioGridControl.values} columns={radioGridControl.columns} />
          {/if}
        {/each}
      </Folder>
    {/each}
  </Folder>

  <Separator />

  <Button title="Reset Scene Settings" on:click={() => currentSceneState.resetToDefaults()} />
</Pane>

<div class="bg-[#0E0F0D] min-h-screen flex flex-col gap-6 items-center justify-center">
  {@render gridOverlay()}
  {@render dataPanel()}
  {@render controlPanel()}

  <div class="relative max-w-full h-[80vh] aspect-[9/16]]">
    <SVGPanel toggleGlow={combinedToggle} isGlowing={buttPanelState.isActive} isTextured={buttPanelState.isTextured} texture={buttPanelState.texture} {glowColor} {overlay} {hasOverlay} />
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
      {#if buttPanelState.showTest}
        <div class="absolute top-0 left-0 border border-red-500" style="width: {buttPanelState.borderRect.width}px; height: {buttPanelState.borderRect.height}px; ">
          <div class="p-4">
            <p><span class="font-bold">Border x:</span> {Math.round(buttPanelState.borderRect.x)}px</p>
            <p><span class="font-bold">Border y:</span> {Math.round(buttPanelState.borderRect.y)}px</p>
            <br />
            <p><span class="font-bold">Border w:</span> {Math.round(buttPanelState.borderRect.width)}px</p>
            <p><span class="font-bold">Border h:</span> {Math.round(buttPanelState.borderRect.height)}px</p>
            <br />
            <p><span class="font-bold">innerWidth:</span> {Math.round(innerWidth.current ?? 0)}px</p>
            <p><span class="font-bold">innerHeight:</span> {Math.round(innerHeight.current ?? 0)}px</p>
          </div>
        </div>
      {/if}
    </div>
    <div class="absolute -inset-10 {debug ? '' : 'pointer-events-none'}">
      <!-- <Canvas renderMode="always" createRenderer={() => new WebGLRenderer({ powerPreference: "high-performance", antialias: false, stencil: false, depth: false })}> -->
      <Canvas renderMode="always">
        {#if import.meta.env.MODE === "developmentaaa"}
          {#await import("@threlte/studio") then { Studio }}
            <Studio>
              <Grid position={[0, -0.2, 0]} infiniteGrid backgroundColor={"#161815"} backgroundOpacity={1} cellColor={"#242623"} sectionColor={"#242623"} />
              <Scene />
            </Studio>
          {/await}
        {:else}
          <Scene />
        {/if}
      </Canvas>
    </div>
  </div>
</div>

{#snippet dataPanel()}
  <div class="hidden md:block fixed bottom-20 left-10 w-72 bg-black/10 border border-gray-100/30 rounded z-20 pointer-events-auto">
    <div class="p-4">
      <div class="flex items-center justify-between mb-3">
        <span class="text-neutral-100 text-sm font-mono uppercase tracking-wider">System Metrics</span>
        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>

      <!-- Data Readouts -->
      <div class="space-y-2 text-xs font-mono uppercase">
        <div class="flex justify-between">
          <span class="text-neutral-400">Render Mode:</span>
          <span class="text-white">WebGL</span>
        </div>
        <div class="flex justify-between">
          <span class="text-neutral-400">Viewport Size:</span>
          <span class="text-white">{Math.round(buttPanelState.borderRect.innerWidth)}×{Math.round(buttPanelState.borderRect.innerHeight)}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-neutral-400">Render Target:</span>
          <span class="text-white">{Math.round(buttPanelState.borderRect.width)}×{Math.round(buttPanelState.borderRect.height)}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-neutral-400">Effect Name:</span>
          <div class="flex gap-2">
            <span class="text-white">{Object.keys(sceneOptions)[buttPanelState.selectedScene]}</span>
            <span class="px-1.5 py-0.5 bg-white/10 text-white text-[10px] font-mono rounded">#{buttPanelState.selectedScene + 1}</span>
          </div>
        </div>
        <div class="flex justify-between">
          <span class="text-neutral-400">Effect Status:</span>
          <span class="{buttPanelState.isActive ? 'text-green-400' : 'text-yellow-400'} uppercase">{buttPanelState.isActive ? "Active" : "Standby"}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-neutral-400">Overlay Status:</span>
          <span class="{buttPanelState.hasOverlay ? 'text-green-400' : 'text-yellow-400'} uppercase">{buttPanelState.hasOverlay ? "Enabled" : "Disabled"}</span>
        </div>
      </div>
    </div>
  </div>
{/snippet}

{#snippet controlPanel()}
  <div class="hidden md:block fixed bottom-20 right-10 w-72 bg-black/10 border border-gray-100/30 rounded z-20 pointer-events-auto">
    <div class="p-4">
      <div class="flex items-center justify-between mb-4">
        <span class="text-neutral-100 text-sm font-mono uppercase tracking-wider">Security Controls</span>
        <div class="flex space-x-1">
          <div class="w-1.5 h-1.5 {securitySystem.statusLightColors[0]} rounded-full animate-pulse"></div>
          <div class="w-1.5 h-1.5 {securitySystem.statusLightColors[1]} rounded-full animate-pulse" style="animation-delay: 0.5s;"></div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="h-1.5 bg-white/10 rounded-full mb-4">
        <div class="h-full bg-gray-100 rounded-full animate-pulse" style="width: {securitySystem.connectionProgress}%;"></div>
      </div>

      <!-- Control Buttons -->
      <div class="space-y-3">
        <button class="w-full px-4 py-3 bg-white/5 border border-gray-100/20 rounded text-neutral-100 font-mono text-xs uppercase tracking-wide transition-all duration-200 active:scale-[0.98] {securitySystem.keyButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 hover:border-gray-100/40'}" onclick={() => securitySystem.connectKey()} disabled={securitySystem.keyButtonDisabled}>
          {securitySystem.keyButtonText}
        </button>

        <button class="w-full px-4 py-3 bg-white/5 border border-gray-100/20 rounded text-neutral-100 font-mono text-xs uppercase tracking-wide transition-all duration-200 active:scale-[0.98] {securitySystem.protocolButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 hover:border-gray-100/40'}" onclick={() => securitySystem.toggleProtocol()} disabled={securitySystem.protocolButtonDisabled}>
          {securitySystem.protocolButtonText}
        </button>

        <!-- Status indicators -->
        <div class="pt-2 border-t border-gray-100/10">
          <div class="flex justify-between text-xs font-mono uppercase">
            <span class="text-neutral-400">Key Status:</span>
            <span class={securitySystem.keyStatusColor}>{securitySystem.keyStatusText}</span>
          </div>
          <div class="flex justify-between text-xs font-mono uppercase mt-1">
            <span class="text-neutral-400">Protocol:</span>
            <span class={securitySystem.protocolStatusColor}>{securitySystem.protocolStatusText}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
{/snippet}

{#snippet gridOverlay()}
  <div class="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:40px_40px]"></div>
{/snippet}
