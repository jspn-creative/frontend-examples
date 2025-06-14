<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
  import { HTML, MeshDiscardMaterial, OrbitControls, Resize, ImageMaterial } from "@threlte/extras";
  import { Vector2, Vector4, Clock, HalfFloatType, DoubleSide } from "three";
  import { buttPanelState } from "./buttPanelState.svelte";
  import type { GlitchEffectState } from "./sceneStates";
  import { innerWidth, innerHeight } from "svelte/reactivity/window";
  import { EffectComposer, GlitchEffect, EffectPass, RenderPass, GlitchMode, ChromaticAberrationEffect } from "postprocessing";
  import { onMount } from "svelte";
  import SVGPanel from "./butt-panel.svelte";
  import buttpanel from "$lib/images/buttpanel.png";

  const isActive = $derived(buttPanelState.isActive);
  const showTest = $derived(buttPanelState.showTest);
  const borderRect = $derived(buttPanelState.borderRect);
  const debug = $derived(buttPanelState.debug);
  const glowColor = $derived(buttPanelState.glowColor);

  let animatedOpacity = $state(0);
  let timeouts: number[] = [];

  const clearFlickerTimeouts = () => {
    timeouts.forEach(clearTimeout);
    timeouts = [];
  };

  const currentSceneState = $derived(buttPanelState.currentSceneState as unknown as GlitchEffectState);

  const planeSize = $derived([innerWidth.current, innerHeight.current]);

  const { renderer, scene, camera, size, renderStage, autoRender } = useThrelte();

  let composer: EffectComposer | undefined = undefined;
  let glitchEffect: GlitchEffect | undefined = undefined;

  function setupPostProcessing() {
    if (!renderer || !scene || !camera?.current) return;

    if (composer) {
      composer.dispose();
    }

    composer = new EffectComposer(renderer, { frameBufferType: HalfFloatType });
    composer.addPass(new RenderPass(scene, camera.current));
    const chromaticAberrationEffect = new ChromaticAberrationEffect();

    glitchEffect = new GlitchEffect({
      chromaticAberrationOffset: chromaticAberrationEffect.offset,
      delay: new Vector2(...currentSceneState.delay),
      duration: new Vector2(...currentSceneState.duration),
      strength: new Vector2(...currentSceneState.strength),
      // perturbationMap: new Texture(), // Provide a Texture if needed
      dtSize: currentSceneState.dtSize,
      columns: currentSceneState.columns,
      ratio: currentSceneState.ratio,
    });
    glitchEffect.mode = GlitchMode.SPORADIC;
    composer.addPass(new EffectPass(camera.current, glitchEffect));
    composer.addPass(new EffectPass(camera.current, chromaticAberrationEffect));
  }

  onMount(() => {
    animatedOpacity = isActive ? 1 : 0;
    let originalAutoRender: boolean;

    const unsubscribe = autoRender.subscribe((value) => {
      if (originalAutoRender === undefined) {
        originalAutoRender = value;
      }
    });

    return () => {
      unsubscribe();
      if (originalAutoRender !== undefined) {
        autoRender.set(originalAutoRender);
      }
      clearFlickerTimeouts();
    };
  });

  $effect(() => {
    if (composer && innerWidth.current && innerHeight.current) {
      composer.setSize(innerWidth.current, innerHeight.current);
    }
  });

  $effect(() => {
    if (isActive) {
      if (renderer && scene && camera?.current) {
        autoRender.set(false);
        setupPostProcessing();
      }
    }
  });

  $effect(() => {
    if (!isActive) {
      autoRender.set(true);
      if (composer) {
        composer.dispose();
        composer = undefined;
      }
      glitchEffect = undefined;
    }
  });

  $effect(() => {
    clearFlickerTimeouts();

    if (isActive) {
      animatedOpacity = 0;
      timeouts.push(window.setTimeout(() => (animatedOpacity = 1), 10));
      timeouts.push(window.setTimeout(() => (animatedOpacity = 0), 80));
      timeouts.push(window.setTimeout(() => (animatedOpacity = 1), 450));
      timeouts.push(window.setTimeout(() => (animatedOpacity = 0), 520));
      timeouts.push(window.setTimeout(() => (animatedOpacity = 1), 550));
    }
  });

  useTask(
    (delta: number) => {
      if (composer) {
        composer.render(delta);
      }
    },
    { stage: renderStage, autoInvalidate: false }
  );
</script>

<T.OrthographicCamera makeDefault position={[0, 0, 100]}>
  {#if debug}
    <OrbitControls enableZoom />
  {/if}
</T.OrthographicCamera>

{#if showTest}
  <T.Mesh name="Test">
    <T.BoxGeometry args={[innerWidth.current ?? 800, innerHeight.current ?? 600, 1]} />
    <T.MeshBasicMaterial color="hotpink" opacity={0.25} transparent />
  </T.Mesh>
{/if}

{#if isActive}
  <T.Mesh name="GlitchEffect" position={[0, 0, -1]}>
    <T.PlaneGeometry args={planeSize} />
    <ImageMaterial
      transparent
      side={DoubleSide}
      url={buttpanel}
      zoom={0.43}
      opacity={animatedOpacity}
      onpointerenter={() => {
        console.log("pointer entered");
      }}
    />

    <!-- <MeshDiscardMaterial /> -->
    <!-- <HTML transform pointerEvents="none" autoRender={true}>
    <div style="width:{borderRect.width}px; height:{borderRect.height}px;" class="rounded-2xl border border-green-600 drop-shadow-lg bg-green-500/50">
      <SVGPanel toggleGlow={buttPanelState.toggleGlow} isGlowing={buttPanelState.isActive} isTextured={buttPanelState.isTextured} texture={buttPanelState.texture} {glowColor} />
    </div>
  </HTML> -->
  </T.Mesh>
{/if}
