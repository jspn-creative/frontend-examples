<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import { OrbitControls } from "@threlte/extras";
  import { Vector2, Vector3, Clock } from "three";
  import { buttPanelState } from "./buttPanelState.svelte";
  import type { RainbowEffectState } from "./sceneStates";
  import { innerWidth, innerHeight } from "svelte/reactivity/window";

  const clock = new Clock();

  const isActive = $derived(buttPanelState.isActive);
  const showTest = $derived(buttPanelState.showTest);
  const borderRect = $derived(buttPanelState.borderRect);
  const debug = $derived(buttPanelState.debug);

  let animatedAlpha = $state(0);

  const currentSceneState = $derived(buttPanelState.currentSceneState as RainbowEffectState);

  const planeSize = $derived([innerWidth.current, innerHeight.current]);

  const uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new Vector2() },
    uAnimationSpeed: { value: 0 },
    uColorIntensity: { value: 0 },
    uBrightness: { value: 0 },
    uEdgeThickness: { value: 0 },
    uColorPhase: { value: new Vector3() },
    uColorMask: { value: new Vector3(1.0, 1.0, 1.0) },
    uBorderRect: { value: new Vector2() },
    uCornerRadius: { value: 0 },
    uAspectRatio: { value: 1.0 },
    uMasterAlpha: { value: 0.0 },
  };

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform float uCornerRadius;
    uniform float uAnimationSpeed;
    uniform float uColorIntensity;
    uniform float uBrightness;
    uniform float uEdgeThickness;
    uniform vec3 uColorPhase;
    uniform vec3 uColorMask;
    uniform float uMasterAlpha;
    varying vec2 vUv;
    #define BOX_SIZE        vec2(0.45, 0.8)
    #define BG_COLOR        vec3(0.0)

    // Signed Distance Function for a Rounded Rectangle
    float sdRoundedBox( in vec2 p, in vec2 b, in float r )
    {
      vec2 q = abs(p)-b+r;
      return length(max(q,0.0)) + min(max(q.x,q.y),0.0) - r;
    }

    void main() {
      vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
      
      // Calculate the distance to the surface of the rounded rectangle
      float sdfDist = sdRoundedBox(uv, BOX_SIZE, uCornerRadius);
      
      // The core coloring and tonemapping logic
      vec4 colorWave = vec4(uColorPhase, 0.0) + uv.x + uTime * uAnimationSpeed;
      
      // Apply color mask to constrain certain channels
      vec3 rawSin = sin(colorWave.rgb);
      vec3 maskedColor = rawSin * uColorMask + (1.0 - uColorMask) * (-0.8);
      
      // The denominator uses '-sdfDist' because sdfDist is negative inside the shape
      vec4 value = (uBrightness + vec4(maskedColor, rawSin.r)) * uColorIntensity / ((-sdfDist / uEdgeThickness) + 0.0001);
      
      // Check if we're outside the shape
      if (sdfDist > 0.0) {
        gl_FragColor = vec4(BG_COLOR, 0.0); // Transparent outside
      } else {
        // Apply tanh tonemapping to the color inside
        vec4 color = tanh(value);
        gl_FragColor = vec4(color.rgb, color.a * uMasterAlpha);
      }
    }
  `;

  $effect(() => {
    const state = currentSceneState;
    uniforms.uCornerRadius.value = state.cornerRadius;
    uniforms.uAnimationSpeed.value = state.animationSpeed;
    uniforms.uColorIntensity.value = state.colorIntensity;
    uniforms.uBrightness.value = state.brightness;
    uniforms.uEdgeThickness.value = state.edgeThickness;

    const phase = state.currentColorPhase;
    const mask = state.currentColorMask;
    uniforms.uColorPhase.value.set(phase.r, phase.g, phase.b);
    uniforms.uColorMask.value.set(mask.r, mask.g, mask.b);
  });

  $effect(() => {
    currentSceneState.updateFromPreset();
  });

  // React to overlay changes
  $effect(() => {
    if (buttPanelState.hasOverlay) {
      if (buttPanelState.overlay === 0) {
        currentSceneState.colorPreset = "red";
        currentSceneState.updateFromPreset();
      } else if (buttPanelState.overlay === 1) {
        currentSceneState.colorPreset = "blue";
        currentSceneState.updateFromPreset();
      }
    }
  });

  $effect(() => {
    if (innerWidth.current && innerHeight.current) {
      uniforms.uResolution.value.set(innerWidth.current, innerHeight.current);
      uniforms.uAspectRatio.value = innerWidth.current / innerHeight.current;
    }
  });

  $effect(() => {
    uniforms.uBorderRect.value.set(borderRect.width, borderRect.height);
  });

  useTask(() => {
    uniforms.uTime.value = clock.getElapsedTime();

    const targetAlpha = isActive ? 1.0 : 0.0;
    if (animatedAlpha !== targetAlpha) {
      const easing = 0.08; // Smoothing factor
      const newAlpha = animatedAlpha + (targetAlpha - animatedAlpha) * easing;
      if (Math.abs(targetAlpha - newAlpha) < 0.001) {
        animatedAlpha = targetAlpha;
      } else {
        animatedAlpha = newAlpha;
      }
    }

    uniforms.uMasterAlpha.value = animatedAlpha;
  });
</script>

<T.OrthographicCamera makeDefault position={[0, 0, 100]} fov={50}>
  {#if debug}
    <OrbitControls />
  {/if}
</T.OrthographicCamera>

{#if showTest}
  <T.Mesh name="Test">
    <T.BoxGeometry args={[innerWidth.current ?? 800, innerHeight.current ?? 600, 1]} />
    <T.MeshBasicMaterial color="hotpink" opacity={0.25} transparent />
  </T.Mesh>
{/if}

<T.Mesh name="RainbowEffect" position={[0, 0, -1]}>
  <T.PlaneGeometry args={planeSize} />
  <T.ShaderMaterial {vertexShader} {fragmentShader} {uniforms} transparent />
</T.Mesh>
