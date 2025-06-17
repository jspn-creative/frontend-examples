<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import { OrbitControls } from "@threlte/extras";
  import { Vector2, Vector3, Clock } from "three";
  import { buttPanelState } from "./buttPanelState.svelte";
  import type { InnerGlowEffectState } from "./sceneStates";
  import { innerWidth, innerHeight } from "svelte/reactivity/window";

  const clock = new Clock();

  const isActive = $derived(buttPanelState.isActive);
  const showTest = $derived(buttPanelState.showTest);
  const borderRect = $derived(buttPanelState.borderRect);
  const debug = $derived(buttPanelState.debug);

  let animatedAlpha = $state(0);

  const currentSceneState = $derived(buttPanelState.currentSceneState as InnerGlowEffectState);

  const planeSize = $derived([innerWidth.current, innerHeight.current]);

  const uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new Vector2() },
    uIntensity: { value: 0.2 },
    uSpeed: { value: 0.2 },
    uBlur: { value: 0.01 },
    uCornerRadius: { value: 0.1 },
    uColor0: { value: new Vector3() },
    uColor1: { value: new Vector3() },
    uColor2: { value: new Vector3() },
    uColor3: { value: new Vector3() },
    uColor4: { value: new Vector3() },
    uAmbientGlow: { value: new Vector3() },
    uMasterAlpha: { value: 0.0 },
    uAmbientRadius: { value: 0.05 },
    uAmbientIntensity: { value: 3.0 },
    uAmbientAlpha: { value: 2.0 },
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
    uniform float uIntensity;
    uniform float uSpeed;
    uniform float uBlur;
    uniform float uCornerRadius;
    uniform vec3 uColor0;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uColor4;
    uniform vec3 uAmbientGlow;
    uniform float uMasterAlpha;
    uniform float uAmbientRadius;
    uniform float uAmbientIntensity;
    uniform float uAmbientAlpha;
    varying vec2 vUv;
    
    #define PI 3.14159
    #define TWO_PI 6.28318
    #define BOX_SIZE vec2(0.225, 0.4)

    // Signed Distance Function for a Rounded Rectangle
    float sdRoundedBox(in vec2 p, in vec2 b, in float r) {
      vec2 q = abs(p) - b + r;
      return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
    }

    void main() {
      // Normalize coordinates
      vec2 resolution = uResolution.xy;
      float minResolution = min(resolution.x, resolution.y);
      vec2 center = resolution.xy * 0.5;
      vec2 fragCoord = vUv * resolution;
      vec2 uv = (fragCoord.xy - center) / minResolution;
      
      // Colors array for animation (4 colors, excluding uColor0 which is for ambient glow)
      vec3[4] colors = vec3[4](uColor1, uColor2, uColor3, uColor4);
      
      // Calculate distance to rounded rectangle using sdRoundedBox
      float distanceField = sdRoundedBox(uv, BOX_SIZE, uCornerRadius);
      float roundedDist = distanceField;
      
      // Calculate angle for color transition
      float angle = atan(uv.y, uv.x);
      angle = angle < 0.0 ? angle + TWO_PI : angle;
      
      // Color transition logic (cycling through 4 colors)
      float phase = fract((angle / TWO_PI) + uTime * uSpeed);
      float transitionPoint = phase * 4.0;
      int currentIndex = int(transitionPoint);
      float t = fract(transitionPoint);
      
      // Smooth transition between colors with blur affecting the transition
      t = smoothstep(0.0 - uBlur, 1.0 + uBlur, t);
      vec3 currentColor = colors[currentIndex];
      vec3 nextColor = colors[(currentIndex + 1) % 4];
      vec3 finalColor = mix(currentColor, nextColor, t);
      
      // Main glow calculation (matching original)
      float glow = 0.1 / (-roundedDist + 0.01);
      vec3 glowColor = finalColor * glow * uIntensity;
      
      // Ambient glow calculation (extends beyond the shape)
      float ambientGlow = smoothstep(uAmbientRadius, 0.0, abs(roundedDist));
      vec3 ambientColor = uColor0 * ambientGlow * uAmbientIntensity; // Using uColor0 for ambient glow
      
      // Combine colors
      vec3 combinedColor = glowColor + ambientColor;
      
      // Black correlates with transparency - luminance determines alpha
      float luminance = dot(combinedColor, vec3(0.299, 0.587, 0.114));
      float alpha = clamp(luminance, 0.0, 1.0);
      
      // Final color assignment
      gl_FragColor = roundedDist < 0.0 ? 
        vec4(combinedColor, alpha * uMasterAlpha) : 
        vec4(ambientColor, ambientGlow * uAmbientAlpha * uMasterAlpha);
    }
  `;

  // React to overlay changes
  $effect(() => {
    if (buttPanelState.hasOverlay) {
      if (buttPanelState.overlay === 0) {
        currentSceneState.colorPreset = "magma";
        currentSceneState.updateFromPreset();
      } else if (buttPanelState.overlay === 1) {
        currentSceneState.colorPreset = "ocean";
        currentSceneState.updateFromPreset();
      }
    }
  });

  $effect(() => {
    const state = currentSceneState;
    uniforms.uIntensity.value = state.intensity;
    uniforms.uSpeed.value = state.speed;
    uniforms.uBlur.value = state.blur;
    uniforms.uCornerRadius.value = state.cornerRadius;
    uniforms.uAmbientRadius.value = state.ambientRadius;
    uniforms.uAmbientIntensity.value = state.ambientIntensity;
    uniforms.uAmbientAlpha.value = state.ambientAlpha;

    const colors = state.currentColors;
    const ambientGlow = state.ambientGlowColor;
    uniforms.uColor0.value.set(ambientGlow[0], ambientGlow[1], ambientGlow[2]);
    uniforms.uColor1.value.set(colors[0][0], colors[0][1], colors[0][2]);
    uniforms.uColor2.value.set(colors[1][0], colors[1][1], colors[1][2]);
    uniforms.uColor3.value.set(colors[2][0], colors[2][1], colors[2][2]);
    uniforms.uColor4.value.set(colors[3][0], colors[3][1], colors[3][2]);
    uniforms.uAmbientGlow.value.set(ambientGlow[0], ambientGlow[1], ambientGlow[2]);
  });

  $effect(() => {
    currentSceneState.updateFromPreset();
  });

  // React to overlay changes
  $effect(() => {
    if (buttPanelState.hasOverlay) {
      if (buttPanelState.overlay === 0) {
        currentSceneState.colorPreset = "sunset";
        currentSceneState.updateFromPreset();
      } else if (buttPanelState.overlay === 1) {
        currentSceneState.colorPreset = "ocean";
        currentSceneState.updateFromPreset();
      }
    }
  });

  $effect(() => {
    if (innerWidth.current && innerHeight.current) {
      uniforms.uResolution.value.set(innerWidth.current, innerHeight.current);
    }
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

<T.Mesh name="InnerGlowEffect" position={[0, 0, -1]}>
  <T.PlaneGeometry args={planeSize} />
  <T.ShaderMaterial {vertexShader} {fragmentShader} {uniforms} transparent />
</T.Mesh>
