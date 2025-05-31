<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import { Vector3, Curve, InstancedMesh, Object3D } from "three";
  const fragmentShader = `uniform vec3 uColor;
uniform float uEdge;
uniform float uProgress;
uniform sampler2D uTexture;

varying float vNoise;
varying float vAngle;

void main(){
    if( vNoise < uProgress ) discard;
    if( vNoise > uProgress + uEdge) discard;

    vec2 coord = gl_PointCoord;
    coord = coord - 0.5; // get the coordinate from 0-1 ot -0.5 to 0.5
    coord = coord * mat2(cos(vAngle),sin(vAngle) , -sin(vAngle), cos(vAngle)); // apply the rotation transformaion
    coord = coord +  0.5; // reset the coordinate to 0-1  

    vec4 texture = texture2D(uTexture,coord);

    gl_FragColor = vec4(uColor,1.0);
    gl_FragColor = vec4(vec3(uColor.xyz * texture.xyz),1.0);
 }
 `;
  import snoise from "./snoise.glsl?raw";

  const vertexShader = `

    ${snoise}

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
        vNoise =noise;

        vAngle = aAngle;

        if( vNoise > uProgress-2.0 && vNoise < uProgress + uEdge+2.0){
            pos = aCurrentPos;
        }

        vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectedPosition;

        float size = uBaseSize * uPixelDensity;
        size = size  / (aDist + 1.0);
        gl_PointSize = size / -viewPosition.z;
}
`;

  interface Props {
    isGlowing: boolean;
    showTest?: boolean;
    glowColor: string;
    innerWidth?: number;
    innerHeight?: number;
    borderRect: { x: number; y: number; width: number; height: number };
    // Post processing props (for future implementation)
    bloomIntensity?: number;
    bloomThreshold?: number;
    bloomRadius?: number;
    exposure?: number;
    // Particle controls
    particleSize?: number;
    particleSpread?: number;
    particleCount?: number;
    maxParticleSize?: number;
    tubeRadius?: number;
  }

  let { isGlowing, showTest = true, glowColor, innerWidth, innerHeight, borderRect, bloomIntensity = 1.5, bloomThreshold = 0.15, bloomRadius = 0.4, exposure = 1, particleSize = 1.0, particleSpread = 15, particleCount = 1500, maxParticleSize = 2.0, tubeRadius = 20 }: Props = $props();

  // Animation state
  let time = $state(0);
  let pulseIntensity = $derived(0.5 + 0.5 * Math.sin(time * 0.5));

  // Particle system state
  let particleInstances: InstancedMesh | undefined = undefined;
  let particlePositions: Vector3[] = [];
  let particleVelocities: number[] = [];
  let particleOffsets: { radial: number; height: number; phase: number }[] = [];

  // Initialize particles function
  function initializeParticles(count: number) {
    particlePositions = [];
    particleVelocities = [];
    particleOffsets = [];

    for (let i = 0; i < count; i++) {
      particlePositions.push(new Vector3());
      particleVelocities.push(Math.random() * 0.02 + 0.005);
      // Add random offsets for floating around the tube
      particleOffsets.push({
        radial: 0, // Will be set reactively
        height: (Math.random() - 0.5) * 20, // Height variation
        phase: Math.random() * Math.PI * 2, // Random phase for circular motion
      });
    }
  }

  // Initialize particles with default count
  initializeParticles(particleCount);

  // Update particle count reactively
  $effect(() => {
    if (particlePositions.length !== particleCount) {
      initializeParticles(particleCount);
    }
  });

  // Update particle spread reactively
  $effect(() => {
    for (let i = 0; i < particleCount; i++) {
      if (particleOffsets[i]) {
        particleOffsets[i].radial = Math.random() * particleSpread + 5;
      }
    }
  });

  useTask((delta: number) => {
    time += delta;

    if (particleInstances && isGlowing) {
      const dummy = new Object3D();

      for (let i = 0; i < particleCount; i++) {
        // Move particles along the path
        const t = (time * particleVelocities[i] + i / particleCount) % 1;
        const pathPoint = path.getPoint(t);

        // Get the direction vector for the path at this point
        const nextT = (t + 0.01) % 1;
        const nextPoint = path.getPoint(nextT);
        const direction = new Vector3().subVectors(nextPoint, pathPoint).normalize();

        // Calculate normal vector (perpendicular to direction)
        const up = new Vector3(0, 0, 1);
        const normal = new Vector3().crossVectors(direction, up).normalize();
        const binormal = new Vector3().crossVectors(direction, normal).normalize();

        // Add floating motion around the tube
        const offset = particleOffsets[i];
        const radialPhase = time * 0.5 + offset.phase;
        const radialDistance = offset.radial * (1 + 0.3 * Math.sin(time * 2 + i * 0.1));

        // Calculate position floating around the tube in a cylindrical volume
        const radialOffset = new Vector3().addScaledVector(normal, Math.cos(radialPhase) * radialDistance).addScaledVector(binormal, Math.sin(radialPhase) * radialDistance);

        // Add some random floating motion with depth variation
        const floatOffset = new Vector3(Math.sin(time * 1.5 + i * 0.1) * 3, Math.cos(time * 1.2 + i * 0.2) * 3, Math.sin(time * 2 + i * 0.15) * 5 + offset.height);

        // Combine all offsets
        pathPoint.add(radialOffset).add(floatOffset);

        // Scale particles with configurable size range (no pulsing with tube)
        const sizeVariation = 0.5 + 0.5 * Math.sin(time * 4 + i * 0.5); // 0.5 to 1.0
        const scale = particleSize + (maxParticleSize - particleSize) * sizeVariation;

        dummy.position.copy(pathPoint);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();

        particleInstances.setMatrixAt(i, dummy.matrix);
      }

      particleInstances.instanceMatrix.needsUpdate = true;
    }
  });

  class BorderRectPathCurve extends Curve<Vector3> {
    borderRect: { x: number; y: number; width: number; height: number };
    cornerRadius: number;

    constructor(borderRect: { x: number; y: number; width: number; height: number }, cornerRadius = 10) {
      super();
      this.borderRect = borderRect;
      this.cornerRadius = cornerRadius;
    }

    getPoint(t: number, optionalTarget = new Vector3()): Vector3 {
      const { width, height } = this.borderRect;
      const r = this.cornerRadius;

      // Center the rectangle around the origin
      const halfWidth = width / 2;
      const halfHeight = height / 2;

      // Calculate the perimeter and corner arc lengths
      const straightWidth = width - 2 * r;
      const straightHeight = height - 2 * r;
      const cornerArcLength = (Math.PI / 2) * r;
      const totalPerimeter = 2 * straightWidth + 2 * straightHeight + 4 * cornerArcLength;

      // Convert t to distance along perimeter
      const distance = t * totalPerimeter;

      let tx: number, ty: number;

      // Bottom edge (left to right)
      if (distance <= straightWidth) {
        tx = -halfWidth + r + distance;
        ty = -halfHeight;
      }
      // Bottom-right corner
      else if (distance <= straightWidth + cornerArcLength) {
        const arcT = (distance - straightWidth) / cornerArcLength;
        const angle = -Math.PI / 2 + arcT * (Math.PI / 2);
        tx = halfWidth - r + r * Math.cos(angle);
        ty = -halfHeight + r + r * Math.sin(angle);
      }
      // Right edge (bottom to top)
      else if (distance <= straightWidth + cornerArcLength + straightHeight) {
        const edgeT = distance - straightWidth - cornerArcLength;
        tx = halfWidth;
        ty = -halfHeight + r + edgeT;
      }
      // Top-right corner
      else if (distance <= straightWidth + 2 * cornerArcLength + straightHeight) {
        const arcT = (distance - straightWidth - cornerArcLength - straightHeight) / cornerArcLength;
        const angle = arcT * (Math.PI / 2);
        tx = halfWidth - r + r * Math.cos(angle);
        ty = halfHeight - r + r * Math.sin(angle);
      }
      // Top edge (right to left)
      else if (distance <= 2 * straightWidth + 2 * cornerArcLength + straightHeight) {
        const edgeT = distance - straightWidth - 2 * cornerArcLength - straightHeight;
        tx = halfWidth - r - edgeT;
        ty = halfHeight;
      }
      // Top-left corner
      else if (distance <= 2 * straightWidth + 3 * cornerArcLength + straightHeight) {
        const arcT = (distance - 2 * straightWidth - 2 * cornerArcLength - straightHeight) / cornerArcLength;
        const angle = Math.PI / 2 + arcT * (Math.PI / 2);
        tx = -halfWidth + r + r * Math.cos(angle);
        ty = halfHeight - r + r * Math.sin(angle);
      }
      // Left edge (top to bottom)
      else if (distance <= 2 * straightWidth + 3 * cornerArcLength + 2 * straightHeight) {
        const edgeT = distance - 2 * straightWidth - 3 * cornerArcLength - straightHeight;
        tx = -halfWidth;
        ty = halfHeight - r - edgeT;
      }
      // Bottom-left corner
      else {
        const arcT = (distance - 2 * straightWidth - 3 * cornerArcLength - 2 * straightHeight) / cornerArcLength;
        const angle = Math.PI + arcT * (Math.PI / 2);
        tx = -halfWidth + r + r * Math.cos(angle);
        ty = -halfHeight + r + r * Math.sin(angle);
      }

      return optionalTarget.set(tx, ty, 0);
    }
  }

  const path = new BorderRectPathCurve(borderRect, 45);

  // Create dynamic material opacity - make particles fully opaque
  const particleOpacity = $derived(isGlowing ? 0.9 : 0); // No fading, solid particles
  const tubeOpacity = $derived(isGlowing ? pulseIntensity * 0.2 * (2 - bloomThreshold) : 0);
