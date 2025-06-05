<script lang="ts">
  import { Canvas } from "@threlte/core";
  import { Button, Checkbox, Pane, Folder, Slider, Color as TweakpaneColor, List, Point, Separator, Element } from "svelte-tweakpane-ui";
  import Scene from "./Scene.svelte";

  let focus = $state("");
  let hovering = $state("");

  // Camera presets for different device configurations
  const cameraPresets = {
    bothDevices: {
      position: { x: 1.2, y: 7.1, z: -9.5 },
      target: { x: 1.2, y: 0, z: 0 },
      fov: 50,
    },
    iPhoneOnly: {
      position: { x: -2.9, y: 7.1, z: -9.5 },
      target: { x: -3, y: 0, z: 0 },
      fov: 45,
    },
    macbookOnly: {
      position: { x: 2.8, y: 7.1, z: -9.5 },
      target: { x: 2.8, y: 0, z: 0 },
      fov: 55,
    },
  };

  // Settings object for the scene
  let settings = $state({
    devices: {
      macbookEnabled: true,
      iPhoneEnabled: true,
    },
    animation: {
      springStiffness: 0.1,
      springDamping: 0.4,
      animationSpeed: 6,
    },
    camera: {
      position: { x: 0, y: 0, z: 0 }, // Will be set by effect
      target: { x: 0, y: 0, z: 0 }, // Will be set by effect
      fov: 50, // Will be set by effect
    },
    lighting: {
      directionalIntensity: 2,
      ambientIntensity: 0.8,
      pointLight1Intensity: 1,
      pointLight2Intensity: 0.5,
    },
    contactShadows: {
      opacity: 0.4,
      width: 10,
      height: 10,
      blur: 2.5,
      far: 4,
    },
    hover: {
      macbookRotation: { x: -0.15, y: 0, z: 0 },
      iPhonePosition: { x: 0, y: 0.1, z: 0 },
      iPhoneRotation: { x: -0.1, y: 0, z: 0 },
    },
    focus: {
      macbook: {
        rotation: { x: -0.3, y: 0, z: 0 },
        cameraPosition: { x: 2.8, y: 7.1, z: -9.5 },
        cameraTarget: { x: 2.8, y: 0, z: 0 },
      },
      iPhone: {
        position: { x: 0, y: 0.5, z: 0 },
        rotation: { x: -0.2, y: 0.3, z: 0.1 },
        cameraPosition: { x: -2.9, y: 3.1, z: -6.5 },
        cameraTarget: { x: -2.9, y: 0, z: 0 },
      },
    },
  });

  // Derived camera position based on device visibility
  const defaultCameraSettings = $derived(() => {
    if (settings.devices.macbookEnabled && settings.devices.iPhoneEnabled) {
      return cameraPresets.bothDevices;
    } else if (settings.devices.iPhoneEnabled && !settings.devices.macbookEnabled) {
      return cameraPresets.iPhoneOnly;
    } else if (settings.devices.macbookEnabled && !settings.devices.iPhoneEnabled) {
      return cameraPresets.macbookOnly;
    } else {
      // Fallback to both devices view if neither is enabled
      return cameraPresets.bothDevices;
    }
  });

  // Update camera settings when device visibility changes
  $effect(() => {
    const preset = defaultCameraSettings();
    settings.camera.position = { ...preset.position };
    settings.camera.target = { ...preset.target };
    settings.camera.fov = preset.fov;
  });

  // Individual quick-access values
  let quickActions = $state({
    resetCamera: () => {
      console.log("resetCamera called", { sceneRef });
      focus = "";
      hovering = "";
      const preset = defaultCameraSettings();
      settings.camera.position = { ...preset.position };
      settings.camera.target = { ...preset.target };
      settings.camera.fov = preset.fov;
    },
    resetAnimation: () => {
      // Reset macbook animation to closed state
      console.log("Checking sceneRef.resetMacbookAnimation", sceneRef?.resetMacbookAnimation);
      if (sceneRef?.resetMacbookAnimation) {
        console.log("Calling resetMacbookAnimation");
        sceneRef.resetMacbookAnimation();
      } else {
        console.log("resetMacbookAnimation not available on sceneRef");
      }
      settings.animation.springStiffness = 0.1;
      settings.animation.springDamping = 0.4;
      settings.animation.animationSpeed = 6;
    },
    resetLighting: () => {
      settings.lighting.directionalIntensity = 2;
      settings.lighting.ambientIntensity = 0.8;
      settings.lighting.pointLight1Intensity = 1;
      settings.lighting.pointLight2Intensity = 0.5;
    },
  });

  let orbitControlsEnabled = $state(true);
  let debugMode = $state(true);
  let sceneRef: any = $state();
</script>

