<script lang="ts">
  import { Canvas } from "@threlte/core";
  import { dev } from "$app/environment";
  import { Button, Checkbox, Pane, Folder, Slider, Color as TweakpaneColor, List, Point } from "svelte-tweakpane-ui";
  import { innerWidth, innerHeight } from "svelte/reactivity/window";

  import Scene from "./Scene.svelte";

  const geometryNames = ["Torus Knot", "Sphere", "Torus"];

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

  let currentGeometry = $state(2);
</script>

<Pane position="draggable" title="Controls" expanded padding="75px 7px" x={innerWidth.current - 200}>
  <Folder title="Mesh" expanded={false}>
    <List bind:value={currentGeometry} options={geometryNames.map((name: string, i: number) => ({ text: name, value: i }))} label="Mesh" />
    <Slider bind:value={controls.bloomStrength} min={1} max={20} step={0.01} label="Bloom Strength" />
    <Slider bind:value={controls.rotationY} min={-Math.PI * 2} max={Math.PI * 2} step={0.01} label="Rotation Y" />
    <Button on:click={() => {}} title="Reset Mesh" />
  </Folder>

  <Folder title="Dissolve Effect" expanded={false}>
    <Checkbox bind:value={controls.meshVisible} label="Visible" />
    <Slider bind:value={controls.dissolveProgress} min={-20} max={20} step={0.0001} label="Progress" />
    <Checkbox bind:value={controls.autoDissolve} label="Auto Animate" />
    <Slider bind:value={controls.edgeWidth} min={0.1} max={8} step={0.001} label="Edge Width" />
    <Slider bind:value={controls.frequency} min={0.001} max={2} step={0.001} label="Frequency" />
    <Slider bind:value={controls.amplitude} min={0.1} max={20} step={0.001} label="Amplitude" />
    <TweakpaneColor bind:value={controls.meshColor} label="Mesh Color" />
    <TweakpaneColor bind:value={controls.edgeColor} label="Edge Color" />
    <Button on:click={() => {}} title="Reset Dissolve" />
  </Folder>

  <Folder title="Particle" expanded={false}>
    <Checkbox bind:value={controls.particleVisible} label="Visible" />
    <Slider bind:value={controls.particleBaseSize} min={10} max={400} step={0.01} label="Base Size" />
    <TweakpaneColor bind:value={controls.particleColor} label="Color" />
    <Slider bind:value={controls.particleSpeedFactor} min={0.001} max={0.1} step={0.001} label="Speed" />
    <Slider bind:value={controls.waveAmplitude} min={0} max={5} step={0.01} label="Wave Amp" />
    <Point bind:value={controls.velocityFactor} picker="inline" label="Velocity Factor" />
    <Button on:click={() => {}} title="Reset Particles" />
  </Folder>
</Pane>

{#await import("@threlte/studio") then { Studio }}
  <Canvas>
    <Studio>
      <Scene {controls} {currentGeometry} />
    </Studio>
  </Canvas>
{/await}
