<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import { OrbitControls } from "@threlte/extras";
  import * as THREE from "three";
  import { eclipseState } from "./eclipseSceneState.svelte";

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
    uniform float uInnerRadius;
    uniform float uOuterRadius;
    uniform float uSize;
    uniform float uFlareIntensity1;
    uniform float uFlareIntensity2;
    uniform float uFlareIntensity3;
    uniform float uFlareIntensity4;
    uniform vec3 uFlareColor;
    varying vec2 vUv;
    
    // Film grain settings
    uniform bool uGrainEnabled;
    uniform float uGrainAmount;
    uniform float uGrainSize;
    uniform float uGrainShadowBoost;
    
    // Black and white settings
    uniform bool uBwEnabled;
    uniform float uBwContrast;
    
    // Simple mouse effect
    uniform bool uMouseProximityEnabled;
    uniform vec2 uMousePosition;
    uniform float uMouseProximityStrength;
    
    // Aspect ratio correction
    uniform float uAspectRatio;

    #define PI 3.14159265359
    #define TWO_PI 6.28318530718
    #define SQ3 1.73205080757

    float random(in vec2 _st) { 
      return fract(sin(dot(_st.xy, vec2(12.9898, 78.233))) * 43758.54531237);
    }

    float noise(in vec2 _st) {
      vec2 i = floor(_st);
      vec2 f = fract(_st);

      // Four corners in 2D of a tile
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));

      vec2 u = f * f * (3.0 - 2.0 * f);

      return mix(a, b, u.x) + 
              (c - a) * u.y * (1.0 - u.x) + 
              (d - b) * u.x * u.y;
    }

    float noise(float _st) { 
      return fract(abs(sin(_st)));
    }
    
    // Hash function for grain effect
    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    vec4 flare(float alpha, vec2 main, float seed, float dir, float intensity) {
      float amnt = 0.6 + sin(seed) * 8.0;
      float ang = atan(main.y, main.x);
      float t = uTime * uSpeed * dir;
      float n = noise(vec2((seed + ang * amnt + t * 0.1) + cos(alpha * 13.8 + noise(t + ang + seed) * 3.0) * 0.2 + seed / 20.0, seed + t + ang));

      n *= pow(noise(vec2(seed * 194.0 + ang * amnt + t + cos(alpha * 2.0 * n + t * 1.1 + ang) * 2.8, seed + t + ang) + alpha), 2.0);
      n *= pow(noise(vec2(seed * 134.0 + ang * amnt + t + cos(alpha * 2.2 * n + t * 1.1 + ang) * 1.1, seed + t + ang) + alpha), 3.0);
      n *= pow(noise(vec2(seed * 123.0 + ang * amnt + t + cos(alpha * 2.3 * n + t * 1.1 + ang) * 0.8, seed + t + ang) + alpha), 4.0);
      n *= pow(alpha, 2.6);
      n *= (ang + PI) / 2.0 * (TWO_PI - ang - PI); // fade out flares at pole
      
      n += sqrt(alpha * alpha) * 0.26;
      n *= intensity;
      return vec4(pow(n * 2.1, 2.0), n, n, n);
    }
    
    // Film grain effect
    vec3 applyGrain(vec3 color, vec2 uv) {
      if (!uGrainEnabled) return color;
      
      // Multi-layered grain for more natural look
      vec2 uvRandom = uv * uResolution.xy / 100.0;
      float noise = 0.0;
      
      // Base layer
      noise += 0.65 * (hash(uvRandom * uGrainSize + uTime * 0.01) * 2.0 - 1.0);
      
      // Medium detail layer
      noise += 0.25 * (hash(uvRandom * uGrainSize * 2.0 + vec2(uTime * 0.02, 0.0)) * 2.0 - 1.0);
      
      // Fine detail layer
      noise += 0.1 * (hash(uvRandom * uGrainSize * 5.0 + vec2(0.0, uTime * 0.03)) * 2.0 - 1.0);
      
      // Apply grain with brightness-based modulation (more visible in shadows)
      float grainMask = 1.0 - dot(color, vec3(0.299, 0.587, 0.114)) * uGrainShadowBoost;
      return color + noise * uGrainAmount * grainMask;
    }
    
    // Convert to black and white
    vec3 convertToBW(vec3 color) {
      if (!uBwEnabled) return color;
      
      float luminance = dot(color, vec3(0.299, 0.587, 0.114));
      luminance = pow(luminance, uBwContrast); // Apply contrast
      return vec3(luminance);
    }

    void main() {
      // Base UV coordinates - use plane UV coordinates and correct for aspect ratio
      vec2 uv = (vUv - 0.5) * uSize;
      uv.x *= uAspectRatio;  // Correct for aspect ratio to maintain circular shape
      
      // Apply simple mouse offset if enabled
      if (uMouseProximityEnabled) {
        // Convert mouse from 0-1 range to -1 to 1 range
        vec2 mouseOffset = (uMousePosition - 0.5) * 2.0;
        
        // Apply the offset directly to the UV coordinates
        // Multiply by strength to control the amount of movement
        uv -= mouseOffset * uMouseProximityStrength * 200.0;
      }
      
      vec4 c = vec4(0.0);
      float len = length(uv);
      float alpha = pow(clamp(uOuterRadius - len + uInnerRadius - 40.0, 0.0, uOuterRadius) / uOuterRadius, 6.0);
      
      // Add flares
      c += flare(alpha, uv, 74.621, 1.0, uFlareIntensity1);
      c += flare(alpha, uv, 35.1412, 1.0, uFlareIntensity2);
      c += flare(alpha, uv, 21.5637, 1.0, uFlareIntensity3);
      c += flare(alpha, uv, 1.2637, 1.0, uFlareIntensity4);
      
      // Apply flare color
      c.rgb *= uFlareColor;
      
      c.xyz = clamp(c.xyz, 0.0, 1.0);
      if(alpha >= 0.99) {
        c.xyz -= (alpha - 0.99) * 150.0;
      }
      
      // Apply film grain
      c.rgb = applyGrain(c.rgb, vUv);
      
      // Convert to black and white if enabled
      c.rgb = convertToBW(c.rgb);
      
      gl_FragColor = c;
    }
  `;

  let innerWidth = $state(0);
  let innerHeight = $state(0);

  // Calculate plane size to fill viewport
  const cameraDistance = 10;
  const fov = 50;

  const planeSize = $derived(() => {
    if (!innerWidth || !innerHeight) return [10, 10];

    // Calculate height based on FOV and camera distance
    const height = 2 * cameraDistance * Math.tan((fov * Math.PI) / 180 / 2);

    // Calculate width based on aspect ratio
    const aspectRatio = innerWidth / innerHeight;
    const width = height * aspectRatio;

    return [width, height];
  });

  // Create shader material uniforms
  const uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2() },
    uSpeed: { value: eclipseState.speed },
    uInnerRadius: { value: eclipseState.innerRadius },
    uOuterRadius: { value: eclipseState.outerRadius },
    uSize: { value: eclipseState.size },
    uFlareIntensity1: { value: eclipseState.flareIntensity1 },
    uFlareIntensity2: { value: eclipseState.flareIntensity2 },
    uFlareIntensity3: { value: eclipseState.flareIntensity3 },
    uFlareIntensity4: { value: eclipseState.flareIntensity4 },
    uFlareColor: { value: new THREE.Vector3(...eclipseState.flareColor) },
    uGrainEnabled: { value: eclipseState.grainEnabled },
    uGrainAmount: { value: eclipseState.grainAmount },
    uGrainSize: { value: eclipseState.grainSize },
    uGrainShadowBoost: { value: eclipseState.grainShadowBoost },
    uBwEnabled: { value: eclipseState.bwEnabled },
    uBwContrast: { value: eclipseState.bwContrast },
    uMouseProximityEnabled: { value: eclipseState.mouseProximityEnabled },
    uMousePosition: { value: new THREE.Vector2(0.5, 0.5) },
    uMouseProximityStrength: { value: eclipseState.mouseProximityStrength },
    uAspectRatio: { value: 1.0 },
  };

  // Update uniforms when state changes
  $effect(() => {
    uniforms.uSpeed.value = eclipseState.speed;
    uniforms.uInnerRadius.value = eclipseState.innerRadius;
    uniforms.uOuterRadius.value = eclipseState.outerRadius;
    uniforms.uSize.value = eclipseState.size;
    uniforms.uFlareIntensity1.value = eclipseState.flareIntensity1;
    uniforms.uFlareIntensity2.value = eclipseState.flareIntensity2;
    uniforms.uFlareIntensity3.value = eclipseState.flareIntensity3;
    uniforms.uFlareIntensity4.value = eclipseState.flareIntensity4;
    uniforms.uFlareColor.value.set(...eclipseState.flareColor);
    uniforms.uGrainEnabled.value = eclipseState.grainEnabled;
    uniforms.uGrainAmount.value = eclipseState.grainAmount;
    uniforms.uGrainSize.value = eclipseState.grainSize;
    uniforms.uGrainShadowBoost.value = eclipseState.grainShadowBoost;
    uniforms.uBwEnabled.value = eclipseState.bwEnabled;
    uniforms.uBwContrast.value = eclipseState.bwContrast;
    uniforms.uMouseProximityEnabled.value = eclipseState.mouseProximityEnabled;
    uniforms.uMouseProximityStrength.value = eclipseState.mouseProximityStrength;
  });

  // Update mouse position
  $effect(() => {
    uniforms.uMousePosition.value.set(eclipseState.mousePosition.x, eclipseState.mousePosition.y);
  });

  // Update resolution and aspect ratio on window resize
  $effect(() => {
    if (innerWidth && innerHeight) {
      uniforms.uResolution.value.set(innerWidth, innerHeight);
      uniforms.uAspectRatio.value = innerWidth / innerHeight;
    }
  });

  // Animation loop
  let clock = new THREE.Clock();

  useTask(() => {
    uniforms.uTime.value = clock.getElapsedTime();
    eclipseState.interpolateMousePosition();
    eclipseState.animateCycleColor();
  });
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<T.PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} visible>
  <!-- <OrbitControls enablePan enableZoom enableRotate enableDamping target={[0, 0, 0]} /> -->
</T.PerspectiveCamera>

<T.Mesh name="Eclipse" position={[0, 0, 0]}>
  <T.PlaneGeometry args={planeSize()} />
  <T.ShaderMaterial {vertexShader} {fragmentShader} {uniforms} />
</T.Mesh>