<div class="relative size-full">
  {#await import("@threlte/studio") then { Studio }}
    <Canvas>
      <Studio>
        <Scene bind:this={sceneRef} {settings} controls={{ enabled: orbitControlsEnabled }} bind:focus bind:hovering />
      </Studio>
    </Canvas>
  {/await}

  <!-- Tweakpane Panel -->
  <div class="absolute top-4 right-4 w-80 z-10">
    <Pane title="Device Scene Controls" expanded={true} padding="75px 7px">
      <!-- Quick Actions -->
      <Folder title="Quick Actions" expanded={true}>
        <Button title="Reset Camera" on:click={quickActions.resetCamera} />
        <Button title="Reset Animation" on:click={quickActions.resetAnimation} />
        <Button title="Reset Lighting" on:click={quickActions.resetLighting} />
        <Separator />
        <Checkbox bind:value={orbitControlsEnabled} label="Orbit Controls" />
        <Checkbox bind:value={debugMode} label="Debug Mode" />
      </Folder>

      <Separator />

      <!-- Device Controls -->
      <Folder title="Device Visibility" expanded={true}>
        <Checkbox bind:value={settings.devices.macbookEnabled} label="MacBook" />
        <Checkbox bind:value={settings.devices.iPhoneEnabled} label="iPhone" />
      </Folder>

      <Separator />

      <Folder title="Animation" expanded={false}>
        <Slider bind:value={settings.animation.springStiffness} label="Spring Stiffness" min={0.01} max={1} step={0.01} />
        <Slider bind:value={settings.animation.springDamping} label="Spring Damping" min={0.1} max={1} step={0.01} />
        <Slider bind:value={settings.animation.animationSpeed} label="Animation Speed" min={1} max={20} step={0.5} />
      </Folder>

      <Separator />

      <Folder title="Camera" expanded={true}>
        <Point bind:value={settings.camera.position} label="Position" step={0.1} />
        <Point bind:value={settings.camera.target} label="Target" step={0.1} />
        <Slider bind:value={settings.camera.fov} label="Field of View" min={10} max={120} step={1} />
      </Folder>

      <Separator />

      <Folder title="Lighting" expanded={false}>
        <Slider bind:value={settings.lighting.directionalIntensity} label="Directional Light" min={0} max={5} step={0.1} />
        <Slider bind:value={settings.lighting.ambientIntensity} label="Ambient Light" min={0} max={2} step={0.1} />
        <Slider bind:value={settings.lighting.pointLight1Intensity} label="Point Light 1" min={0} max={3} step={0.1} />
        <Slider bind:value={settings.lighting.pointLight2Intensity} label="Point Light 2" min={0} max={3} step={0.1} />
      </Folder>

      <Separator />

      <Folder title="Contact Shadows" expanded={false}>
        <Slider bind:value={settings.contactShadows.opacity} label="Opacity" min={0} max={1} step={0.01} />
        <Slider bind:value={settings.contactShadows.width} label="Width" min={1} max={20} step={0.5} />
        <Slider bind:value={settings.contactShadows.height} label="Height" min={1} max={20} step={0.5} />
        <Slider bind:value={settings.contactShadows.blur} label="Blur" min={0} max={10} step={0.1} />
        <Slider bind:value={settings.contactShadows.far} label="Far" min={1} max={10} step={0.1} />
      </Folder>

      <Separator />

      <Folder title="Hover Effects" expanded={false}>
        <Point bind:value={settings.hover.macbookRotation} label="MacBook Rotation" step={0.01} />
        <Point bind:value={settings.hover.iPhonePosition} label="iPhone Position" step={0.01} />
        <Point bind:value={settings.hover.iPhoneRotation} label="iPhone Rotation" step={0.01} />
      </Folder>

      <Separator />

      <Folder title="Focus States">
        <List bind:value={focus} label="Focus" options={["", "macbook", "iPhone"]} />
        <Folder title="MacBook Focus">
          <Point bind:value={settings.focus.macbook.rotation} label="Rotation" step={0.01} />
          <Point bind:value={settings.focus.macbook.cameraPosition} label="Camera Position" step={0.1} />
          <Point bind:value={settings.focus.macbook.cameraTarget} label="Camera Target" step={0.1} />
        </Folder>
        <Folder title="iPhone Focus">
          <Point bind:value={settings.focus.iPhone.position} label="Position" step={0.01} />
          <Point bind:value={settings.focus.iPhone.rotation} label="Rotation" step={0.01} />
          <Point bind:value={settings.focus.iPhone.cameraPosition} label="Camera Position" step={0.1} />
          <Point bind:value={settings.focus.iPhone.cameraTarget} label="Camera Target" step={0.1} />
        </Folder>
      </Folder>
      <Separator />

      {#if debugMode}
        <Separator />
        <Folder title="Debug Info" expanded={true}>
          <Element>
            <p class="w-full h-32 text-xs font-mono bg-gray-100 p-2 rounded border">{JSON.stringify(settings, null, 2)}</p>
          </Element>
        </Folder>
      {/if}
    </Pane>
  </div>
</div>
