<script lang="ts">
  import { Canvas } from "@threlte/core";
  import { Button, Checkbox, Pane, Folder, Slider, Color as TweakpaneColor, List, Point, Separator, Element } from "svelte-tweakpane-ui";
  import Scene from "./Scene.svelte";
  import { setDeviceSceneState } from "./deviceSceneState.svelte";
  const deviceState = setDeviceSceneState();
</script>

<div class="relative size-full">
  {#await import("@threlte/studio") then { Studio }}
    <Canvas>
      <Studio>
        <Scene />
      </Studio>
    </Canvas>
  {/await}

  <div class="absolute top-4 right-4 w-80 z-10">
    <Pane title="Device Scene Controls" expanded={true} padding="75px 7px">
      <!-- Quick Actions -->
      <Folder title="Quick Actions" expanded={true}>
        <Button title="Reset Camera" on:click={deviceState.resetCamera} />
        <Button title="Reset Animation" on:click={deviceState.resetAnimation} />
        <Button title="Reset Lighting" on:click={deviceState.resetLighting} />
        <Button title="Reset All" on:click={deviceState.resetToDefaults} />
        <Separator />
        <Checkbox bind:value={deviceState.orbitControlsEnabled} label="Orbit Controls" />
        <Checkbox bind:value={deviceState.debugMode} label="Debug Mode" />
      </Folder>

      <Separator />

      <Folder title="Device Visibility" expanded={true}>
        <Checkbox value={deviceState.deviceStates.macbook !== "disabled"} on:change={() => deviceState.toggleDevice("macbook")} label="MacBook" />
        <Checkbox value={deviceState.deviceStates.iphone !== "disabled"} on:change={() => deviceState.toggleDevice("iphone")} label="iPhone" />
      </Folder>

      <Separator />

      <Folder title="Animation" expanded={false}>
        <Slider bind:value={deviceState.springConfig.stiffness} label="Spring Stiffness" min={0.01} max={1} step={0.01} />
        <Slider bind:value={deviceState.springConfig.damping} label="Spring Damping" min={0.1} max={1} step={0.01} />
        <Slider bind:value={deviceState.animationSpeed} label="Animation Speed" min={1} max={20} step={0.5} />
      </Folder>

      <Separator />

      <Folder title="Camera" expanded={true}>
        <Point bind:value={deviceState.cameraTransform.current.position} label="Position" step={0.1} />
        <Point bind:value={deviceState.cameraTransform.current.target} label="Target" step={0.1} />
        <Slider bind:value={deviceState.cameraTransform.current.fov} label="Field of View" min={10} max={120} step={1} />
      </Folder>

      <Separator />

      <Folder title="Lighting" expanded={false}>
        <Slider bind:value={deviceState.lighting.directional} label="Directional Light" min={0} max={5} step={0.1} />
        <Slider bind:value={deviceState.lighting.ambient} label="Ambient Light" min={0} max={2} step={0.1} />
        <Slider bind:value={deviceState.lighting.point1} label="Point Light 1" min={0} max={3} step={0.1} />
        <Slider bind:value={deviceState.lighting.point2} label="Point Light 2" min={0} max={3} step={0.1} />
      </Folder>

      <Separator />

      <Folder title="Contact Shadows" expanded={false}>
        <Slider bind:value={deviceState.shadows.opacity} label="Opacity" min={0} max={1} step={0.01} />
        <Slider bind:value={deviceState.shadows.width} label="Width" min={1} max={20} step={0.5} />
        <Slider bind:value={deviceState.shadows.height} label="Height" min={1} max={20} step={0.5} />
        <Slider bind:value={deviceState.shadows.blur} label="Blur" min={0} max={10} step={0.1} />
        <Slider bind:value={deviceState.shadows.far} label="Far" min={1} max={10} step={0.1} />
      </Folder>

      <Separator />

      <Folder title="Focus States">
        <List
          value={Object.entries(deviceState.deviceStates).find(([_, state]) => state === "focused")?.[0] || ""}
          on:change={(e) => {
            const device = e.detail.value;
            if (device && (device === "macbook" || device === "iphone")) {
              deviceState.setDeviceState(device, "focused");
            } else {
              // Reset all to idle
              deviceState.resetCamera();
            }
          }}
          label="Focus"
          options={["", "macbook", "iphone"]}
        />
      </Folder>

      <Separator />

      {#if deviceState.debugMode}
        <Separator />
        <Folder title="Debug Info" expanded={true}>
          <Element>
            <p class="w-full h-32 text-xs font-mono bg-gray-100 p-2 rounded border">
              Device States: {JSON.stringify(deviceState.deviceStates, null, 2)}
              MacBook Animation: {deviceState.macbookAnimationState}
            </p>
          </Element>
        </Folder>
      {/if}
    </Pane>
  </div>
</div>
