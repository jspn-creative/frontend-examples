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
    uniform float iTime;
    uniform vec2 iResolution;
    uniform float speed;
    uniform float innerRadius;
    uniform float outerRadius;
    uniform float size;
    uniform float flareIntensity1;
    uniform float flareIntensity2;
    uniform float flareIntensity3;
    uniform float flareIntensity4;
    uniform vec3 flareColor;
    varying vec2 vUv;
    
    // Film grain settings
    uniform bool grainEnabled;
    uniform float grainAmount;
    uniform float grainSize;
    uniform float grainShadowBoost;
    
    // Black and white settings
    uniform bool bwEnabled;
    uniform float bwContrast;
    
    // Simple mouse effect
    uniform bool mouseProximityEnabled;
    uniform vec2 mousePosition;
    uniform float mouseProximityStrength;
    
    // Aspect ratio correction
    uniform float aspectRatio;

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
      float t = iTime * speed * dir;
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
      if (!grainEnabled) return color;
      
      // Multi-layered grain for more natural look
      vec2 uvRandom = uv * iResolution.xy / 100.0;
      float noise = 0.0;
      
      // Base layer
      noise += 0.65 * (hash(uvRandom * grainSize + iTime * 0.01) * 2.0 - 1.0);
      
      // Medium detail layer
      noise += 0.25 * (hash(uvRandom * grainSize * 2.0 + vec2(iTime * 0.02, 0.0)) * 2.0 - 1.0);
      
      // Fine detail layer
      noise += 0.1 * (hash(uvRandom * grainSize * 5.0 + vec2(0.0, iTime * 0.03)) * 2.0 - 1.0);
      
      // Apply grain with brightness-based modulation (more visible in shadows)
      float grainMask = 1.0 - dot(color, vec3(0.299, 0.587, 0.114)) * grainShadowBoost;
      return color + noise * grainAmount * grainMask;
    }
    
    // Convert to black and white
    vec3 convertToBW(vec3 color) {
      if (!bwEnabled) return color;
      
      float luminance = dot(color, vec3(0.299, 0.587, 0.114));
      luminance = pow(luminance, bwContrast); // Apply contrast
      return vec3(luminance);
    }

    void main() {
      // Base UV coordinates - use plane UV coordinates and correct for aspect ratio
      vec2 uv = (vUv - 0.5) * size;
      uv.x *= aspectRatio;  // Correct for aspect ratio to maintain circular shape
      
      // Apply simple mouse offset if enabled
      if (mouseProximityEnabled) {
        // Convert mouse from 0-1 range to -1 to 1 range
        vec2 mouseOffset = (mousePosition - 0.5) * 2.0;
        
        // Apply the offset directly to the UV coordinates
        // Multiply by strength to control the amount of movement
        uv -= mouseOffset * mouseProximityStrength * 200.0;
      }
      
      vec4 c = vec4(0.0);
      float len = length(uv);
      float alpha = pow(clamp(outerRadius - len + innerRadius - 40.0, 0.0, outerRadius) / outerRadius, 6.0);
      
      // Add flares
      c += flare(alpha, uv, 74.621, 1.0, flareIntensity1);
      c += flare(alpha, uv, 35.1412, 1.0, flareIntensity2);
      c += flare(alpha, uv, 21.5637, 1.0, flareIntensity3);
      c += flare(alpha, uv, 1.2637, 1.0, flareIntensity4);
      
      // Apply flare color
      c.rgb *= flareColor;
      
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
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector2() },
    speed: { value: eclipseState.speed },
    innerRadius: { value: eclipseState.innerRadius },
    outerRadius: { value: eclipseState.outerRadius },
    size: { value: eclipseState.size },
    flareIntensity1: { value: eclipseState.flareIntensity1 },
    flareIntensity2: { value: eclipseState.flareIntensity2 },
    flareIntensity3: { value: eclipseState.flareIntensity3 },
    flareIntensity4: { value: eclipseState.flareIntensity4 },
    flareColor: { value: new THREE.Vector3(...eclipseState.flareColor) },
    grainEnabled: { value: eclipseState.grainEnabled },
    grainAmount: { value: eclipseState.grainAmount },
    grainSize: { value: eclipseState.grainSize },
    grainShadowBoost: { value: eclipseState.grainShadowBoost },
    bwEnabled: { value: eclipseState.bwEnabled },
    bwContrast: { value: eclipseState.bwContrast },
    mouseProximityEnabled: { value: eclipseState.mouseProximityEnabled },
    mousePosition: { value: new THREE.Vector2(0.5, 0.5) },
    mouseProximityStrength: { value: eclipseState.mouseProximityStrength },
    aspectRatio: { value: 1.0 },
  };

  // Update uniforms when state changes
  $effect(() => {
    uniforms.speed.value = eclipseState.speed;
    uniforms.innerRadius.value = eclipseState.innerRadius;
    uniforms.outerRadius.value = eclipseState.outerRadius;
    uniforms.size.value = eclipseState.size;
    uniforms.flareIntensity1.value = eclipseState.flareIntensity1;
    uniforms.flareIntensity2.value = eclipseState.flareIntensity2;
    uniforms.flareIntensity3.value = eclipseState.flareIntensity3;
    uniforms.flareIntensity4.value = eclipseState.flareIntensity4;
    uniforms.flareColor.value.set(...eclipseState.flareColor);
    uniforms.grainEnabled.value = eclipseState.grainEnabled;
    uniforms.grainAmount.value = eclipseState.grainAmount;
    uniforms.grainSize.value = eclipseState.grainSize;
    uniforms.grainShadowBoost.value = eclipseState.grainShadowBoost;
    uniforms.bwEnabled.value = eclipseState.bwEnabled;
    uniforms.bwContrast.value = eclipseState.bwContrast;
    uniforms.mouseProximityEnabled.value = eclipseState.mouseProximityEnabled;
    uniforms.mouseProximityStrength.value = eclipseState.mouseProximityStrength;
  });

  // Update mouse position
  $effect(() => {
    uniforms.mousePosition.value.set(eclipseState.mousePosition.x, eclipseState.mousePosition.y);
  });

  // Update resolution and aspect ratio on window resize
  $effect(() => {
    if (innerWidth && innerHeight) {
      uniforms.iResolution.value.set(innerWidth, innerHeight);
      uniforms.aspectRatio.value = innerWidth / innerHeight;
    }
  });

  // Animation loop
  let clock = new THREE.Clock();

  useTask(() => {
    uniforms.iTime.value = clock.getElapsedTime();
    eclipseState.interpolateMousePosition();
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
