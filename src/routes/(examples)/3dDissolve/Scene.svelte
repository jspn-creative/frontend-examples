<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
  import { OrbitControls } from "@threlte/extras";
  import * as THREE from "three";
  import { Vector3, Color, SphereGeometry, TorusGeometry, TorusKnotGeometry, MeshPhysicalMaterial, ShaderMaterial, AdditiveBlending, BufferGeometry, BufferAttribute, Points, TextureLoader, CubeTextureLoader, DoubleSide } from "three";
  import { EffectComposer, EffectPass, RenderPass, BloomEffect, KernelSize, BlendFunction } from "postprocessing";
  import { onMount } from "svelte";
  import snoiseShader from "./noise/snoise.glsl?raw";

  const geometries = [new TorusKnotGeometry(6, 2, 140, 140), new SphereGeometry(8, 140, 140), new TorusGeometry(6, 3, 140, 140)];
  const geometryNames = ["Torus Knot", "Sphere", "Torus"];

  let currentGeometry = $state(2);
  let time = $state(0);
  let autoDissolve = $state(true);
  let dissolving = $state(true);

  // Tweakpane
  const controls = $state({
    // Mesh
    meshVisible: true,
    meshColor: "#72a3ff",
    bloomStrength: 1,
    rotationY: 0,

    // Dissolve
    dissolveProgress: 3.5,
    edgeWidth: 2.5,
    frequency: 1.25,
    amplitude: 18.0,
    edgeColor: "#4d9bff",
    autoDissolve: true,

    // Particles
    particleVisible: true,
    particleBaseSize: 230,
    particleColor: "#4d9bff",
    particleSpeedFactor: 0.01,
    waveAmplitude: 0,
    velocityFactor: { x: 0, y: 2 },
  });

  // Mesh references
  let dissolveMesh = $state<THREE.Mesh | undefined>(undefined);
  let particleSystem = $state<THREE.Points | undefined>(undefined);
  let particleGeometry = $state<THREE.BufferGeometry | undefined>(undefined);
  let particleMaterial = $state<THREE.ShaderMaterial | undefined>(undefined);

  // Post-processing
  const { renderer, scene, camera, size, renderStage, autoRender } = useThrelte();
  let composer: EffectComposer | undefined = undefined;
  let bloomEffect: BloomEffect | undefined = undefined;
  let controller: any | undefined = undefined;

  // Dissolve uniforms
  const dissolveUniforms = {
    uEdgeColor: { value: new Color(parseInt(controls.edgeColor.replace("#", ""), 16)) },
    uMeshColor: { value: new Color(parseInt(controls.meshColor.replace("#", ""), 16)) },
    uFreq: { value: 0.25 },
    uAmp: { value: 16.0 },
    uProgress: { value: -7.0 },
    uEdge: { value: 0.8 },
  };

  // Particle uniforms
  const particleUniforms = {
    uTexture: { value: null as THREE.Texture | null },
    uPixelDensity: { value: typeof window !== "undefined" ? window.devicePixelRatio : 1 },
    uProgress: dissolveUniforms.uProgress,
    uEdge: dissolveUniforms.uEdge,
    uAmp: dissolveUniforms.uAmp,
    uFreq: dissolveUniforms.uFreq,
    uBaseSize: { value: 80 },
    uColor: { value: new Color(0x4d9bff) },
  };

  // Particle system data
  let particleCount = 0;
  let particleMaxOffsetArr: Float32Array;
  let particleInitPosArr: Float32Array;
  let particleCurrPosArr: Float32Array;
  let particleVelocityArr: Float32Array;
  let particleDistArr: Float32Array;
  let particleRotationArr: Float32Array;

  const particleData = {
    particleSpeedFactor: 0.02,
    velocityFactor: { x: 2.5, y: 2 },
    waveAmplitude: 0,
  };

  const dissolveVertexShader = `
    varying vec3 vPos;
    
    void main() {
      vPos = position;
      
      #include <begin_vertex>
      #include <project_vertex>
    }
  `;

  const dissolveFragmentShader = `
    varying vec3 vPos;
    
    uniform float uFreq;
    uniform float uAmp;
    uniform float uProgress;
    uniform float uEdge;
    uniform vec3 uEdgeColor;
    uniform vec3 uMeshColor;
    
    ${snoiseShader}
    
    void main() {
      gl_FragColor = vec4(uMeshColor, 1.0);
      
      float noise = snoise(vPos * uFreq) * uAmp;
      
      if(noise < uProgress) discard;
      
      float edgeWidth = uProgress + uEdge;
      
      if(noise > uProgress && noise < edgeWidth) {
        float edgeFactor = 1.0 - (noise - uProgress) / uEdge;
        float brightness = 2.0 + edgeFactor * 10.0;
        gl_FragColor = vec4(uEdgeColor * brightness, 1.0);
      }
    }
  `;

  const particleVertexShader = `
    ${snoiseShader}
    
    uniform float uPixelDensity;
    uniform float uBaseSize;
    uniform float uFreq;
    uniform float uAmp;
    uniform float uEdge;
    uniform float uProgress;
    
    varying float vNoise;
    varying float vAngle;
    
    attribute vec3 aCurrentPos;
    attribute float aDist;
    attribute float aAngle;
    
    void main() {
      vec3 pos = position;
      
      float noise = snoise(pos * uFreq) * uAmp;
      vNoise = noise;
      vAngle = aAngle;
      
      if(vNoise > uProgress - 2.0 && vNoise < uProgress + uEdge + 2.0) {
        pos = aCurrentPos;
      }
      
      vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position = projectedPosition;
      
      float size = uBaseSize * uPixelDensity;
      size = size / (aDist + 1.0);
      gl_PointSize = size / -viewPosition.z;
    }
  `;

  const particleFragmentShader = `
    uniform vec3 uColor;
    uniform float uEdge;
    uniform float uProgress;
    uniform sampler2D uTexture;
    
    varying float vNoise;
    varying float vAngle;
    
    void main() {
      if(vNoise < uProgress) discard;
      if(vNoise > uProgress + uEdge) discard;
      
      vec2 coord = gl_PointCoord;
      coord = coord - 0.5;
      coord = coord * mat2(cos(vAngle), sin(vAngle), -sin(vAngle), cos(vAngle));
      coord = coord + 0.5;
      
      float dist = length(gl_PointCoord - 0.5);
      if(dist > 0.5) discard;
      
      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
      
      gl_FragColor = vec4(uColor * alpha * 1.5, alpha);
    }
  `;

  function initParticleAttributes(geometry: BufferGeometry) {
    if (!particleGeometry) return;

    particleCount = geometry.attributes.position.count;
    particleMaxOffsetArr = new Float32Array(particleCount);
    particleInitPosArr = new Float32Array(geometry.getAttribute("position").array);
    particleCurrPosArr = new Float32Array(geometry.getAttribute("position").array);
    particleVelocityArr = new Float32Array(particleCount * 3);
    particleDistArr = new Float32Array(particleCount);
    particleRotationArr = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      let x = i * 3 + 0;
      let y = i * 3 + 1;
      let z = i * 3 + 2;

      particleMaxOffsetArr[i] = Math.random() * 5.5 + 1.5;

      particleVelocityArr[x] = Math.random() * 0.5 + 0.5;
      particleVelocityArr[y] = Math.random() * 0.5 + 0.5;
      particleVelocityArr[z] = Math.random() * 0.1;

      particleDistArr[i] = 0.001;
      particleRotationArr[i] = Math.random() * Math.PI * 2;
    }

    particleGeometry.setAttribute("aCurrentPos", new BufferAttribute(particleCurrPosArr, 3));
    particleGeometry.setAttribute("aDist", new BufferAttribute(particleDistArr, 1));
    particleGeometry.setAttribute("aAngle", new BufferAttribute(particleRotationArr, 1));
  }

  function calculateWaveOffset(idx: number) {
    const posx = particleCurrPosArr[idx * 3 + 0];
    const posy = particleCurrPosArr[idx * 3 + 1];

    let xwave1 = Math.sin(posy * 2) * (0.8 + particleData.waveAmplitude);
    let ywave1 = Math.sin(posx * 2) * (0.6 + particleData.waveAmplitude);
    let xwave2 = Math.sin(posy * 5) * (0.2 + particleData.waveAmplitude);
    let ywave2 = Math.sin(posx * 1) * (0.9 + particleData.waveAmplitude);

    let xwave = xwave1 + xwave2;
    let ywave = ywave1 + ywave2;

    return { xwave, ywave };
  }

  function updateVelocity(idx: number) {
    let vx = particleVelocityArr[idx * 3 + 0];
    let vy = particleVelocityArr[idx * 3 + 1];
    let vz = particleVelocityArr[idx * 3 + 2];

    vx *= particleData.velocityFactor.x;
    vy *= particleData.velocityFactor.y;

    let { xwave, ywave } = calculateWaveOffset(idx);

    vx += xwave;
    vy += ywave;

    vx *= Math.abs(particleData.particleSpeedFactor);
    vy *= Math.abs(particleData.particleSpeedFactor);
    vz *= Math.abs(particleData.particleSpeedFactor);

    return { vx, vy, vz };
  }

  function updateParticleAttributes() {
    if (!particleGeometry) return;

    for (let i = 0; i < particleCount; i++) {
      let x = i * 3 + 0;
      let y = i * 3 + 1;
      let z = i * 3 + 2;

      let { vx, vy, vz } = updateVelocity(i);

      particleCurrPosArr[x] += vx;
      particleCurrPosArr[y] += vy;
      particleCurrPosArr[z] += vz;

      const vec1 = new Vector3(particleInitPosArr[x], particleInitPosArr[y], particleInitPosArr[z]);
      const vec2 = new Vector3(particleCurrPosArr[x], particleCurrPosArr[y], particleCurrPosArr[z]);
      const dist = vec1.distanceTo(vec2);

      particleDistArr[i] = dist;
      particleRotationArr[i] += 0.01;

      if (dist > particleMaxOffsetArr[i]) {
        particleCurrPosArr[x] = particleInitPosArr[x];
        particleCurrPosArr[y] = particleInitPosArr[y];
        particleCurrPosArr[z] = particleInitPosArr[z];
      }
    }

    particleGeometry.setAttribute("aCurrentPos", new BufferAttribute(particleCurrPosArr, 3));
    particleGeometry.setAttribute("aDist", new BufferAttribute(particleDistArr, 1));
    particleGeometry.setAttribute("aAngle", new BufferAttribute(particleRotationArr, 1));
  }

  function setupPostProcessing() {
    if (!renderer || !scene || !camera?.current) return;

    if (composer) {
      composer.dispose();
    }

    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera.current));

    bloomEffect = new BloomEffect({
      intensity: controls.bloomStrength,
      luminanceThreshold: 0.9,
      luminanceSmoothing: 0,
      mipmapBlur: false,
      levels: 8,
      blendFunction: BlendFunction.ADD,
    });

    composer.addPass(new EffectPass(camera.current, bloomEffect));
  }

  function setupTweakpane() {
    if (typeof window === "undefined") return;

    import("tweakpane")
      .then(({ Pane }) => {
        controller = new Pane({
          title: "Controls",
          expanded: true,
        });

        const meshFolder = controller.addFolder({ title: "Mesh", expanded: false });

        const geometryList = meshFolder.addBlade({
          view: "list",
          label: "Mesh",
          options: geometryNames.map((name, i) => ({ text: name, value: i })),
          value: currentGeometry,
        });

        geometryList.on("change", (e: any) => {
          currentGeometry = e.value;
        });

        meshFolder.addBinding(controls, "bloomStrength", { min: 1, max: 20, step: 0.01, label: "Bloom Strength" });
        meshFolder.addBinding(controls, "rotationY", { min: -Math.PI * 2, max: Math.PI * 2, step: 0.01, label: "Rotation Y" });

        // Dissolve controls
        const dissolveFolder = controller.addFolder({ title: "Dissolve Effect", expanded: false });
        dissolveFolder.addBinding(controls, "meshVisible", { label: "Visible" });
        dissolveFolder.addBinding(controls, "dissolveProgress", { min: -20, max: 20, step: 0.0001, label: "Progress" });
        dissolveFolder.addBinding(controls, "autoDissolve", { label: "Auto Animate" });
        dissolveFolder.addBinding(controls, "edgeWidth", { min: 0.1, max: 8, step: 0.001, label: "Edge Width" });
        dissolveFolder.addBinding(controls, "frequency", { min: 0.001, max: 2, step: 0.001, label: "Frequency" });
        dissolveFolder.addBinding(controls, "amplitude", { min: 0.1, max: 20, step: 0.001, label: "Amplitude" });
        dissolveFolder.addBinding(controls, "meshColor", { label: "Mesh Color" });
        dissolveFolder.addBinding(controls, "edgeColor", { label: "Edge Color" });

        // Particle controls
        const particleFolder = controller.addFolder({ title: "Particle", expanded: false });
        particleFolder.addBinding(controls, "particleVisible", { label: "Visible" });
        particleFolder.addBinding(controls, "particleBaseSize", { min: 10, max: 400, step: 0.01, label: "Base size" });
        particleFolder.addBinding(controls, "particleColor", { label: "Color" });
        particleFolder.addBinding(controls, "particleSpeedFactor", { min: 0.001, max: 0.1, step: 0.001, label: "Speed" });
        particleFolder.addBinding(controls, "waveAmplitude", { min: 0, max: 5, step: 0.01, label: "Wave Amp" });
        particleFolder.addBinding(controls, "velocityFactor", {
          picker: "inline",
          expanded: true,
          label: "Velocity Factor",
        });
      })
      .catch((err) => {
        console.error("Failed to load tweakpane:", err);
      });
  }

  // Handle geometry change
  $effect(() => {
    if (dissolveMesh && particleGeometry) {
      const newGeometry = geometries[currentGeometry];
      dissolveMesh.geometry = newGeometry;
      particleGeometry.copy(newGeometry);
      initParticleAttributes(newGeometry);
    }
  });

  // Update uniforms from controls
  $effect(() => {
    dissolveUniforms.uProgress.value = controls.dissolveProgress;
    dissolveUniforms.uEdge.value = controls.edgeWidth;
    dissolveUniforms.uFreq.value = controls.frequency;
    dissolveUniforms.uAmp.value = controls.amplitude;
    dissolveUniforms.uEdgeColor.value.setHex(parseInt(controls.edgeColor.replace("#", ""), 16));
    dissolveUniforms.uMeshColor.value.setHex(parseInt(controls.meshColor.replace("#", ""), 16));

    particleUniforms.uBaseSize.value = controls.particleBaseSize;
    particleUniforms.uColor.value.setHex(parseInt(controls.particleColor.replace("#", ""), 16));

    particleData.particleSpeedFactor = controls.particleSpeedFactor;
    particleData.waveAmplitude = controls.waveAmplitude;
    particleData.velocityFactor.x = controls.velocityFactor.x;
    particleData.velocityFactor.y = controls.velocityFactor.y;

    autoDissolve = controls.autoDissolve;
  });

  $effect(() => {
    const bloomStrength = controls.bloomStrength;
    if (bloomEffect) {
      bloomEffect.intensity = bloomStrength;
    }
  });

  function animateDissolve() {
    if (!autoDissolve) return;

    if (dissolving) {
      controls.dissolveProgress += 0.05;
    } else {
      controls.dissolveProgress -= 0.05;
    }

    if (controls.dissolveProgress > 14 && dissolving) {
      dissolving = false;
      currentGeometry = (currentGeometry + 1) % geometries.length;
    }

    if (controls.dissolveProgress < -17 && !dissolving) {
      dissolving = true;
    }
  }

  useTask((delta) => {
    time += delta;

    if (dissolveMesh) {
      dissolveMesh.visible = controls.meshVisible;
      dissolveMesh.rotation.y = controls.rotationY;
      dissolveMesh.position.y = Math.sin(time * 2.0) * 0.5;
    }

    if (particleSystem) {
      particleSystem.visible = controls.particleVisible;
      particleSystem.rotation.y = controls.rotationY;
      particleSystem.position.y = Math.sin(time * 2.0) * 0.5;
    }

    updateParticleAttributes();
    animateDissolve();
  });

  onMount(() => {
    autoRender.set(false);
    setupTweakpane();
    setupPostProcessing();

    return () => {
      if (composer) {
        composer.dispose();
      }
      if (controller) {
        controller.dispose();
      }
      autoRender.set(true);
    };
  });

  useTask(
    (delta) => {
      if (composer) {
        composer.render(delta);
      }
    },
    { stage: renderStage, autoInvalidate: false }
  );
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 25]} fov={60}>
  <!-- <T.PerspectiveCamera makeDefault position={[3.4, 14, 5.8]} fov={60}> -->
  <!-- <OrbitControls enableDamping target={[0, 0, 0]} /> -->
</T.PerspectiveCamera>
<!-- Environment -->
<T.AmbientLight intensity={0.5} />
<T.DirectionalLight position={[10, 10, 5]} intensity={1} />

<!-- Dissolving Mesh -->
<T.Mesh bind:ref={dissolveMesh} geometry={geometries[currentGeometry]} position={[0, 0, 0]}>
  <T.ShaderMaterial vertexShader={dissolveVertexShader} fragmentShader={dissolveFragmentShader} uniforms={dissolveUniforms} side={DoubleSide} />
</T.Mesh>

<!-- Particle System -->
<T.Points bind:ref={particleSystem} position={[0, 0, 0]}>
  <T.BufferGeometry bind:ref={particleGeometry} geometry={geometries[currentGeometry]} />
  <T.ShaderMaterial bind:ref={particleMaterial} vertexShader={particleVertexShader} fragmentShader={particleFragmentShader} uniforms={particleUniforms} transparent blending={AdditiveBlending} depthWrite={false} />
</T.Points>
