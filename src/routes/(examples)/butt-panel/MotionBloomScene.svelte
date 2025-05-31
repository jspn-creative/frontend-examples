<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
  import { AdditiveBlending, Color, HalfFloatType, MeshBasicMaterial, ShaderMaterial, UniformsUtils, Vector2, Vector3, WebGLRenderTarget, Mesh, PlaneGeometry, BufferGeometry, BufferAttribute, Points } from "three";
  import { LuminosityHighPassShader } from "three/examples/jsm/shaders/LuminosityHighPassShader.js";
  import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";
  import { onMount } from "svelte";

  interface Props {
    isActive: boolean;
    strength?: number;
    radius?: number;
    threshold?: number;
    resolution?: { x: number; y: number };
    innerWidth?: number;
    innerHeight?: number;
    showTest?: boolean;
    glowColor?: string;
    showParticles?: boolean;
    particleCount?: number;
    particleSize?: number;
    maxParticleSize?: number;
    particleSpread?: number;
  }

  let { isActive, strength = 1.0, radius = 0.1, threshold = 0.5, resolution = { x: 256, y: 256 }, innerWidth = 800, innerHeight = 600, showTest = false, glowColor = "white", showParticles = true, particleCount = 150, particleSize = 0.015, maxParticleSize = 0.03, particleSpread = 80 }: Props = $props();

  // Threlte context
  const { renderer, scene, camera, autoRender } = useThrelte();

  // Motion Bloom Pass state
  let motionBloomPass = $state<MotionBloomPassImpl | undefined>(undefined);
  let initialized = $state(false);

  // Particle system state
  let particleSystem = $state<Points | undefined>(undefined);
  let particleGeometry = $state<BufferGeometry | undefined>(undefined);
  let particleMaterial = $state<ShaderMaterial | undefined>(undefined);
  let particlesInitialized = $state(false);
  let time = $state(0);

  // Track previous values to detect changes
  let prevStrength = strength;
  let prevRadius = radius;
  let prevThreshold = threshold;
  let prevResolution = resolution;
  let prevParticleCount = particleCount;
  let prevParticleSpread = particleSpread;

  // Color parsing for particles
  const particleColor = $derived(() => {
    const color = new Color(glowColor);
    return color;
  });

  // Particle shader uniforms
  const shaderUniforms = {
    uTime: { value: 0 },
    uColor: { value: new Color(glowColor) },
    uPixelRatio: { value: typeof window !== "undefined" ? window.devicePixelRatio : 1 },
    uParticleSize: { value: particleSize },
    uMaxParticleSize: { value: maxParticleSize },
  };

  // Particle shaders
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
      
      // Floating motion
      pos.x += sin(uTime * 0.3 + aTime) * 0.8 + sin(uTime * 0.8 + aTime * 2.0) * 0.3;
      pos.y += cos(uTime * 0.2 + aTime) * 0.6 + cos(uTime * 0.6 + aTime * 1.5) * 0.2;
      pos.z += sin(uTime * 0.4 + aTime) * 1.2;
      
      // Attraction back to original position
      vec3 direction = aOriginalPosition - pos;
      pos += direction * 0.008;
      
      vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      
      gl_Position = projectedPosition;
      vWorldPosition = modelPosition.xyz;
      
      // Dynamic size with breathing effect
      float breathe = sin(uTime * 1.5 + aTime) * 0.15 + 1.0;
      float depthScale = (1.0 / (1.0 + -viewPosition.z * 0.01));
      
      float sizeVariation = aSize * 1.25;
      float baseSize = uParticleSize * sizeVariation * breathe * depthScale;
      
      float maxSize = uMaxParticleSize;
      float sizeRange = max(maxSize / uParticleSize, 1.0);
      float expandedSize = baseSize * (1.0 + (sizeRange - 1.0) * (aSize - 0.2) / 0.8);
      
      float finalSize = expandedSize * uPixelRatio * 10.0;
      float maxFinalSize = maxSize * uPixelRatio * 10.0;
      gl_PointSize = min(finalSize, maxFinalSize);
      
      // Variable alpha for twinkling
      vAlpha = 0.7 + 0.3 * sin(uTime * 2.0 + aTime * 2.0);
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
      vec2 center = gl_PointCoord - 0.5;
      float distance = length(center);
      
      if (distance > 0.5) {
        discard;
      }
      
      // Dreamy glow effect
      float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
      alpha = pow(alpha, 1.5);
      
      // Inner glow
      float innerGlow = 1.0 - smoothstep(0.0, 0.2, distance);
      alpha += innerGlow * 0.5;
      
      // Apply twinkling
      alpha *= vAlpha;
      
      // Enhanced color with variations
      vec3 color = uColor;
      color = mix(color, vec3(1.0, 0.8, 0.3), innerGlow * 0.3);
      color += vec3(0.1, 0.05, 0.0) * vRandom;
      
      // Boost brightness for bloom
      color *= 1.8;
      
      gl_FragColor = vec4(color, alpha * 0.9);
    }
  `;

  class MotionBloomPassImpl {
    strength: number;
    radius: number;
    threshold: number;
    resolution: Vector2;

    BlurDirectionX: Vector2;
    BlurDirectionY: Vector2;
    clearColor: Color;

    renderTargetsHorizontal: WebGLRenderTarget[] = [];
    renderTargetsVertical: WebGLRenderTarget[] = [];
    renderTargetBright!: WebGLRenderTarget;
    nMips = 5;

    highPassUniforms: any;
    materialHighPassFilter!: ShaderMaterial;
    separableBlurMaterials: ShaderMaterial[] = [];
    compositeMaterial!: ShaderMaterial;
    blendMaterial!: ShaderMaterial;
    copyUniforms: any;

    basic!: MeshBasicMaterial;
    fsQuad!: Mesh;

    _oldClearColor = new Color();
    oldClearAlpha = 1;

    constructor(resolution: Vector2, strength: number, radius: number, threshold: number) {
      this.strength = strength;
      this.radius = radius;
      this.threshold = threshold;
      this.resolution = new Vector2(resolution.x, resolution.y);

      this.BlurDirectionX = new Vector2(2, 1.1);
      this.BlurDirectionY = new Vector2(1.0, 1.0);
      this.clearColor = new Color(0, 0, 0);

      this.setupRenderTargets();
      this.setupMaterials();
      this.setupQuad();
    }

    setupRenderTargets() {
      let resx = Math.round(this.resolution.x / 2);
      let resy = Math.round(this.resolution.y / 2);

      this.renderTargetBright = new WebGLRenderTarget(resx, resy, { type: HalfFloatType });
      this.renderTargetBright.texture.name = "MotionBloomPass.bright";
      this.renderTargetBright.texture.generateMipmaps = false;

      for (let i = 0; i < this.nMips; i++) {
        const renderTargetHorizontal = new WebGLRenderTarget(resx, resy, { type: HalfFloatType });
        renderTargetHorizontal.texture.name = "MotionBloomPass.h" + i;
        renderTargetHorizontal.texture.generateMipmaps = false;
        this.renderTargetsHorizontal.push(renderTargetHorizontal);

        const renderTargetVertical = new WebGLRenderTarget(resx, resy, { type: HalfFloatType });
        renderTargetVertical.texture.name = "MotionBloomPass.v" + i;
        renderTargetVertical.texture.generateMipmaps = false;
        this.renderTargetsVertical.push(renderTargetVertical);

        resx = Math.round(resx / 2);
        resy = Math.round(resy / 2);
      }
    }

    setupMaterials() {
      // High pass material
      const highPassShader = LuminosityHighPassShader;
      this.highPassUniforms = UniformsUtils.clone(highPassShader.uniforms);
      this.highPassUniforms["luminosityThreshold"].value = this.threshold;
      this.highPassUniforms["smoothWidth"].value = 0.01;

      this.materialHighPassFilter = new ShaderMaterial({
        uniforms: this.highPassUniforms,
        vertexShader: highPassShader.vertexShader,
        fragmentShader: highPassShader.fragmentShader,
      });

      // Gaussian blur materials
      const kernelSizeArray = [3, 5, 7, 9, 11];
      let resx = Math.round(this.resolution.x / 2);
      let resy = Math.round(this.resolution.y / 2);

      for (let i = 0; i < this.nMips; i++) {
        this.separableBlurMaterials.push(this.getSeperableBlurMaterial(kernelSizeArray[i]));
        this.separableBlurMaterials[i].uniforms["invSize"].value = new Vector2(1 / resx, 1 / resy);
        resx = Math.round(resx / 2);
        resy = Math.round(resy / 2);
      }

      // Composite material
      this.compositeMaterial = this.getCompositeMaterial(this.nMips);
      this.compositeMaterial.uniforms["blurTexture1"].value = this.renderTargetsVertical[0].texture;
      this.compositeMaterial.uniforms["blurTexture2"].value = this.renderTargetsVertical[1].texture;
      this.compositeMaterial.uniforms["blurTexture3"].value = this.renderTargetsVertical[2].texture;
      this.compositeMaterial.uniforms["blurTexture4"].value = this.renderTargetsVertical[3].texture;
      this.compositeMaterial.uniforms["blurTexture5"].value = this.renderTargetsVertical[4].texture;
      this.compositeMaterial.uniforms["bloomStrength"].value = this.strength;
      this.compositeMaterial.uniforms["bloomRadius"].value = this.radius;

      const bloomFactors = [1.0, 0.8, 0.6, 0.4, 0.2];
      this.compositeMaterial.uniforms["bloomFactors"].value = bloomFactors;
      const bloomTintColors = [new Vector3(1, 1, 1), new Vector3(1, 1, 1), new Vector3(1, 1, 1), new Vector3(1, 1, 1), new Vector3(1, 1, 1)];
      this.compositeMaterial.uniforms["bloomTintColors"].value = bloomTintColors;

      // Blend material
      const copyShader = CopyShader;
      this.copyUniforms = UniformsUtils.clone(copyShader.uniforms);
      this.blendMaterial = new ShaderMaterial({
        uniforms: this.copyUniforms,
        vertexShader: copyShader.vertexShader,
        fragmentShader: copyShader.fragmentShader,
        blending: AdditiveBlending,
        depthTest: false,
        depthWrite: false,
        transparent: true,
      });

      this.basic = new MeshBasicMaterial();
    }

    setupQuad() {
      const geometry = new PlaneGeometry(2, 2);
      this.fsQuad = new Mesh(geometry, this.basic);
    }

    getSeperableBlurMaterial(kernelRadius: number): ShaderMaterial {
      const coefficients = [];
      for (let i = 0; i < kernelRadius; i++) {
        coefficients.push((0.39894 * Math.exp((-0.5 * i * i) / (kernelRadius * kernelRadius))) / kernelRadius);
      }

      return new ShaderMaterial({
        defines: {
          KERNEL_RADIUS: kernelRadius,
        },
        uniforms: {
          colorTexture: { value: null },
          invSize: { value: new Vector2(0.5, 0.5) },
          direction: { value: new Vector2(1, 0) },
          gaussianCoefficients: { value: coefficients },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }
        `,
        fragmentShader: `
          #include <common>
          varying vec2 vUv;
          uniform sampler2D colorTexture;
          uniform vec2 invSize;
          uniform vec2 direction;
          uniform float gaussianCoefficients[KERNEL_RADIUS];

          void main() {
            float weightSum = gaussianCoefficients[0];
            vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
            for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
              float x = float(i);
              float w = gaussianCoefficients[i];
              vec2 uvOffset = direction * invSize * x;
              vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
              vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
              diffuseSum += (sample1 + sample2) * w;
              weightSum += 2.0 * w;
            }
            gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
          }
        `,
      });
    }

    getCompositeMaterial(nMips: number): ShaderMaterial {
      return new ShaderMaterial({
        defines: {
          NUM_MIPS: nMips,
        },
        uniforms: {
          blurTexture1: { value: null },
          blurTexture2: { value: null },
          blurTexture3: { value: null },
          blurTexture4: { value: null },
          blurTexture5: { value: null },
          bloomStrength: { value: 1.0 },
          bloomFactors: { value: null },
          bloomTintColors: { value: null },
          bloomRadius: { value: 0.0 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform sampler2D blurTexture1;
          uniform sampler2D blurTexture2;
          uniform sampler2D blurTexture3;
          uniform sampler2D blurTexture4;
          uniform sampler2D blurTexture5;
          uniform float bloomStrength;
          uniform float bloomRadius;
          uniform float bloomFactors[NUM_MIPS];
          uniform vec3 bloomTintColors[NUM_MIPS];

          float lerpBloomFactor(const in float factor) {
            float mirrorFactor = 1.2 - factor;
            return mix(factor, mirrorFactor, bloomRadius);
          }

          void main() {
            gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
              lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
              lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
              lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
              lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
          }
        `,
      });
    }

    setSize(width: number, height: number) {
      let resx = Math.round(width / 2);
      let resy = Math.round(height / 2);

      this.renderTargetBright.setSize(resx, resy);

      for (let i = 0; i < this.nMips; i++) {
        this.renderTargetsHorizontal[i].setSize(resx, resy);
        this.renderTargetsVertical[i].setSize(resx, resy);
        this.separableBlurMaterials[i].uniforms["invSize"].value = new Vector2(1 / resx, 1 / resy);
        resx = Math.round(resx / 2);
        resy = Math.round(resy / 2);
      }
    }

    render(renderer: any, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget) {
      renderer.getClearColor(this._oldClearColor);
      this.oldClearAlpha = renderer.getClearAlpha();
      const oldAutoClear = renderer.autoClear;
      renderer.autoClear = false;

      renderer.setClearColor(this.clearColor, 0);

      // 1. Extract Bright Areas
      this.highPassUniforms["tDiffuse"].value = readBuffer.texture;
      this.highPassUniforms["luminosityThreshold"].value = this.threshold;
      this.fsQuad.material = this.materialHighPassFilter;

      renderer.setRenderTarget(this.renderTargetBright);
      renderer.clear();
      renderer.render(this.fsQuad, camera.current);

      // 2. Blur All the mips progressively
      let inputRenderTarget = this.renderTargetBright;

      for (let i = 0; i < this.nMips; i++) {
        this.fsQuad.material = this.separableBlurMaterials[i];

        this.separableBlurMaterials[i].uniforms["colorTexture"].value = inputRenderTarget.texture;
        this.separableBlurMaterials[i].uniforms["direction"].value = this.BlurDirectionX;
        renderer.setRenderTarget(this.renderTargetsHorizontal[i]);
        renderer.clear();
        renderer.render(this.fsQuad, camera.current);

        this.separableBlurMaterials[i].uniforms["colorTexture"].value = this.renderTargetsHorizontal[i].texture;
        this.separableBlurMaterials[i].uniforms["direction"].value = this.BlurDirectionY;
        renderer.setRenderTarget(this.renderTargetsVertical[i]);
        renderer.clear();
        renderer.render(this.fsQuad, camera.current);

        inputRenderTarget = this.renderTargetsVertical[i];
      }

      // Composite All the mips
      this.fsQuad.material = this.compositeMaterial;
      this.compositeMaterial.uniforms["bloomStrength"].value = this.strength;
      this.compositeMaterial.uniforms["bloomRadius"].value = this.radius;

      renderer.setRenderTarget(this.renderTargetsHorizontal[0]);
      renderer.clear();
      renderer.render(this.fsQuad, camera.current);

      // Blend it additively over the input texture
      this.fsQuad.material = this.blendMaterial;
      this.copyUniforms["tDiffuse"].value = this.renderTargetsHorizontal[0].texture;

      renderer.setRenderTarget(writeBuffer);
      renderer.render(this.fsQuad, camera.current);

      // Restore renderer settings
      renderer.setClearColor(this._oldClearColor, this.oldClearAlpha);
      renderer.autoClear = oldAutoClear;
    }

    dispose() {
      for (let i = 0; i < this.renderTargetsHorizontal.length; i++) {
        this.renderTargetsHorizontal[i].dispose();
      }

      for (let i = 0; i < this.renderTargetsVertical.length; i++) {
        this.renderTargetsVertical[i].dispose();
      }

      this.renderTargetBright.dispose();

      for (let i = 0; i < this.separableBlurMaterials.length; i++) {
        this.separableBlurMaterials[i].dispose();
      }

      this.compositeMaterial.dispose();
      this.blendMaterial.dispose();
      this.basic.dispose();
      this.fsQuad.geometry.dispose();
    }
  }

  // Initialize motion bloom pass
  function initializeMotionBloom() {
    if (!renderer || !scene || !camera?.current) return;

    motionBloomPass = new MotionBloomPassImpl(new Vector2(resolution.x, resolution.y), strength, radius, threshold);

    initialized = true;
    console.log("Motion bloom pass initialized");
  }

  // Disable auto rendering when active
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
      if (motionBloomPass) {
        motionBloomPass.dispose();
      }
    };
  });

  // Setup when active
  $effect(() => {
    if (isActive && renderer && scene && camera?.current) {
      autoRender.set(false);
      initializeMotionBloom();
    } else if (!isActive) {
      autoRender.set(true);
      if (motionBloomPass) {
        motionBloomPass.dispose();
        motionBloomPass = undefined;
      }
      initialized = false;
    }
  });

  // Update size when window size changes
  $effect(() => {
    if (motionBloomPass && innerWidth && innerHeight) {
      motionBloomPass.setSize(innerWidth, innerHeight);
    }
  });

  // Check for parameter changes
  $effect(() => {
    if (isActive && motionBloomPass && initialized) {
      const parametersChanged = prevStrength !== strength || prevRadius !== radius || prevThreshold !== threshold || prevResolution.x !== resolution.x || prevResolution.y !== resolution.y;

      if (parametersChanged) {
        console.log("Motion bloom parameters changed, reinitializing...");
        motionBloomPass.dispose();
        prevStrength = strength;
        prevRadius = radius;
        prevThreshold = threshold;
        prevResolution = { ...resolution };
        initializeMotionBloom();
      }
    }

    // Check for particle parameter changes
    if (isActive && showParticles && particleGeometry && particlesInitialized) {
      const particleChanged = prevParticleCount !== particleCount || prevParticleSpread !== particleSpread;

      if (particleChanged) {
        console.log("Particle parameters changed, reinitializing...", { particleCount, particleSpread });
        prevParticleCount = particleCount;
        prevParticleSpread = particleSpread;
        particlesInitialized = false;
        initializeParticles();
      }
    }
  });

  // Animation and render task
  useTask((delta: number) => {
    time += delta;

    // Initialize particles if needed
    if (isActive && showParticles && particleGeometry && !particlesInitialized) {
      initializeParticles();
    }

    // Update particle uniforms
    if (particleMaterial && particlesInitialized && isActive && showParticles) {
      particleMaterial.uniforms.uTime.value = time;
      particleMaterial.uniforms.uParticleSize.value = particleSize;
      particleMaterial.uniforms.uMaxParticleSize.value = maxParticleSize;
      particleMaterial.uniforms.uColor.value.copy(particleColor());
    }

    // Handle motion bloom rendering
    if (isActive && motionBloomPass && initialized && renderer && scene && camera?.current) {
      // Create temporary render targets for the pass
      const renderTarget1 = new WebGLRenderTarget(innerWidth, innerHeight);
      const renderTarget2 = new WebGLRenderTarget(innerWidth, innerHeight);

      // Render scene to first target
      renderer.setRenderTarget(renderTarget1);
      renderer.render(scene, camera.current);

      // Apply motion bloom pass
      motionBloomPass.render(renderer, renderTarget2, renderTarget1);

      // Render to screen
      renderer.setRenderTarget(null);
      renderer.render(scene, camera.current);

      // Clean up
      renderTarget1.dispose();
      renderTarget2.dispose();
    }
  });

  // Initialize particles in a circular pattern
  function initializeParticles() {
    if (!particleGeometry) return;

    // Clear existing attributes
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
      // Distribute particles in a circular pattern with some randomness
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = Math.random() * particleSpread + particleSpread * 0.3;

      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 40;
      const y = Math.sin(angle) * radius + (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 60;

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
</script>

<T.OrthographicCamera makeDefault position={[0, 0, 50]} />

{#if showTest}
  <T.Mesh name="TestGeometry">
    <T.SphereGeometry args={[50, 32, 32]} />
    <T.MeshBasicMaterial color="cyan" />
  </T.Mesh>

  <T.Mesh name="TestBox">
    <T.BoxGeometry args={[100, 20, 20]} />
    <T.MeshBasicMaterial color="orange" />
  </T.Mesh>
{/if}

{#if isActive}
  <!-- Test content for bloom effect -->
  <T.PointLight position={[0, 0, 100]} intensity={2} color="white" />

  <T.Mesh name="BloomTestSphere">
    <T.SphereGeometry args={[30, 32, 32]} />
    <T.MeshBasicMaterial color="hotpink" />
  </T.Mesh>

  {#if showParticles}
    <T.Points bind:ref={particleSystem} name="MotionBloomParticles">
      <T.BufferGeometry bind:ref={particleGeometry}>
        <!-- Geometry will be populated by initializeParticles -->
      </T.BufferGeometry>
      <T.ShaderMaterial bind:ref={particleMaterial} {vertexShader} {fragmentShader} uniforms={shaderUniforms} transparent={true} blending={AdditiveBlending} depthWrite={false} />
    </T.Points>
  {/if}
{/if}
