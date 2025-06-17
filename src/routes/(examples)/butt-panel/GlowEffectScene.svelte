<script lang="ts">
  import { T, useTask } from "@threlte/core";
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
  const highlightColor = $derived(new Color(currentSceneState.highlightColor));

  const planeSize = $derived([innerWidth.current, innerHeight.current]);

  const uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new Vector2() },
    uNoiseSpeed: { value: 0 },
    uHighlightSpeed: { value: 0 },
    uColorShiftSpeed: { value: 0 },
    uHighlightIntensity: { value: 0 },
    uHighlightColor: { value: new Color() },
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
    uniform float uNoiseSpeed;
    uniform float uHighlightSpeed;
    uniform float uColorShiftSpeed;
    uniform float uHighlightIntensity;
    uniform vec3 uHighlightColor;
    varying vec2 vUv;

    #define PI 3.14159265359
    #define BOX_SIZE        vec2(0.4, 0.9) // Half-width, half-height
    #define CORNER_RADIUS   0.4            // How round the corners are (0.0 for sharp)

    #define COLOR_1         vec3(0.61, 0.26, 0.99) // Purple
    #define COLOR_2         vec3(0.29, 0.76, 0.91) // Teal
    #define COLOR_3         vec3(0.06, 0.07, 0.60) // Dark Blue (core color)
    #define BG_COLOR        vec3(0.0)

    #define GLOW_FALLOFF         0.4  // Makes the border softer. Higher value = softer/wider glow.
    #define NOISE_SCALE          1.0  // Zoom level of the border texture
    #define NOISE_INTENSITY      0.7  // How much the noise affects the glow brightness (0.0 to 1.0)
    #define HIGHLIGHT_FALLOFF    5.0  // How sharp the orbiting highlight is

    // noise
    vec3 hash33(vec3 p3)
    {
      p3 = fract(p3 * vec3(.1031,.11369,.13787));
      p3 += dot(p3, p3.yxz+19.19);
      return -1.0 + 2.0 * fract(vec3(p3.x+p3.y, p3.x+p3.z, p3.y+p3.z)*p3.zyx);
    }

    float snoise3(vec3 p)
    {
      const float K1 = 0.333333333;
      const float K2 = 0.166666667;
      vec3 i = floor(p + (p.x + p.y + p.z) * K1);
      vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
      vec3 e = step(vec3(0.0), d0 - d0.yzx);
      vec3 i1 = e * (1.0 - e.zxy);
      vec3 i2 = 1.0 - e.zxy * (1.0 - e);
      vec3 d1 = d0 - (i1 - K2);
      vec3 d2 = d0 - (i2 - K1);
      vec3 d3 = d0 - 0.5;
      vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
      vec4 n = h * h * h * h * vec4(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.0)));
      return dot(vec4(31.316), n);
    }

    // Signed Distance Function for a Rounded Rectangle
    float sdRoundedBox( in vec2 p, in vec2 b, in float r )
    {
      vec2 q = abs(p)-b+r;
      return length(max(q,0.0)) + min(max(q.x,q.y),0.0) - r;
    }

    vec4 extractAlpha(vec3 colorIn)
    {
      vec4 colorOut;
      float maxValue = min(max(max(colorIn.r, colorIn.g), colorIn.b), 1.0);
      if (maxValue > 1e-5) {
        colorOut.rgb = colorIn.rgb * (1.0 / maxValue);
        colorOut.a = maxValue;
      } else {
        colorOut = vec4(0.0);
      }
      return colorOut;
    }

    float light1(float intensity, float attenuation, float dist)
    {
      return intensity / (1.0 + dist * attenuation);
    }

    float light2(float intensity, float attenuation, float dist)
    {
      return intensity / (1.0 + dist * dist * attenuation);
    }

    void draw( out vec4 _FragColor, in vec2 vUv )
    {
      vec2 uv = vUv;
      
      // Calculate the distance to the surface of the rounded rectangle.
      // This value is 0 on the line, negative inside, and positive outside.
      float sdfDist = sdRoundedBox(uv, BOX_SIZE, CORNER_RADIUS);
      
      // The glow is brightest at the line (sdfDist=0) and fades to zero at GLOW_FALLOFF distance.
      float glow = smoothstep(GLOW_FALLOFF, 0.0, abs(sdfDist));
      
      // Modulates the brightness of the glow with noise.
      float n0 = snoise3(vec3(uv * NOISE_SCALE, uTime * uNoiseSpeed)) * 0.5 + 0.5;
      glow *= mix(1.0 - NOISE_INTENSITY, 1.0, n0); // Mix between a dimmer and full brightness
      
      // Use sin() for a smooth color transition along the y-axis.
      float y_norm = uv.y / BOX_SIZE.y; // -1 at bottom, 1 at top
      float phase = y_norm * PI * 0.5;  // Map to a quarter sine-wave cycle
      float cl = sin(phase + uTime * uColorShiftSpeed) * 0.5 + 0.5;
      
      // Highlight
      float a = uTime * uHighlightSpeed;
      vec2 pos = vec2(cos(a) * BOX_SIZE.x, sin(a) * BOX_SIZE.y);
      float d = distance(uv, pos);
      float v1 = light2(uHighlightIntensity, HIGHLIGHT_FALLOFF, d);
      
      // Combine everything using the new unified 'glow' value.
      vec3 baseColor = mix(COLOR_1, COLOR_2, cl);
      vec3 col = mix(COLOR_3, baseColor, glow); // The dark core is revealed by the glow
      col += v1 * glow * uHighlightColor; // Add the colored highlight, masked by the glow
      
      col.rgb = clamp(col.rgb, 0.0, 1.0);
      
      // Multiply by the final glow value to handle transparency.
      _FragColor = extractAlpha(col * glow);
    }

    void main() {
      vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
      
      vec4 col;
      draw(col, uv);

      vec3 bg = BG_COLOR;

      gl_FragColor.rgb = mix(bg, col.rgb, col.a); //normal blend
      gl_FragColor.a = col.a;
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
    uniforms.uNoiseSpeed.value = state.noiseSpeed;
    uniforms.uHighlightSpeed.value = state.highlightSpeed;
    uniforms.uColorShiftSpeed.value = state.colorShiftSpeed;
    uniforms.uHighlightIntensity.value = state.highlightIntensity;
    uniforms.uHighlightColor.value.set(state.highlightColor);
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
