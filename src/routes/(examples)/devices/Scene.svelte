<script lang="ts">
  import { T, useThrelte } from "@threlte/core";
  import { ContactShadows, OrbitControls, Suspense, interactivity, useCursor } from "@threlte/extras";
  import Devices from "./Devices.svelte";
  import { deviceSceneState } from "./deviceSceneState.svelte";

  interactivity();

  const { onPointerEnter, onPointerLeave } = useCursor();
  const { invalidate } = useThrelte();

  const deviceState = $derived(deviceSceneState);

  // Component reference to access exported actions
  let devicesComponent: any = $state();

  $effect(() => {
    if (devicesComponent?.actions && devicesComponent?.mixer) {
      deviceState.actions = devicesComponent.actions;
      deviceState.mixer = devicesComponent.mixer;
      console.log("Available actions:", Object.keys(devicesComponent.actions.current));
      console.log(
        "Mixer actions:",
        devicesComponent.mixer._actions?.map((a: any) => a._clip?.name)
      );
    }
  });
</script>

<svelte:window onkeydown={deviceState.handleKeydown} />

<T.PerspectiveCamera
  makeDefault
  position={[-7, 6, -11]}
  fov={50}
  bind:ref={deviceState.cameraRef}
  oncreate={(ref) => {
    ref.lookAt(0, 0, 0);
  }}
>
  {#if deviceState.orbitControlsEnabled}
    <OrbitControls enablePan enableZoom enableRotate />
  {/if}
</T.PerspectiveCamera>

<T.DirectionalLight position={[10, 10, 5]} intensity={deviceState.lighting.directional} castShadow shadow.mapSize.width={1024} shadow.mapSize.height={1024} />
<T.AmbientLight intensity={deviceState.lighting.ambient} />

<T.PointLight position={[-10, 10, 10]} intensity={deviceState.lighting.point1} />
<T.PointLight position={[10, -10, -10]} intensity={deviceState.lighting.point2} />

<ContactShadows position={[0, -0.5, 0]} opacity={deviceState.shadows.opacity} width={deviceState.shadows.width} height={deviceState.shadows.height} blur={deviceState.shadows.blur} far={deviceState.shadows.far} />

<Suspense>
  {#snippet fallback()}
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
  <Devices
    bind:this={devicesComponent}
    bind:ref={deviceState.modelRef}
    macbookRotation={deviceState.currentMacbookRotation}
    iPhonePosition={deviceState.iPhoneTransform.current.position}
    iPhoneRotation={deviceState.iPhoneTransform.current.rotation}
    settings={{
      devices: {
        macbookEnabled: deviceState.deviceStates.macbook !== "disabled",
        iPhoneEnabled: deviceState.deviceStates.iphone !== "disabled",
      },
    }}
  />
</Suspense>

<!-- Interactive meshes for device detection -->
<!-- MacBook -->
{#if deviceState.deviceStates.macbook !== "disabled"}
  <T.Mesh visible={false} position={[3, 0, 0]} onpointerenter={() => deviceState.handleDeviceHover("macbook", true)} onpointerleave={() => deviceState.handleDeviceHover("macbook", false)} onclick={() => deviceState.handleDeviceClick("macbook")}>
    <T.BoxGeometry args={[4, 1, 3]} />
    <T.MeshBasicMaterial transparent opacity={0} />
  </T.Mesh>
{/if}

<!-- iPhone -->
{#if deviceState.deviceStates.iphone !== "disabled"}
  <T.Mesh visible={false} position={[-3, 0, 0]} onpointerenter={() => deviceState.handleDeviceHover("iphone", true)} onpointerleave={() => deviceState.handleDeviceHover("iphone", false)} onclick={() => deviceState.handleDeviceClick("iphone")}>
    <T.BoxGeometry args={[1, 2, 0.5]} />
    <T.MeshBasicMaterial transparent opacity={0.2} color="blue" />
  </T.Mesh>
{/if}