</script>

<T.OrthographicCamera makeDefault position={[0, 0, 50]}></T.OrthographicCamera>

{#if showTest}
  <T.Mesh name="Test">
    <T.BoxGeometry args={[innerWidth, innerHeight, 1]} />
    <T.MeshBasicMaterial color="hotpink" opacity={0.25} transparent />
  </T.Mesh>
{/if}

{#if isGlowing}
  <T.Group>
    <!-- Main tube with bloom-affected opacity -->
    <T.Mesh name="Tube">
      <T.MeshBasicMaterial color={glowColor} opacity={tubeOpacity} transparent />
      <T.TubeGeometry args={[path, 200, tubeRadius, 10, true]} />
    </T.Mesh>

    <!-- Particle system with bloom-affected opacity -->
    <T.InstancedMesh bind:ref={particleInstances} args={[undefined, undefined, particleCount]} name="Particles">
      <T.SphereGeometry args={[1, 8, 6]} />
      <T.MeshBasicMaterial color={glowColor} opacity={particleOpacity} transparent />
      <!-- <T.ShaderMaterial {fragmentShader} {vertexShader} /> -->
    </T.InstancedMesh>

    <!-- Extra glow layer affected by bloom radius -->
    <T.Mesh name="GlowLayer">
      <T.MeshBasicMaterial color={glowColor} opacity={pulseIntensity * 0.1 * bloomRadius} transparent />
      <T.TubeGeometry args={[path, 150, 12 * bloomRadius, 8, true]} />
    </T.Mesh>
  </T.Group>
{/if}
