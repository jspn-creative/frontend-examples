<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
  import { OrbitControls } from "@threlte/extras";
  import { Color, Vector2, Vector3, Curve, AdditiveBlending, Clock } from "three";
  import { buttPanelState } from "./buttPanelState.svelte";
  import type { GlowEffectState } from "./sceneStates";
  import { innerWidth, innerHeight } from "svelte/reactivity/window";

  let tubeMaterial: any | undefined = $state(undefined);
  const clock = new Clock();

  const isActive = $derived(buttPanelState.isActive);
  const showTest = $derived(buttPanelState.showTest);
  const borderRect = $derived(buttPanelState.borderRect);
  const debug = $derived(buttPanelState.debug);

  const currentSceneState = $derived(buttPanelState.currentSceneState as GlowEffectState);
  const tubeRadius = $derived(currentSceneState.tubeRadius);
  const glowColor = $derived(new Color(currentSceneState.color));
  const flareColor = $derived(new Color(currentSceneState.flareColor));

  const planeSize = $derived([innerWidth.current, innerHeight.current]);

  const uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new Vector2() },
    uSpeed: { value: 0 },
    uFlareIntensity1: { value: 0 },
    uFlareIntensity2: { value: 0 },
    uFlareIntensity3: { value: 0 },
    uFlareIntensity4: { value: 0 },
    uFlareColor: { value: new Color() },
    uAspectRatio: { value: 1.0 },
    uBorderRect: { value: new Vector2() },
    uCornerRadius: { value: 45.0 },
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
    uniform float uSpeed;
    uniform float uFlareIntensity1;
    uniform float uFlareIntensity2;
    uniform float uFlareIntensity3;
    uniform float uFlareIntensity4;
    uniform vec3 uFlareColor;
    varying vec2 vUv;
    
    // Aspect ratio correction
    uniform float uAspectRatio;

    // Rounded rectangle settings
    uniform vec2 uBorderRect;
    uniform float uCornerRadius;

    #define PI 3.14159265359
    #define TWO_PI 6.28318530718

    float random(in vec2 _st) { 
      return fract(sin(dot(_st.xy, vec2(12.9898, 78.233))) * 43758.54531237);
    }

    float noise(in vec2 _st) {
      vec2 i = floor(_st);
      vec2 f = fract(_st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    vec4 flare(vec2 uv, float seed, float dir, float intensity) {
      // Convert UV to screen coordinates (-1 to 1)
      vec2 screenUv = (uv - 0.5) * 2.0;
      screenUv.x *= uAspectRatio;
      
      // Distance from center
      float distFromCenter = length(screenUv);
      
      // Calculate distance from screen edges
      vec2 absUv = abs(screenUv);
      float distFromEdge = 1.0 - max(absUv.x, absUv.y);
      
      // Direction from screen edge to center
      vec2 dirToCenter = normalize(-screenUv);
      float angle = atan(dirToCenter.y, dirToCenter.x);
      
      float t = uTime * uSpeed * dir;
      float amnt = 0.6 + sin(seed) * 8.0;
      
      // Create flare pattern along the direction from edge to center
      float flarePos = distFromCenter * 2.0; // Position along the flare ray
      
      float n = noise(vec2(seed + angle * amnt + t * 0.1, seed + t + flarePos));
      n *= pow(noise(vec2(seed * 194.0 + angle * amnt + t, seed + t + flarePos) + distFromCenter), 2.0);
      n *= pow(noise(vec2(seed * 134.0 + angle * amnt + t, seed + t + flarePos) + distFromCenter), 3.0);
      n *= pow(noise(vec2(seed * 123.0 + angle * amnt + t, seed + t + flarePos) + distFromCenter), 4.0);
      
      // Fade based on distance from edge (strongest at edges)
      float edgeFade = pow(distFromEdge, 0.5);
      
      // Fade based on distance from center (fade out towards center)
      float centerFade = 1.0 - pow(distFromCenter / 1.4142, 2.0); // 1.4142 is sqrt(2)
      
      n *= edgeFade * centerFade;
      n *= intensity;
      
      return vec4(pow(n * 2.1, 2.0), n, n, n);
    }

    float sdRoundedBox( in vec2 p, in vec2 b, in float r ) {
      vec2 q = abs(p)-b+r;
      return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r;
    }

    void main() {
      vec2 uv = vUv;
      
      vec4 c = vec4(0.0);
      c += flare(uv, 74.621, 1.0, uFlareIntensity1);
      c += flare(uv, 35.1412, -1.0, uFlareIntensity2);
      c += flare(uv, 21.5637, 1.0, uFlareIntensity3);
      c += flare(uv, 1.2637, -1.0, uFlareIntensity4);
      
      c.rgb *= uFlareColor;
      c.xyz = clamp(c.xyz, 0.0, 1.0);
      
      gl_FragColor = c;
    }
  `;

  class BorderRectPathCurve extends Curve<Vector3> {
    borderRect: { x: number; y: number; width: number; height: number };
    cornerRadius: number;

    constructor(borderRect: { x: number; y: number; width: number; height: number }, cornerRadius = 45) {
      super();
      this.borderRect = borderRect;
      this.cornerRadius = cornerRadius;
    }

    getPoint(t: number, optionalTarget = new Vector3()): Vector3 {
      const { width, height } = this.borderRect;
      const r = this.cornerRadius;

      const halfWidth = width / 2;
      const halfHeight = height / 2;

      const straightWidth = width - 2 * r;
      const straightHeight = height - 2 * r;
      const cornerArcLength = (Math.PI / 2) * r;
      const totalPerimeter = 2 * straightWidth + 2 * straightHeight + 4 * cornerArcLength;

      const distance = t * totalPerimeter;

      let tx: number, ty: number;

      if (distance <= straightWidth) {
        tx = -halfWidth + r + distance;
        ty = -halfHeight;
      } else if (distance <= straightWidth + cornerArcLength) {
        const arcT = (distance - straightWidth) / cornerArcLength;
        const angle = -Math.PI / 2 + arcT * (Math.PI / 2);
        tx = halfWidth - r + r * Math.cos(angle);
        ty = -halfHeight + r + r * Math.sin(angle);
      } else if (distance <= straightWidth + cornerArcLength + straightHeight) {
        const edgeT = distance - straightWidth - cornerArcLength;
        tx = halfWidth;
        ty = -halfHeight + r + edgeT;
      } else if (distance <= straightWidth + 2 * cornerArcLength + straightHeight) {
        const arcT = (distance - straightWidth - cornerArcLength - straightHeight) / cornerArcLength;
        const angle = arcT * (Math.PI / 2);
        tx = halfWidth - r + r * Math.cos(angle);
        ty = halfHeight - r + r * Math.sin(angle);
      } else if (distance <= 2 * straightWidth + 2 * cornerArcLength + straightHeight) {
        const edgeT = distance - straightWidth - 2 * cornerArcLength - straightHeight;
        tx = halfWidth - r - edgeT;
        ty = halfHeight;
      } else if (distance <= 2 * straightWidth + 3 * cornerArcLength + straightHeight) {
        const arcT = (distance - 2 * straightWidth - 2 * cornerArcLength - straightHeight) / cornerArcLength;
        const angle = Math.PI / 2 + arcT * (Math.PI / 2);
        tx = -halfWidth + r + r * Math.cos(angle);
        ty = halfHeight - r + r * Math.sin(angle);
      } else if (distance <= 2 * straightWidth + 3 * cornerArcLength + 2 * straightHeight) {
        const edgeT = distance - 2 * straightWidth - 3 * cornerArcLength - straightHeight;
        tx = -halfWidth;
        ty = halfHeight - r - edgeT;
      } else {
        const arcT = (distance - 2 * straightWidth - 3 * cornerArcLength - 2 * straightHeight) / cornerArcLength;
        const angle = Math.PI + arcT * (Math.PI / 2);
        tx = -halfWidth + r + r * Math.cos(angle);
        ty = -halfHeight + r + r * Math.sin(angle);
      }

      return optionalTarget.set(tx, ty, 0);
    }
  }

  const path = $derived(new BorderRectPathCurve(borderRect, 45));

  // Update uniforms
  $effect(() => {
    const state = currentSceneState;
    uniforms.uSpeed.value = state.speed;
    uniforms.uFlareIntensity1.value = state.flareIntensity1;
    uniforms.uFlareIntensity2.value = state.flareIntensity2;
    uniforms.uFlareIntensity3.value = state.flareIntensity3;
    uniforms.uFlareIntensity4.value = state.flareIntensity4;
    uniforms.uFlareColor.value.set(state.flareColor);
  });

  // Update resolution and aspect ratio
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
  });
</script>

<T.OrthographicCamera makeDefault position={[0, 0, 100]} fov={50}>
  {#if debug}
    <OrbitControls />
  {/if}
</T.OrthographicCamera>

<T.Mesh name="GlowEffect" position={[0, 0, -1]}>
  <T.PlaneGeometry args={planeSize} />
  <T.ShaderMaterial {vertexShader} {fragmentShader} {uniforms} transparent />
</T.Mesh>

<T.Mesh name="tube">
  <T.TubeGeometry args={[path, 200, tubeRadius * 0.3, 10, true]} />
  <T.MeshStandardMaterial bind:ref={tubeMaterial} emissiveIntensity={2} color={glowColor} opacity={0.7} transparent emissive={glowColor} depthTest={false} dithering={true} blending={AdditiveBlending} />
</T.Mesh>
