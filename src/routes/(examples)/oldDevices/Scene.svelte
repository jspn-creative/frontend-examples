<script lang="ts">
  import { T, useThrelte } from "@threlte/core";
  import { ContactShadows, OrbitControls, Suspense, interactivity, useCursor } from "@threlte/extras";
  import { Spring } from "svelte/motion";
  import * as THREE from "three";
  import Devices from "./Devices.svelte";

  interactivity();

  const { onPointerEnter, onPointerLeave } = useCursor();

  interface Props {
    controls?: {
      enabled: boolean;
    };
    settings: any;
    focus: any;
    hovering: any;
  }

  let { controls = { enabled: true }, settings = $bindable(), focus = $bindable(), hovering = $bindable() }: Props = $props();

  // Get threlte context for invalidation
  const { invalidate } = useThrelte();

  // let focus = $state("");
  // let hovering = $state("");

  // Model and camera references
  let modelRef: THREE.Group | undefined = $state();
  let cameraRef: THREE.PerspectiveCamera | undefined = $state();

  // Animation references
  let actions: any = $state();
  let mixer: any = $state();

  function handleDeviceHover(device: string, isHovering: boolean) {
    if (focus) return;

    if (isHovering) {
      onPointerEnter();
      hovering = device;

      // Set hover animation targets
      if (device === "macbook" && settings.devices.macbookEnabled) {
        macbookRotation.target = [settings.hover.macbookRotation.x, settings.hover.macbookRotation.y, settings.hover.macbookRotation.z];
      } else if (device === "iPhone" && settings.devices.iPhoneEnabled) {
        iPhonePosition.target = [settings.hover.iPhonePosition.x, settings.hover.iPhonePosition.y, settings.hover.iPhonePosition.z];
        iPhoneRotation.target = [settings.hover.iPhoneRotation.x, settings.hover.iPhoneRotation.y, settings.hover.iPhoneRotation.z];
      }
    } else {
      onPointerLeave();
      hovering = "";

      // Reset to default positions if not focused
      if (!focus) {
        macbookRotation.target = [0, 0, 0];
        iPhonePosition.target = [0, 0, 0];
        iPhoneRotation.target = [0, 0, 0];
      }
    }
  }

  function handleDeviceClick(device: string) {
    if (!settings.devices.macbookEnabled && device === "macbook") return;
    if (!settings.devices.iPhoneEnabled && device === "iPhone") return;

    if (focus === device) {
      focus = "";
      console.log("focus", focus);
      hovering = "";

      // Close macbook animation
      if (device === "macbook" && actions?.current?.Animation) {
        console.log("Playing animation to close macbook");
        const animation = actions.current.Animation;
        animation.paused = false; // Resume if paused
        animation.timeScale = -settings.animation.animationSpeed; // Reverse at configured speed
        animation.setLoop(THREE.LoopOnce, 1);
        animation.clampWhenFinished = true;
        animation.play();
      }

      // Reset all animations
      macbookRotation.target = [0, 0, 0];
      iPhonePosition.target = [0, 0, 0];
      iPhoneRotation.target = [0, 0, 0];
      cameraPosition.target = [settings.camera.position.x, settings.camera.position.y, settings.camera.position.z];
      cameraTarget.target = [settings.camera.target.x, settings.camera.target.y, settings.camera.target.z];
    } else {
      // Focus on device
      focus = device;
      hovering = "";

      if (device === "macbook") {
        // Play macbook animation (open)
        if (actions?.current?.Animation) {
          console.log("Playing animation to open macbook");
          const animation = actions.current.Animation;
          animation.reset();
          animation.setLoop(THREE.LoopOnce, 1);
          animation.timeScale = settings.animation.animationSpeed; // Use configured speed
          animation.clampWhenFinished = true;

          // Play only the opening part (first half of animation)
          const duration = animation.getClip().duration;
          animation.time = 0;
          animation.play();

          // Stop at halfway point (when lid is open)
          setTimeout(
            () => {
              if (animation.isRunning()) {
                animation.paused = true;
              }
            },
            ((duration * 0.5) / settings.animation.animationSpeed) * 1000
          );
        } else {
          console.log("No Animation action found");
        }

        macbookRotation.target = [settings.focus.macbook.rotation.x, settings.focus.macbook.rotation.y, settings.focus.macbook.rotation.z];
        iPhonePosition.target = [0, 0, 0];
        iPhoneRotation.target = [0, 0, 0];
        cameraPosition.target = [settings.focus.macbook.cameraPosition.x, settings.focus.macbook.cameraPosition.y, settings.focus.macbook.cameraPosition.z];
        cameraTarget.target = [settings.focus.macbook.cameraTarget.x, settings.focus.macbook.cameraTarget.y, settings.focus.macbook.cameraTarget.z];
      } else if (device === "iPhone") {
        // Close macbook animation when switching to iPhone
        if (actions?.current?.Animation) {
          console.log("Closing macbook when switching to iPhone");
          const animation = actions.current.Animation;
          animation.paused = false; // Resume if paused
          animation.timeScale = -settings.animation.animationSpeed; // Reverse at configured speed
          animation.setLoop(THREE.LoopOnce, 1);
          animation.clampWhenFinished = true;
          animation.play();
        }

        macbookRotation.target = [0, 0, 0];
        iPhonePosition.target = [settings.focus.iPhone.position.x, settings.focus.iPhone.position.y, settings.focus.iPhone.position.z];
        iPhoneRotation.target = [settings.focus.iPhone.rotation.x, settings.focus.iPhone.rotation.y, settings.focus.iPhone.rotation.z];
        cameraPosition.target = [settings.focus.iPhone.cameraPosition.x, settings.focus.iPhone.cameraPosition.y, settings.focus.iPhone.cameraPosition.z];
        cameraTarget.target = [settings.focus.iPhone.cameraTarget.x, settings.focus.iPhone.cameraTarget.y, settings.focus.iPhone.cameraTarget.z];
      }
    }
  }

  // Keyboard handler
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      // Close macbook animation when pressing Escape
      if (focus === "macbook" && actions?.current?.Animation) {
        console.log("Closing macbook with Escape key");
        const animation = actions.current.Animation;
        animation.paused = false; // Resume if paused
        animation.timeScale = -settings.animation.animationSpeed; // Use configured speed
        animation.setLoop(THREE.LoopOnce, 1);
        animation.clampWhenFinished = true;
        animation.play();
      }

      focus = "";
      hovering = "";

      // Reset all animations
      macbookRotation.target = [0, 0, 0];
      iPhonePosition.target = [0, 0, 0];
      iPhoneRotation.target = [0, 0, 0];
      cameraPosition.target = [settings.camera.position.x, settings.camera.position.y, settings.camera.position.z];
      cameraTarget.target = [settings.camera.target.x, settings.camera.target.y, settings.camera.target.z];
    }
  }

  // Initialize materials when model loads
  $effect(() => {
    if (modelRef) {
      // Materials initialization logic can be added here when needed
      // Model reference is available for traversal and material setup
    }
  });

  // Update spring configurations when settings change
  $effect(() => {
    macbookRotation.stiffness = settings.animation.springStiffness;
    macbookRotation.damping = settings.animation.springDamping;
    iPhonePosition.stiffness = settings.animation.springStiffness;
    iPhonePosition.damping = settings.animation.springDamping;
    iPhoneRotation.stiffness = settings.animation.springStiffness;
    iPhoneRotation.damping = settings.animation.springDamping;
    cameraPosition.stiffness = settings.animation.springStiffness;
    cameraPosition.damping = settings.animation.springDamping;
    cameraTarget.stiffness = settings.animation.springStiffness;
    cameraTarget.damping = settings.animation.springDamping;
  });

  // Update camera when settings change
  $effect(() => {
    if (cameraRef && !focus) {
      cameraPosition.target = [settings.camera.position.x, settings.camera.position.y, settings.camera.position.z];
      cameraTarget.target = [settings.camera.target.x, settings.camera.target.y, settings.camera.target.z];
      cameraRef.fov = settings.camera.fov;
      cameraRef.updateProjectionMatrix();
    }
  });

  // React to external focus changes (like from tweakpane)
  $effect(() => {
    // Skip if focus hasn't changed or if it was set by this component
    if (focus === "" || focus === undefined) {
      // Reset to default state
      hovering = "";

      // Close macbook animation
      if (actions?.current?.Animation) {
        const animation = actions.current.Animation;
        animation.paused = false;
        animation.timeScale = -settings.animation.animationSpeed;
        animation.setLoop(THREE.LoopOnce, 1);
        animation.clampWhenFinished = true;
        animation.play();
      }

      // Reset all animations
      macbookRotation.target = [0, 0, 0];
      iPhonePosition.target = [0, 0, 0];
      iPhoneRotation.target = [0, 0, 0];
      cameraPosition.target = [settings.camera.position.x, settings.camera.position.y, settings.camera.position.z];
      cameraTarget.target = [settings.camera.target.x, settings.camera.target.y, settings.camera.target.z];
      return;
    }

    // Handle macbook focus
    if (focus === "macbook" && settings.devices.macbookEnabled) {
      hovering = "";

      // Play macbook animation (open)
      if (actions?.current?.Animation) {
        console.log("Playing animation to open macbook (from tweakpane)");
        const animation = actions.current.Animation;
        animation.reset();
        animation.setLoop(THREE.LoopOnce, 1);
        animation.timeScale = settings.animation.animationSpeed;
        animation.clampWhenFinished = true;

        const duration = animation.getClip().duration;
        animation.time = 0;
        animation.play();

        // Stop at halfway point (when lid is open)
        setTimeout(
          () => {
            if (animation.isRunning()) {
              animation.paused = true;
            }
          },
          ((duration * 0.5) / settings.animation.animationSpeed) * 1000
        );
      }

      macbookRotation.target = [settings.focus.macbook.rotation.x, settings.focus.macbook.rotation.y, settings.focus.macbook.rotation.z];
      iPhonePosition.target = [0, 0, 0];
      iPhoneRotation.target = [0, 0, 0];
      cameraPosition.target = [settings.focus.macbook.cameraPosition.x, settings.focus.macbook.cameraPosition.y, settings.focus.macbook.cameraPosition.z];
      cameraTarget.target = [settings.focus.macbook.cameraTarget.x, settings.focus.macbook.cameraTarget.y, settings.focus.macbook.cameraTarget.z];
    }

    // Handle iPhone focus
    else if (focus === "iPhone" && settings.devices.iPhoneEnabled) {
      hovering = "";

      // Close macbook animation when switching to iPhone
      if (actions?.current?.Animation) {
        console.log("Closing macbook when switching to iPhone (from tweakpane)");
        const animation = actions.current.Animation;
        animation.paused = false;
        animation.timeScale = -settings.animation.animationSpeed;
        animation.setLoop(THREE.LoopOnce, 1);
        animation.clampWhenFinished = true;
        animation.play();
      }

      macbookRotation.target = [0, 0, 0];
      iPhonePosition.target = [settings.focus.iPhone.position.x, settings.focus.iPhone.position.y, settings.focus.iPhone.position.z];
      iPhoneRotation.target = [settings.focus.iPhone.rotation.x, settings.focus.iPhone.rotation.y, settings.focus.iPhone.rotation.z];
      cameraPosition.target = [settings.focus.iPhone.cameraPosition.x, settings.focus.iPhone.cameraPosition.y, settings.focus.iPhone.cameraPosition.z];
      cameraTarget.target = [settings.focus.iPhone.cameraTarget.x, settings.focus.iPhone.cameraTarget.y, settings.focus.iPhone.cameraTarget.z];
    }
  });

  const macbookRotation = new Spring([0, 0, 0] as [number, number, number], {
    stiffness: 0.1,
    damping: 0.4,
  });

  const iPhonePosition = new Spring([0, 0, 0] as [number, number, number], {
    stiffness: 0.1,
    damping: 0.4,
  });

  const iPhoneRotation = new Spring([0, 0, 0] as [number, number, number], {
    stiffness: 0.1,
    damping: 0.4,
  });

  const cameraPosition = new Spring([settings.camera.position.x, settings.camera.position.y, settings.camera.position.z] as [number, number, number], {
    stiffness: 0.1,
    damping: 0.4,
  });

  const cameraTarget = new Spring([settings.camera.target.x, settings.camera.target.y, settings.camera.target.z] as [number, number, number], {
    stiffness: 0.1,
    damping: 0.4,
  });

  $effect(() => {
    if (cameraRef) {
      const [px, py, pz] = cameraPosition.current;
      const [tx, ty, tz] = cameraTarget.current;
      cameraRef.position.set(px, py, pz);
      cameraRef.lookAt(tx, ty, tz);
      invalidate();
    }
  });

  // Expose methods for parent component
  export function resetMacbookAnimation() {
    console.log("resetMacbookAnimation called", { actions, current: actions?.current });

    if (actions?.current?.Animation) {
      console.log("Resetting macbook animation to closed state");
      const animation = actions.current.Animation;
      animation.reset();
      animation.time = 0;
      animation.paused = true;
    } else {
      console.log("No animation found to reset", { actions });
    }

    // Also reset focus and hover states
    focus = "";
    hovering = "";
    macbookRotation.target = [0, 0, 0];
    iPhonePosition.target = [0, 0, 0];
    iPhoneRotation.target = [0, 0, 0];
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<T.PerspectiveCamera
  makeDefault
  position={[-7, 6, -11]}
  fov={settings.camera.fov}
  bind:ref={cameraRef}
  oncreate={(ref) => {
    ref.lookAt(0, 0, 0);
  }}
>
  {#if controls?.enabled}
    <OrbitControls enablePan enableZoom enableRotate />
  {/if}
</T.PerspectiveCamera>

<T.DirectionalLight position={[10, 10, 5]} intensity={settings.lighting.directionalIntensity} castShadow shadow.mapSize.width={1024} shadow.mapSize.height={1024} />
<T.AmbientLight intensity={settings.lighting.ambientIntensity} />

<T.PointLight position={[-10, 10, 10]} intensity={settings.lighting.pointLight1Intensity} />
<T.PointLight position={[10, -10, -10]} intensity={settings.lighting.pointLight2Intensity} />

<ContactShadows position={[0, -0.5, 0]} opacity={settings.contactShadows.opacity} width={settings.contactShadows.width} height={settings.contactShadows.height} blur={settings.contactShadows.blur} far={settings.contactShadows.far} />

<Suspense>
  {#snippet fallback()}
    <!-- Loading state -->
    <T.Mesh position={[0, 0, 0]}>
      <T.BoxGeometry args={[1, 1, 1]} />
      <T.MeshStandardMaterial color="#ff0000" />
    </T.Mesh>
  {/snippet}
  {#snippet error({ errors })}
    <T.Mesh position={[0, 0, 0]}>
      <T.BoxGeometry args={[1, 1, 1]} />
      <T.MeshStandardMaterial color="#ff0000" />
    </T.Mesh>
    <div class="fixed top-4 left-4 bg-red-500 text-white p-4 rounded">
      Error loading model: {errors[0]?.message || "Unknown error"}
    </div>
  {/snippet}
  <Devices bind:ref={modelRef} bind:actions bind:mixer macbookRotation={macbookRotation.current} iPhonePosition={iPhonePosition.current} iPhoneRotation={iPhoneRotation.current} {settings} />
</Suspense>

<!-- Interactive meshes for device detection -->
<!-- MacBook -->
{#if settings.devices.macbookEnabled}
  <T.Mesh visible={false} position={[3, 0, 0]} onpointerenter={() => handleDeviceHover("macbook", true)} onpointerleave={() => handleDeviceHover("macbook", false)} onclick={() => handleDeviceClick("macbook")}>
    <T.BoxGeometry args={[4, 1, 3]} />
    <T.MeshBasicMaterial transparent opacity={0} />
  </T.Mesh>
{/if}

<!-- iPhone -->
{#if settings.devices.iPhoneEnabled}
  <T.Mesh visible={false} position={[-3, 0, 0]} onpointerenter={() => handleDeviceHover("iPhone", true)} onpointerleave={() => handleDeviceHover("iPhone", false)} onclick={() => handleDeviceClick("iPhone")}>
    <T.BoxGeometry args={[1, 2, 0.5]} />
    <T.MeshBasicMaterial transparent opacity={0.2} color="blue" />
  </T.Mesh>
{/if}
