<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
  import { Vector3, Curve, BufferGeometry, BufferAttribute, Points, ShaderMaterial, AdditiveBlending, Color, HalfFloatType, MeshStandardMaterial } from "three";
  import { EffectComposer, EffectPass, RenderPass, BloomEffect, KernelSize, ToneMappingEffect } from "postprocessing";
  import { onMount } from "svelte";
  import { buttPanelState } from "./buttPanelState.svelte";
  import { ParticleTubeState } from "./sceneStates";
  import { innerWidth, innerHeight } from "svelte/reactivity/window";

  const isActive = $derived(buttPanelState.isActive);
  const showTest = $derived(buttPanelState.showTest);
  const borderRect = $derived(buttPanelState.borderRect);

  const currentSceneState = $derived(buttPanelState.currentSceneState);
  const bloomIntensity = $derived((currentSceneState as ParticleTubeState).bloomIntensity);
  const bloomThreshold = $derived((currentSceneState as ParticleTubeState).bloomThreshold);
  const bloomRadius = $derived((currentSceneState as ParticleTubeState).bloomRadius);
  const particleExposure = $derived((currentSceneState as ParticleTubeState).particleExposure);
  const particleSize = $derived((currentSceneState as ParticleTubeState).particleSize);
  const particleSpread = $derived((currentSceneState as ParticleTubeState).particleSpread);
  const particleCount = $derived((currentSceneState as ParticleTubeState).particleCount);
  const maxParticleSize = $derived((currentSceneState as ParticleTubeState).maxParticleSize);
  const particleSpeed = $derived((currentSceneState as ParticleTubeState).particleSpeed);
  const tubeRadius = $derived((currentSceneState as ParticleTubeState).tubeRadius);
  const enableFloating = $derived((currentSceneState as ParticleTubeState).enableMotion);
  const glowColor = $derived((currentSceneState as ParticleTubeState).color);
  const toneMappingPreset = $derived((currentSceneState as ParticleTubeState).toneMappingPreset);
  const toneMappingEffect = $derived(
    new ToneMappingEffect({
      mode: (currentSceneState as ParticleTubeState).getToneMappingMode(toneMappingPreset),
    })
  );

  let time = $state(0);
  let animatedAlpha = $state(0);

  let particleSystem = $state<Points | undefined>(undefined);
  let particleGeometry = $state<BufferGeometry | undefined>(undefined);
  let particleMaterial = $state<ShaderMaterial | undefined>(undefined);
  let tubeMaterial = $state<MeshStandardMaterial | undefined>(undefined);

  const { renderer, scene, camera, size, renderStage, autoRender } = useThrelte();
  let composer: EffectComposer | undefined = undefined;
  let bloomEffect: BloomEffect | undefined = undefined;
  let particlesInitialized = $state(false);

  const particleColor = $derived(() => {
    const color = new Color(glowColor);
    return color;
  });

  const uniforms = {
    uTime: { value: 0 },
    uColor: { value: new Color("#fff") },
    uPixelRatio: { value: typeof window !== "undefined" ? window.devicePixelRatio : 1 },
    uParticleSize: { value: 0.01 },
    uMaxParticleSize: { value: 0.25 },
    uParticleSpeed: { value: 1 },
    uEnableFloating: { value: 1.0 },
    uBorderRect: { value: [800, 600] },
    uCornerRadius: { value: 45 },
    uExposure: { value: 1.0 },
    uMasterAlpha: { value: 0.0 },
  };

  const vertexShader = `
    attribute float aSize;
    attribute float aTime;
    attribute float aRandom;
    attribute vec3 aOriginalPosition;
    attribute float aFloatPhase;
    attribute float aFloatRadius;
    attribute float aVelocity;
    attribute float aPathOffset;
    
    uniform float uTime;
    uniform float uPixelRatio;
    uniform float uParticleSize;
    uniform float uMaxParticleSize;
    uniform float uParticleSpeed;
    uniform float uEnableFloating;
    uniform vec2 uBorderRect;
    uniform float uCornerRadius;
    uniform float uExposure;
    
    varying float vRandom;
    varying float vTime;
    varying vec3 vWorldPosition;
    varying float vAlpha;
    
    // Function to calculate point on rounded rectangle path
    vec3 getPathPoint(float t) {
      float width = uBorderRect.x;
      float height = uBorderRect.y;
      float r = uCornerRadius;
      
      float halfWidth = width * 0.5;
      float halfHeight = height * 0.5;
      
      float straightWidth = width - 2.0 * r;
      float straightHeight = height - 2.0 * r;
      float cornerArcLength = (3.14159 * 0.5) * r;
      float totalPerimeter = 2.0 * straightWidth + 2.0 * straightHeight + 4.0 * cornerArcLength;
      
      float distance = t * totalPerimeter;
      
      float tx, ty;
      
      if (distance <= straightWidth) {
        tx = -halfWidth + r + distance;
        ty = -halfHeight;
      } else if (distance <= straightWidth + cornerArcLength) {
        float arcT = (distance - straightWidth) / cornerArcLength;
        float angle = -3.14159 * 0.5 + arcT * (3.14159 * 0.5);
        tx = halfWidth - r + r * cos(angle);
        ty = -halfHeight + r + r * sin(angle);
      } else if (distance <= straightWidth + cornerArcLength + straightHeight) {
        float edgeT = distance - straightWidth - cornerArcLength;
        tx = halfWidth;
        ty = -halfHeight + r + edgeT;
      } else if (distance <= straightWidth + 2.0 * cornerArcLength + straightHeight) {
        float arcT = (distance - straightWidth - cornerArcLength - straightHeight) / cornerArcLength;
        float angle = arcT * (3.14159 * 0.5);
        tx = halfWidth - r + r * cos(angle);
        ty = halfHeight - r + r * sin(angle);
      } else if (distance <= 2.0 * straightWidth + 2.0 * cornerArcLength + straightHeight) {
        float edgeT = distance - straightWidth - 2.0 * cornerArcLength - straightHeight;
        tx = halfWidth - r - edgeT;
        ty = halfHeight;
      } else if (distance <= 2.0 * straightWidth + 3.0 * cornerArcLength + straightHeight) {
        float arcT = (distance - 2.0 * straightWidth - 2.0 * cornerArcLength - straightHeight) / cornerArcLength;
        float angle = 3.14159 * 0.5 + arcT * (3.14159 * 0.5);
        tx = -halfWidth + r + r * cos(angle);
        ty = halfHeight - r + r * sin(angle);
      } else if (distance <= 2.0 * straightWidth + 3.0 * cornerArcLength + 2.0 * straightHeight) {
        float edgeT = distance - 2.0 * straightWidth - 3.0 * cornerArcLength - straightHeight;
        tx = -halfWidth;
        ty = halfHeight - r - edgeT;
      } else {
        float arcT = (distance - 2.0 * straightWidth - 3.0 * cornerArcLength - 2.0 * straightHeight) / cornerArcLength;
        float angle = 3.14159 + arcT * (3.14159 * 0.5);
        tx = -halfWidth + r + r * cos(angle);
        ty = -halfHeight + r + r * sin(angle);
      }
      
      return vec3(tx, ty, 0.0);
    }
    
    void main() {
      vRandom = aRandom;
      vTime = aTime;
      
      // Calculate particle's position along the path (continuous loop)
      float speedTime = uTime * uParticleSpeed;
      float t = mod(speedTime * aVelocity + aPathOffset, 1.0);
      vec3 pathPos = getPathPoint(t);
      
      vec3 pos = pathPos;
      
      if (uEnableFloating > 0.5) {
        // Floating motion around the path
        float radialPhase = speedTime * 0.5 + aFloatPhase;
        float radialDistance = aFloatRadius * (1.0 + 0.3 * sin(speedTime * 2.0 + aFloatPhase));
        
        // Calculate tangent for proper normal/binormal
        float nextT = mod(t + 0.01, 1.0);
        vec3 nextPathPos = getPathPoint(nextT);
        vec3 tangent = normalize(nextPathPos - pathPos);
        vec3 up = vec3(0.0, 0.0, 1.0);
        vec3 normal = normalize(cross(tangent, up));
        vec3 binormal = normalize(cross(tangent, normal));
        
        // Tube radius
        pos += cos(radialPhase) * radialDistance * normal + sin(radialPhase) * radialDistance * binormal;
        
        // Depth variation
        pos.x += sin(speedTime * 1.5 + aFloatPhase) * 3.0;
        pos.y += cos(speedTime * 1.2 + aFloatPhase * 1.5) * 3.0;
        pos.z += sin(speedTime * 2.0 + aFloatPhase * 2.0) * 5.0;
      } else {
        // Simple motion when floating is disabled
        pos.x += sin(speedTime * 0.3 + aTime) * 0.5 + sin(speedTime * 0.8 + aTime * 2.0) * 0.2;
        pos.y += cos(speedTime * 0.2 + aTime) * 0.4 + cos(speedTime * 0.6 + aTime * 1.5) * 0.1;
        pos.z += sin(speedTime * 0.4 + aTime) * 0.8;
      }
      
      vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      
      gl_Position = projectedPosition;
      
      vWorldPosition = modelPosition.xyz;
      
      float breathe = sin(speedTime * 1.5 + aTime) * 0.1 + 1.0;
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
      vAlpha = 0.6 + 0.4 * sin(speedTime * 2.0 + aTime * 2.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 uColor;
    uniform float uTime;
    uniform float uExposure;
    uniform float uMasterAlpha;
    
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
      
      // Create glow effect with multiple falloffs
      float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
      alpha = pow(alpha, 1.5);
      
      // Inner glow
      float innerGlow = 1.0 - smoothstep(0.0, 0.2, distance);
      alpha += innerGlow * 0.5;
      
      // Apply twinkling from vertex shader
      alpha *= vAlpha;
      
      vec3 color = uColor;
      color = mix(color, vec3(1.0, 0.8, 0.3), innerGlow * 0.3);
      
      // Color variation per particle
      color += vec3(0.1, 0.05, 0.0) * vRandom;
      
      // Bloom effect
      color *= 1.5;
      color *= uExposure;
      
      gl_FragColor = vec4(color, alpha * 0.8 * uMasterAlpha);
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

  function initializeParticles() {
    if (!particleGeometry) return;

    particleGeometry.deleteAttribute("position");
    particleGeometry.deleteAttribute("aOriginalPosition");
    particleGeometry.deleteAttribute("aSize");
    particleGeometry.deleteAttribute("aTime");
    particleGeometry.deleteAttribute("aRandom");
    particleGeometry.deleteAttribute("aFloatPhase");
    particleGeometry.deleteAttribute("aFloatRadius");
    particleGeometry.deleteAttribute("aVelocity");
    particleGeometry.deleteAttribute("aPathOffset");

    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const times = new Float32Array(particleCount);
    const randoms = new Float32Array(particleCount);
    const floatPhases = new Float32Array(particleCount);
    const floatRadii = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount);
    const pathOffsets = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Start with origin position - particles will be positioned by shader
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      originalPositions[i * 3] = 0;
      originalPositions[i * 3 + 1] = 0;
      originalPositions[i * 3 + 2] = 0;

      sizes[i] = Math.random() * 0.8 + 0.2;
      times[i] = Math.random() * Math.PI * 2;
      randoms[i] = Math.random();
      floatPhases[i] = Math.random() * Math.PI * 2;
      floatRadii[i] = Math.random() * particleSpread * 0.5 + 5;
      velocities[i] = Math.random() * 0.02 + 0.005;
      pathOffsets[i] = i / particleCount; // Distribute particles along path
    }

    particleGeometry.setAttribute("position", new BufferAttribute(positions, 3));
    particleGeometry.setAttribute("aOriginalPosition", new BufferAttribute(originalPositions, 3));
    particleGeometry.setAttribute("aSize", new BufferAttribute(sizes, 1));
    particleGeometry.setAttribute("aTime", new BufferAttribute(times, 1));
    particleGeometry.setAttribute("aRandom", new BufferAttribute(randoms, 1));
    particleGeometry.setAttribute("aFloatPhase", new BufferAttribute(floatPhases, 1));
    particleGeometry.setAttribute("aFloatRadius", new BufferAttribute(floatRadii, 1));
    particleGeometry.setAttribute("aVelocity", new BufferAttribute(velocities, 1));
    particleGeometry.setAttribute("aPathOffset", new BufferAttribute(pathOffsets, 1));

    particlesInitialized = true;
  }

  function setupPostProcessing() {
    if (!renderer || !scene || !camera?.current) return;

    if (composer) {
      composer.dispose();
    }

    composer = new EffectComposer(renderer, { frameBufferType: HalfFloatType });
    composer.addPass(new RenderPass(scene, camera.current));

    bloomEffect = new BloomEffect({
      intensity: bloomIntensity,
      luminanceThreshold: bloomThreshold,
      luminanceSmoothing: 2,
      mipmapBlur: true,
      kernelSize: KernelSize.VERY_SMALL,
      radius: bloomRadius,
    });

    composer.addPass(new EffectPass(camera.current, bloomEffect, toneMappingEffect));
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
    if (composer && innerWidth.current && innerHeight.current) {
      composer.setSize(innerWidth.current, innerHeight.current);
    }
  });

  $effect(() => {
    if (isActive) {
      if (renderer && scene && camera?.current) {
        autoRender.set(false);
        setupPostProcessing();
        if (particleGeometry && !particlesInitialized) {
          initializeParticles();
        }
      }
    }
  });

  $effect(() => {
    if (!isActive && animatedAlpha < 0.01) {
      autoRender.set(true);
      if (composer) {
        composer.dispose();
        composer = undefined;
      }
      bloomEffect = undefined;
      particlesInitialized = false;
    }
  });

  $effect(() => {
    if (isActive && particleGeometry) {
      particleCount;
      particleSpread;
      particlesInitialized = false;
      initializeParticles();
    }
  });

  $effect(() => {
    if (isActive && renderer && scene && camera?.current) {
      bloomIntensity;
      bloomThreshold;
      bloomRadius;
      toneMappingPreset;
      setupPostProcessing();
    }
  });

  $effect(() => {
    if (particleMaterial) {
      particleMaterial.uniforms.uParticleSize.value = particleSize;
      particleMaterial.uniforms.uMaxParticleSize.value = maxParticleSize;
      particleMaterial.uniforms.uParticleSpeed.value = particleSpeed;
      particleMaterial.uniforms.uEnableFloating.value = enableFloating ? 1.0 : 0.0;
      particleMaterial.uniforms.uBorderRect.value = [borderRect.width, borderRect.height];
      particleMaterial.uniforms.uCornerRadius.value = 45;
      particleMaterial.uniforms.uColor.value.copy(particleColor());
      particleMaterial.uniforms.uExposure.value = particleExposure;
    }
  });

  useTask((delta: number) => {
    time += delta;

    // Animate master alpha for fade in/out
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

    // Update tube opacity
    if (tubeMaterial) {
      tubeMaterial.opacity = animatedAlpha * 0.5;
    }

    // Initialize particles on first frame when active
    if (isActive && particleGeometry && !particlesInitialized) {
      initializeParticles();
    }

    // Update uniforms
    if (particleMaterial) {
      particleMaterial.uniforms.uTime.value = time;
      particleMaterial.uniforms.uMasterAlpha.value = animatedAlpha;
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

<T.OrthographicCamera makeDefault position={[0, 0, 20]} far={100} />

{#if showTest}
  <T.Mesh name="Test">
    <T.BoxGeometry args={[innerWidth.current ?? 800, innerHeight.current ?? 600, 1]} />
    <T.MeshBasicMaterial color="hotpink" opacity={0.25} transparent />
  </T.Mesh>
{/if}

<!-- {#if showTest}
  <T.Mesh name="Test">
    <T.BoxGeometry args={[innerWidth.current ?? 800, innerHeight.current ?? 600, 1]} />
    <T.MeshBasicMaterial color="hotpink" opacity={0.25} transparent />
  </T.Mesh>
{/if}

{#if isActive}
  <T.Points bind:ref={particleSystem} name="particles">
    <T.BufferGeometry bind:ref={particleGeometry}></T.BufferGeometry>
    <T.ShaderMaterial bind:ref={particleMaterial} {vertexShader} {fragmentShader} uniforms={uniforms} transparent={true} blending={AdditiveBlending} depthWrite={false} />
  </T.Points>

  <T.Mesh name="tube">
    <T.TubeGeometry args={[path, 200, tubeRadius * 0.3, 10, true]} />
    <T.MeshBasicMaterial color={glowColor} opacity={0.05} transparent blending={AdditiveBlending} />
  </T.Mesh>
{/if} -->

<!-- {#if isActive} -->
<!-- <T.Points bind:ref={particleSystem} name="particles">
    <T.BufferGeometry bind:ref={particleGeometry}></T.BufferGeometry>
    <T.ShaderMaterial bind:ref={particleMaterial} {vertexShader} {fragmentShader} uniforms={uniforms} transparent={true} blending={AdditiveBlending} depthTest={false} dithering={true} alphaToCoverage={true} />
  </T.Points> -->
<T.Points bind:ref={particleSystem} name="particles">
  <T.BufferGeometry bind:ref={particleGeometry}></T.BufferGeometry>
  <T.ShaderMaterial bind:ref={particleMaterial} {vertexShader} {fragmentShader} {uniforms} transparent={true} blending={AdditiveBlending} depthWrite={false} />
</T.Points>

<T.Mesh name="tube">
  <T.TubeGeometry args={[path, 200, tubeRadius * 0.3, 10, true]} />
  <T.MeshStandardMaterial bind:ref={tubeMaterial} emissiveIntensity={5} color={glowColor} opacity={0.5} transparent emissive={glowColor} depthTest={false} dithering={true} blending={AdditiveBlending} />
</T.Mesh>
<!-- {/if} -->
