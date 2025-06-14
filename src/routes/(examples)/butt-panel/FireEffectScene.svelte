<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import { OrbitControls } from "@threlte/extras";
  import { Vector2, Vector3, Vector4, Clock } from "three";
  import { buttPanelState } from "./buttPanelState.svelte";
  import type { FireEffectState } from "./sceneStates";
  import { innerWidth, innerHeight } from "svelte/reactivity/window";

  const isActive = $derived(buttPanelState.isActive);
  let animatedOpacity = $state(0.0);

  const clock = new Clock();

  const debug = $derived(buttPanelState.debug);
  const currentSceneState = $derived(buttPanelState.currentSceneState as FireEffectState);
  const borderRect = $derived(buttPanelState.borderRect);

  const planeSize = $derived([innerWidth.current, innerHeight.current]);

  const uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new Vector2() },
    uSpeed: { value: 1.0 },
    uLineScale: { value: 5.0 },
    uOpacity: { value: 1.0 },
    uBorderRect: { value: new Vector4() },
    uOffset: { value: 0.02 },
    uColor: { value: new Vector3(0.0, 0.6, 1.0) },
    uMasterOpacity: { value: 0.0 },
  };

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // const fragmentShader = `
  //     uniform float uTime;
  //     uniform vec2 uResolution; // Full window resolution
  //     uniform vec4 uBorderRect; // Scene area: (x, y, width, height)
  //     uniform float uSpeed;
  //     uniform float uLineScale;
  //     uniform float uOpacity;
  //     uniform float uOffset;
  //     uniform vec3 uColor;
  //     uniform vec3 uHotColor;

  //     varying vec2 vUv;

  //     // --- Noise & Utility Functions (Unchanged) ---
  //     float rand(vec2 n) {
  //         return fract(sin(dot(n, vec2(12.9898,12.1414))) * 83758.5453);
  //     }
  //     float noise(vec2 n) {
  //         const vec2 d = vec2(0.0, 1.0);
  //         vec2 b = floor(n);
  //         vec2 f = mix(vec2(0.0), vec2(1.0), fract(n));
  //         return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
  //     }
  //     float fire(vec2 n) {
  //         return noise(n) + noise(n * 2.1) * .6 + noise(n * 5.4) * .42;
  //     }

  //     // --- Corrected Position & Color Functions ---
  //     vec3 calculateFireColor(float gradient) {
  //         // Remap the raw gradient to a 0-1 "hotness" factor.
  //         // This determines how much we blend towards the hotColor.
  //         float intensity = smoothstep(0.0, 1.0, gradient);

  //         // Blend between the cool outer color and the hot inner color based on intensity.
  //         vec3 blendedColor = mix(uColor, uHotColor, intensity);

  //         // Multiply the final blended color by the raw gradient. This ensures the
  //         // flame is brightest at its core and fades out at the edges.
  //         return blendedColor * gradient;
  //     }

  //     float calculateFireGradient(vec2 localFragCoord, vec2 localResolution, mat2 mtx, float shift) {
  //         float t = uTime * uSpeed;
  //         vec2 uv = (localFragCoord / localResolution) * mtx;
  //         uv.x += uv.y < .5 ? 23.0 + t * .35 : -11.0 + t * .3;
  //         uv.y = abs(uv.y - shift);
  //         uv *= uLineScale;
  //         float q = fire(uv - t * .013) / 2.0;
  //         vec2 r = vec2(fire(uv + q / 2.0 + t - uv.x - uv.y), fire(uv + q - t));
  //         return pow((r.y + r.y) * max(.0, uv.y) + .1, 4.0);
  //     }

  //     vec3 getLine(vec3 baseColor, vec2 localFragCoord, vec2 localResolution, mat2 mtx, float shift) {
  //         float gradient = calculateFireGradient(localFragCoord, localResolution, mtx, shift);
  //         vec3 lineColor = calculateFireColor(gradient);
  //         // Use simple addition to accumulate color from all four lines.
  //         return baseColor + lineColor;
  //     }

  //     // --- Main Entry Point (Corrected for Border) ---
  //     void main() {
  //         vec2 windowFragCoord = vUv * uResolution;
  //         vec2 sceneFragCoord = windowFragCoord - uBorderRect.xy;
  //         vec2 sceneResolution = uBorderRect.zw;

  //         if (sceneFragCoord.x < 0.0 || sceneFragCoord.x > sceneResolution.x ||
  //             sceneFragCoord.y < 0.0 || sceneFragCoord.y > sceneResolution.y) {
  //             gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  //             return;
  //         }

  //         vec3 color = vec3(0.0);

  //         // Matrix for horizontal lines (top/bottom).
  //         // The identity matrix keeps the coordinates as they are.
  //         // The line is drawn based on the y-coordinate, creating a horizontal line.
  //         mat2 horizontalMatrix = mat2(1.0, 0.0, 0.0, 1.0);

  //         // Matrix for vertical lines (left/right).
  //         // This matrix swaps x and y. The line is drawn based on the new y (which was the old x),
  //         // creating a vertical line. The animation is re-oriented to scroll up/down.
  //         mat2 verticalMatrix = mat2(0.0, 1.0, 1.0, 0.0);

  //         // Draw the two vertical lines (left and right) by swapping the axes
  //         color = getLine(color, sceneFragCoord, sceneResolution, verticalMatrix, 1.0 + uOffset);
  //         color = getLine(color, sceneFragCoord, sceneResolution, verticalMatrix, -uOffset);

  //         // Draw the two horizontal lines (top and bottom) by using the identity matrix
  //         color = getLine(color, sceneFragCoord, sceneResolution, horizontalMatrix, 1.0 + uOffset);
  //         color = getLine(color, sceneFragCoord, sceneResolution, horizontalMatrix, -uOffset);

  //         // Correctly calculate alpha based on the final color's brightness (length).
  //         float alpha = clamp(length(color) * uOpacity * 0.4, 0.0, 1.0);
  //         gl_FragColor = vec4(color, alpha);
  //     }
  //   `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec4 uBorderRect;
    uniform float uSpeed;
    uniform float uLineScale;
    uniform float uOpacity;
    uniform float uOffset;
    uniform vec3 uColor;
    uniform float uMasterOpacity;

    varying vec2 vUv;

    // Noise & Utility Functions
    float rand(vec2 n) {
        return fract(sin(dot(n, vec2(12.9898,12.1414))) * 83758.5453);
    }
    float noise(vec2 n) {
        const vec2 d = vec2(0.0, 1.0);
        vec2 b = floor(n);
        vec2 f = mix(vec2(0.0), vec2(1.0), fract(n));
        return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);   
    }
    float fire(vec2 n) {
        return noise(n) + noise(n * 2.1) * .6 + noise(n * 5.4) * .42;
    }
    vec3 ramp(float t) {
      return t <= .5 ? vec3( 1. - t * 1.4, .2, 1.05 ) / t : vec3( .3 * (1. - t) * 2., .2, 1.05 ) / t;
    }

    // Convert hex color to HSV
    vec3 rgb2hsv(vec3 c) {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }

    // Convert HSV to RGB
    vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    // Position & Color Functions
    float calculateFireGradient(vec2 localFragCoord, vec2 localResolution, mat2 mtx, float shift) {
        float t = uTime * uSpeed;
        vec2 uv = (localFragCoord / localResolution) * mtx;
        uv.x += uv.y < .5 ? 23.0 + t * .35 : -11.0 + t * .3;    
        uv.y = abs(uv.y - shift);
        uv *= uLineScale;
        float q = fire(uv - t * .013) / 2.0;
        vec2 r = vec2(fire(uv + q / 2.0 + t - uv.x - uv.y), fire(uv + q - t));
        return pow((r.y + r.y) * max(.0, uv.y) + .1, 4.0);
    }

    vec3 calculateFireColor(float gradient) {
        // Use the original ramp function for intensity mapping
        vec3 originalColor = ramp(gradient);
        
        // Convert user color to HSV for better manipulation
        vec3 userHSV = rgb2hsv(uColor);
        
        // Use the original color's brightness/value as intensity
        float intensity = originalColor.b;
        
        // Create fire effect by varying saturation and value based on gradient
        vec3 fireHSV = vec3(
            userHSV.x, // Keep user's hue
            userHSV.y * (0.8 + 0.2 * gradient), // Vary saturation
            intensity // Use original intensity calculation
        );
        
        vec3 color = hsv2rgb(fireHSV);
        color /= (1.50 + max(vec3(0), color));
        
        if(intensity < 0.00000005) {
            color = vec3(0.0);
        }
        
        return color;
    }

    vec3 getLine(vec3 baseColor, vec2 localFragCoord, vec2 localResolution, mat2 mtx, float shift) {
        float gradient = calculateFireGradient(localFragCoord, localResolution, mtx, shift);
        vec3 lineColor = calculateFireColor(gradient);
        return mix(baseColor, lineColor, lineColor.b);
    }

    void main() {
        vec2 windowFragCoord = vUv * uResolution;
        vec2 sceneFragCoord = windowFragCoord - uBorderRect.xy;
        vec2 sceneResolution = uBorderRect.zw;

        if (sceneFragCoord.x < 0.0 || sceneFragCoord.x > sceneResolution.x ||
            sceneFragCoord.y < 0.0 || sceneFragCoord.y > sceneResolution.y) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
            return;
        }

        vec3 color = vec3(0.0);

        // Matrix for horizontal lines (top/bottom).
        // The identity matrix keeps the coordinates as they are.
        // The line is drawn based on the y-coordinate, creating a horizontal line.
        mat2 horizontalMatrix = mat2(1.0, 0.0, 0.0, 1.0);

        // Matrix for vertical lines (left/right).
        // This matrix swaps x and y. The line is drawn based on the new y (which was the old x),
        // creating a vertical line. The animation is re-oriented to scroll up/down.
        mat2 verticalMatrix = mat2(0.0, 1.0, 1.0, 0.0);

        // Draw the two vertical lines (left and right) by swapping the axes
        color = getLine(color, sceneFragCoord, sceneResolution, verticalMatrix, 1.0 + uOffset);
        color = getLine(color, sceneFragCoord, sceneResolution, verticalMatrix, -uOffset);

        // Draw the two horizontal lines (top and bottom) by using the identity matrix
        color = getLine(color, sceneFragCoord, sceneResolution, horizontalMatrix, 1.0 + uOffset);
        color = getLine(color, sceneFragCoord, sceneResolution, horizontalMatrix, -uOffset);

        float alpha = clamp(color.b * uOpacity * 0.4, 0.0, 1.0);
        gl_FragColor = vec4(color, alpha * uMasterOpacity);
    }
  `;

  $effect(() => {
    const state = currentSceneState;
    uniforms.uSpeed.value = state.speed ?? 1.0;
    uniforms.uLineScale.value = state.scale ?? 5.0;
    uniforms.uOpacity.value = state.intensity ?? 1.0;
    uniforms.uOffset.value = state.offset ?? 0.02;

    if (state.color) {
      const hex = state.color.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;
      uniforms.uColor.value.set(r, g, b);
    }
  });

  $effect(() => {
    if (innerWidth.current && innerHeight.current && borderRect) {
      uniforms.uResolution.value.set(innerWidth.current, innerHeight.current);
      const webgl_y = innerHeight.current - borderRect.y - borderRect.height;
      uniforms.uBorderRect.value.set(borderRect.x, webgl_y, borderRect.width, borderRect.height);
    }
  });

  useTask(() => {
    uniforms.uTime.value = clock.getElapsedTime();
    const targetOpacity = isActive ? 1.0 : 0.0;
    if (animatedOpacity !== targetOpacity) {
      const easing = 0.01;
      const newOpacity = animatedOpacity + (targetOpacity - animatedOpacity) * easing;
      if (Math.abs(targetOpacity - newOpacity) < 0.001) {
        animatedOpacity = targetOpacity;
      } else {
        animatedOpacity = newOpacity;
      }
    }
    uniforms.uMasterOpacity.value = animatedOpacity;
  });
</script>

<T.OrthographicCamera makeDefault position={[0, 0, 100]}>
  {#if debug}
    <OrbitControls />
  {/if}
</T.OrthographicCamera>
<T.Mesh name="FireEffect" position={[0, 0, -1]}>
  <T.PlaneGeometry args={planeSize} />
  <T.ShaderMaterial {vertexShader} {fragmentShader} {uniforms} transparent />
</T.Mesh>
