<script lang="ts">
  import { Canvas } from "@threlte/core";
  import { Grid } from "@threlte/extras";
  import { Button, Checkbox, Pane, Folder, Slider, Color as TweakpaneColor, List, Point, Separator, Element } from "svelte-tweakpane-ui";
  import Scene from "./Scene.svelte";
  import { deviceSceneState } from "./deviceSceneState.svelte";
  const deviceState = deviceSceneState;
  const useStudio = false;
  const backgroundColor = $state("#161815");
  const cellColor = $state("#242623");
  const sectionColor = $state("#242623");
</script>

{#snippet createCanvas(useStudio: boolean)}
  <Canvas>
    {#if useStudio}
      {#await import("@threlte/studio") then { Studio }}
        <Studio>
          <Grid position={[0, -0.2, 0]} infiniteGrid {backgroundColor} backgroundOpacity={1} {cellColor} {sectionColor} />

          <Scene />
        </Studio>
      {/await}
    {:else}
      <Grid position={[0, -0.2, 0]} infiniteGrid {backgroundColor} backgroundOpacity={1} {cellColor} {sectionColor} />
      <Scene />
    {/if}
  </Canvas>
{/snippet}

<div class="relative size-full">
  {@render createCanvas(useStudio)}

  <div class="absolute top-4 right-4 w-80 z-10">
    <Pane title="Device Scene Controls" expanded={false} padding="75px 7px">
      <!-- Quick Actions -->
      <Folder title="Quick Actions" expanded={true}>
        <Button title="Reset Camera" on:click={deviceState.resetCamera} />
        <Button title="Reset All" on:click={deviceState.resetToDefaults} />
        <Separator />
        <Checkbox bind:value={deviceState.orbitControlsEnabled} label="Orbit Controls" />
        <Checkbox bind:value={deviceState.debugMode} label="Debug Mode" />
      </Folder>

      <Separator />

      <Folder title="Animation" expanded={false}>
        <Slider bind:value={deviceState.springConfig.stiffness} label="Spring Stiffness" min={0.01} max={1} step={0.01} />
        <Slider bind:value={deviceState.springConfig.damping} label="Spring Damping" min={0.1} max={1} step={0.01} />
      </Folder>

      <Separator />

      <Folder title="Device State">
        <List
          value={deviceState.state}
          on:change={(e) => {
            const state = e.detail.value;
            if (state === "idle" || state === "hovered" || state === "focused" || state === "disabled") {
              deviceState.setDeviceState(state);
            }
          }}
          label="Current State"
          options={[
            { text: "Disabled", value: "disabled" },
            { text: "Idle", value: "idle" },
            { text: "Hovered", value: "hovered" },
            { text: "Focused", value: "focused" },
          ]}
        />
      </Folder>

      <Separator />

      {#if deviceState.debugMode}
        <Separator />
        <Folder title="Debug Info" expanded={true}>
          <Element>
            <p class="w-full h-20 text-xs font-mono bg-gray-100 p-2 rounded border">
              Device State: {deviceState.state}
              {#if deviceState.cameraPosition}
                Camera Position: [{deviceState.cameraPosition.current.map((n) => n.toFixed(1)).join(", ")}]
              {/if}
            </p>
          </Element>
        </Folder>
      {/if}
    </Pane>
  </div>
</div>
