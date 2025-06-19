<script lang="ts">
  import { T, useThrelte } from "@threlte/core";
  import { ContactShadows, CameraControls, Suspense, interactivity, HUD, type CameraControlsRef } from "@threlte/extras";
  import Devices from "./Devices.svelte";
  import { deviceSceneState } from "./deviceSceneState.svelte";
  import * as THREE from "three";

  interactivity();

  const deviceState = $derived(deviceSceneState);

  deviceState.initializeEffects();

  let devicesComponent: any = $state();

  let cameraControlsRef = $state<CameraControlsRef>();

  $effect(() => {
    if (cameraControlsRef) {
      const [px, py, pz] = deviceState.cameraPosition.current;
      const [tx, ty, tz] = deviceState.cameraTarget.current;
      cameraControlsRef.setLookAt(px, py, pz, tx, ty, tz, true);

      if (cameraControlsRef.camera) {
        const camera = cameraControlsRef.camera as THREE.PerspectiveCamera;
        camera.fov = deviceState.cameraFov.current;
        camera.updateProjectionMatrix();
      }
    }
  });
</script>

<svelte:window onkeydown={deviceState.handleKeydown} />

<T.PerspectiveCamera
  makeDefault
  position={deviceState.cameraPosition.current}
  fov={deviceState.cameraFov.current}
  bind:ref={deviceState.cameraRef}
  oncreate={(ref) => {
    ref.lookAt(...deviceState.cameraTarget.current);
  }}
>
  {#if deviceState.orbitControlsEnabled}
    <CameraControls bind:ref={cameraControlsRef} />
  {:else}
    <CameraControls bind:ref={cameraControlsRef} enabled={false} />
  {/if}
</T.PerspectiveCamera>

<T.DirectionalLight position={[8, 17, -12]} intensity={2} castShadow color="#e8f6e4" shadow.mapSize.width={1024} shadow.mapSize.height={1024} />

<!-- Test geometry -->
{#if deviceState.debugMode}
  <HUD>
    <T.Mesh name="Test">
      <T.BoxGeometry args={[1, 1, 1]} />
      <T.MeshBasicMaterial color="hotpink" opacity={0.25} transparent />
    </T.Mesh>
  </HUD>
{/if}

<Devices
  bind:this={devicesComponent}
  bind:ref={deviceState.modelRef}
  iPhonePosition={deviceState.iPhonePosition.current}
  iPhoneRotation={deviceState.iPhoneRotation.current}
  settings={{
    devices: {
      iPhoneEnabled: deviceState.state !== "disabled",
    },
  }}
/>

{#if deviceState.state !== "disabled"}
  <T.Mesh visible={false} position={[0, 0, 0]} onpointerenter={() => deviceState.handleDeviceHover(true)} onpointerleave={() => deviceState.handleDeviceHover(false)} onclick={deviceState.handleDeviceClick}>
    <T.BoxGeometry args={[1.5, 3, 1]} />
    <T.MeshBasicMaterial transparent opacity={0.2} color="blue" />
  </T.Mesh>
{/if}
