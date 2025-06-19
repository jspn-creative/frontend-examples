import { Spring } from "svelte/motion";
import type { Vector3Tuple } from "three";
import * as THREE from "three";
import { useCursor } from "@threlte/extras";

export type DeviceState = "disabled" | "idle" | "hovered" | "focused";

export interface CameraConfig {
  position: Vector3Tuple;
  target: Vector3Tuple;
  fov: number;
}

export class DeviceSceneState {
  state = $state<DeviceState>("idle");
  orbitControlsEnabled = $state(false);
  debugMode = $state(false);

  springConfig = { stiffness: 0.1, damping: 0.4 };

  iPhonePosition!: Spring<Vector3Tuple>;
  iPhoneRotation!: Spring<Vector3Tuple>;
  cameraPosition!: Spring<Vector3Tuple>;
  cameraTarget!: Spring<Vector3Tuple>;
  cameraFov!: Spring<number>;

  modelRef = $state<THREE.Group | undefined>(undefined);
  cameraRef = $state<THREE.PerspectiveCamera | undefined>(undefined);

  private cursor!: ReturnType<typeof useCursor>;
  private isInitialized = false;

  private deviceTransforms = {
    idle: { position: [0, 0, 0] as Vector3Tuple, rotation: [-1.5, 0, 0] as Vector3Tuple },
    hovered: { position: [0, 0.5, 0] as Vector3Tuple, rotation: [-1.4, 0, 0] as Vector3Tuple },
    focused: { position: [0, 1.5, 0] as Vector3Tuple, rotation: [0.75, 0, 0] as Vector3Tuple },
  };

  private getCameraConfig(): CameraConfig {
    if (this.state === "focused") {
      return { position: [0, 5.1, -3.5], target: [0, 1.5, 0], fov: 45 };
    }

    return { position: [0, 7.1, -9.5], target: [0, 0, 0], fov: 45 };
  }

  initializeEffects() {
    if (this.isInitialized) return;

    this.iPhonePosition = new Spring<Vector3Tuple>([0, 0, 0], this.springConfig);
    this.iPhoneRotation = new Spring<Vector3Tuple>([-1.5, 0, 0], this.springConfig);
    this.cameraPosition = new Spring<Vector3Tuple>([0, 7.1, -9.5], this.springConfig);
    this.cameraTarget = new Spring<Vector3Tuple>([0, 0, 0], this.springConfig);
    this.cameraFov = new Spring(45, this.springConfig);

    this.cursor = useCursor();

    this.isInitialized = true;

    $effect(() => {
      if (this.state !== "disabled") {
        const transform = this.deviceTransforms[this.state] || this.deviceTransforms.idle;
        this.iPhonePosition.target = transform.position;
        this.iPhoneRotation.target = transform.rotation;
      }

      const cameraConfig = this.getCameraConfig();
      this.cameraPosition.target = cameraConfig.position;
      this.cameraTarget.target = cameraConfig.target;
      this.cameraFov.target = cameraConfig.fov;
    });
  }

  setDeviceState = (state: DeviceState) => {
    this.state = state;
  };

  toggleDevice = () => {
    this.state = this.state === "disabled" ? "idle" : "disabled";
  };

  toggleFocus = () => {
    if (this.state === "disabled") return;
    this.state = this.state === "focused" ? "idle" : "focused";
  };

  resetCamera = () => {
    this.state = this.state === "disabled" ? "disabled" : "idle";
  };

  resetToDefaults = () => {
    this.state = "idle";
    this.orbitControlsEnabled = false;
    this.resetCamera();
  };

  handleDeviceHover = (isHovering: boolean) => {
    if (this.state === "disabled" || this.state === "focused") return;

    if (isHovering) {
      this.cursor?.onPointerEnter();
      this.setDeviceState("hovered");
    } else {
      this.cursor?.onPointerLeave();
      this.setDeviceState("idle");
    }
  };

  handleDeviceClick = () => {
    if (this.state === "disabled") return;
    this.setDeviceState(this.state === "focused" ? "idle" : "focused");
  };

  handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      this.resetCamera();
    }
  };
}

export const deviceSceneState = new DeviceSceneState();
