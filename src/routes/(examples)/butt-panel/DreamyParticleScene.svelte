<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
  import { Vector3, Curve, BufferGeometry, BufferAttribute, Points, ShaderMaterial, AdditiveBlending, Color } from "three";
  import { EffectComposer, EffectPass, RenderPass, BloomEffect, KernelSize } from "postprocessing";
  import { onMount } from "svelte";

  interface Props {
    isActive: boolean;
    showTest?: boolean;
    glowColor: string;
    innerWidth?: number;
    innerHeight?: number;
    borderRect: { x: number; y: number; width: number; height: number };
    bloomIntensity?: number;
    bloomThreshold?: number;
    bloomRadius?: number;
    exposure?: number;
    particleSize?: number;
    particleSpread?: number;
    particleCount?: number;
    maxParticleSize?: number;
    tubeRadius?: number;
  }

  let { isActive, showTest = false, glowColor, innerWidth = 800, innerHeight = 600, borderRect, bloomIntensity = 1.5, bloomThreshold = 0.15, bloomRadius = 0.4, exposure = 1, particleSize = 0.01, particleSpread = 15, particleCount = 100, maxParticleSize = 0.02, tubeRadius = 3 }: Props = $props();

  let time = $state(0);

  // Particle system
  let particleSystem = $state<Points | undefined>(undefined);
  let particleGeometry = $state<BufferGeometry | undefined>(undefined);
  let particleMaterial = $state<ShaderMaterial | undefined>(undefined);

  // Postprocessing
  const { renderer, scene, camera, size, renderStage, autoRender } = useThrelte();
  let composer: EffectComposer | undefined = undefined;
  let bloomEffect: BloomEffect | undefined = undefined;
  let particlesInitialized = $state(false);

  // Track previous values
  let prevBloomIntensity = bloomIntensity;
  let prevBloomThreshold = bloomThreshold;
  let prevBloomRadius = bloomRadius;
  let prevParticleCount = particleCount;
  let prevParticleSpread = particleSpread;

  // Color parsing
  const particleColor = $derived(() => {
    const color = new Color(glowColor);
    return color;
  });

  const shaderUniforms = {
    uTime: { value: 0 },
    uColor: { value: new Color(glowColor) },
    uPixelRatio: { value: typeof window !== "undefined" ? window.devicePixelRatio : 1 },
    uParticleSize: { value: 0.01 },
    uMaxParticleSize: { value: 0.25 },
  };

  const vertexShader = `
    attribute float aSize;
    attribute float aTime;
    attribute float aRandom;
    attribute vec3 aOriginalPosition;
    
    uniform float uTime;
    uniform float uPixelRatio;
    uniform float uParticleSize;
    uniform float uMaxParticleSize;
    
    varying float vRandom;
    varying float vTime;
    varying vec3 vWorldPosition;
    varying float vAlpha;
    
    void main() {
      vRandom = aRandom;
      vTime = aTime;
      
      vec3 pos = position;
      
      // Gentle floating motion
      pos.x += sin(uTime * 0.3 + aTime) * 0.5 + sin(uTime * 0.8 + aTime * 2.0) * 0.2;
      pos.y += cos(uTime * 0.2 + aTime) * 0.4 + cos(uTime * 0.6 + aTime * 1.5) * 0.1;
      pos.z += sin(uTime * 0.4 + aTime) * 0.8;
      
      // Add attraction back to original position for natural movement
      vec3 direction = aOriginalPosition - pos;
      pos += direction * 0.005;
      
      vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      
      gl_Position = projectedPosition;
      
      vWorldPosition = modelPosition.xyz;
      
      // Dynamic size with breathing effect
      float breathe = sin(uTime * 1.5 + aTime) * 0.1 + 1.0;
      float depthScale = (1.0 / (1.0 + -viewPosition.z * 0.01));
      
      // Calculate base size where uParticleSize is the average final size
      float sizeVariation = aSize * 1.25;
      float baseSize = uParticleSize * sizeVariation * breathe * depthScale;
      
      // Scale up variation if maxParticleSize is much larger than particleSize
      float maxSize = uMaxParticleSize;
      float sizeRange = max(maxSize / uParticleSize, 1.0); // How much larger max is than base
      float expandedSize = baseSize * (1.0 + (sizeRange - 1.0) * (aSize - 0.2) / 0.8); // Larger particles get more scaling
      
      float finalSize = expandedSize * uPixelRatio * 10.0;
      float maxFinalSize = maxSize * uPixelRatio * 10.0;
      gl_PointSize = min(finalSize, maxFinalSize);
      
      // Variable alpha for twinkling effect
      vAlpha = 0.6 + 0.4 * sin(uTime * 2.0 + aTime * 2.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 uColor;
    uniform float uTime;
    
    varying float vRandom;
    varying float vTime;
    varying vec3 vWorldPosition;
    varying float vAlpha;
    
    void main() {
      // Create circular particles with soft edges
      vec2 center = gl_PointCoord - 0.5;
      float distance = length(center);
      
      if (distance > 0.5) {
        discard;
      }
      
      // Create a dreamy glow effect with multiple falloffs
      float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
      alpha = pow(alpha, 1.5);
      
      // Add inner glow
      float innerGlow = 1.0 - smoothstep(0.0, 0.2, distance);
      alpha += innerGlow * 0.5;
      
      // Apply twinkling from vertex shader
      alpha *= vAlpha;
      
      // Enhanced golden color with subtle variations
      vec3 color = uColor;
      
      // Add golden sparkle
      color = mix(color, vec3(1.0, 0.8, 0.3), innerGlow * 0.3);
      
      // Add subtle color variation per particle
      color += vec3(0.1, 0.05, 0.0) * vRandom;
      
      // Boost brightness for bloom effect
      color *= 1.5;
      
      gl_FragColor = vec4(color, alpha * 0.8);
    }
  `;

  // Path curve for particles to follow
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

  function initializeParticles() {
    if (!particleGeometry) return;

    particleGeometry.deleteAttribute("position");
    particleGeometry.deleteAttribute("aOriginalPosition");
    particleGeometry.deleteAttribute("aSize");
    particleGeometry.deleteAttribute("aTime");
    particleGeometry.deleteAttribute("aRandom");

    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const times = new Float32Array(particleCount);
    const randoms = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      const pathPoint = path.getPoint(t);

      const spread = particleSpread;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * spread;

      const x = pathPoint.x + Math.cos(angle) * radius;
      const y = pathPoint.y + Math.sin(angle) * radius;
      const z = pathPoint.z + (Math.random() - 0.5) * 20;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      sizes[i] = Math.random() * 0.8 + 0.2;
      times[i] = Math.random() * Math.PI * 2;
      randoms[i] = Math.random();
    }

    particleGeometry.setAttribute("position", new BufferAttribute(positions, 3));
    particleGeometry.setAttribute("aOriginalPosition", new BufferAttribute(originalPositions, 3));
    particleGeometry.setAttribute("aSize", new BufferAttribute(sizes, 1));
    particleGeometry.setAttribute("aTime", new BufferAttribute(times, 1));
    particleGeometry.setAttribute("aRandom", new BufferAttribute(randoms, 1));

    particlesInitialized = true;
    console.log("Particles initialized with count:", particleCount, "spread:", particleSpread);
  }

  function setupPostProcessing() {
    if (!renderer || !scene || !camera?.current) return;

    if (composer) {
      composer.dispose();
    }

    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera.current));

    bloomEffect = new BloomEffect({
      intensity: bloomIntensity,
      luminanceThreshold: bloomThreshold,
      luminanceSmoothing: 0.08,
      mipmapBlur: true,
      kernelSize: KernelSize.MEDIUM,
      width: Math.max(innerWidth * bloomRadius, 32),
      height: Math.max(innerHeight * bloomRadius, 32),
    });

    composer.addPass(new EffectPass(camera.current, bloomEffect));

    prevBloomIntensity = bloomIntensity;
    prevBloomThreshold = bloomThreshold;
    prevBloomRadius = bloomRadius;

    console.log("Post-processing setup with:", {
      bloomIntensity,
      bloomThreshold,
      bloomRadius,
      effectIntensity: bloomEffect.intensity,
    });
  }

  onMount(() => {
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
    };
  });

  $effect(() => {
    if (composer && innerWidth && innerHeight) {
      composer.setSize(innerWidth, innerHeight);
    }
  });

  $effect(() => {
    if (isActive && renderer && scene && camera?.current) {
      autoRender.set(false);
      setupPostProcessing();
    } else if (!isActive) {
      autoRender.set(true);
      if (composer) {
        composer.dispose();
        composer = undefined;
      }
      bloomEffect = undefined;
      particlesInitialized = false;
    }
  });

  // PArticle animation loop
  useTask((delta: number) => {
    time += delta;

    if (isActive && particleGeometry && !particlesInitialized) {
      initializeParticles();
    }

    if (isActive && particleGeometry && particlesInitialized) {
      const particleChanged = prevParticleCount !== particleCount || prevParticleSpread !== particleSpread;

      if (particleChanged) {
        console.log("Particle parameters changed, reinitializing...", { particleCount, particleSpread });
        prevParticleCount = particleCount;
        prevParticleSpread = particleSpread;
        particlesInitialized = false;
        initializeParticles();
      }
    }

    if (isActive && bloomEffect) {
      const bloomChanged = prevBloomIntensity !== bloomIntensity || prevBloomThreshold !== bloomThreshold || prevBloomRadius !== bloomRadius;

      if (bloomChanged) {
        console.log("Bloom parameters changed, updating effect...", { bloomIntensity, bloomThreshold, bloomRadius });

        setupPostProcessing();
      }
    }

    if (particleMaterial && particlesInitialized && isActive) {
      particleMaterial.uniforms.uTime.value = time;
      particleMaterial.uniforms.uParticleSize.value = particleSize;

      // Debug logging
      if (particleMaterial.uniforms.uMaxParticleSize.value !== maxParticleSize) {
        const pixelRatio = typeof window !== "undefined" ? window.devicePixelRatio : 1;
        const avgFinalSize = particleSize * 1.0 * 1.0 * pixelRatio * 10.0; // average case
        const maxFinalSize = maxParticleSize * pixelRatio * 10.0;
        console.log("New size logic - particleSize:", particleSize, "-> avgFinalSize:", avgFinalSize, "| maxParticleSize:", maxParticleSize, "-> maxFinalSize:", maxFinalSize, "| Will clamp?", avgFinalSize > maxFinalSize);
      }
      particleMaterial.uniforms.uMaxParticleSize.value = maxParticleSize;

      particleMaterial.uniforms.uColor.value.copy(particleColor());
    }

    if (renderer) {
      renderer.toneMappingExposure = exposure;
    }
  });

  useTask(
    (delta: number) => {
      if (isActive && composer) {
        composer.render(delta);
      }
    },
    { stage: renderStage, autoInvalidate: false }
  );
</script>

<T.OrthographicCamera makeDefault position={[0, 0, 50]} />

{#if showTest}
  <T.Mesh name="Test">
    <T.BoxGeometry args={[innerWidth, innerHeight, 1]} />
    <T.MeshBasicMaterial color="hotpink" opacity={0.25} transparent />
  </T.Mesh>
{/if}

{#if isActive}
  <T.Points bind:ref={particleSystem} name="DreamyParticles">
    <T.BufferGeometry bind:ref={particleGeometry}></T.BufferGeometry>
    <T.ShaderMaterial bind:ref={particleMaterial} {vertexShader} {fragmentShader} uniforms={shaderUniforms} transparent={true} blending={AdditiveBlending} depthWrite={false} />
  </T.Points>

  <T.Mesh name="BackgroundTube">
    <T.TubeGeometry args={[path, 200, tubeRadius * 0.3, 10, true]} />
    <T.MeshBasicMaterial color={glowColor} opacity={0.05} transparent blending={AdditiveBlending} />
  </T.Mesh>
{/if}
