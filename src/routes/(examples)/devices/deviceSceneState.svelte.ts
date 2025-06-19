import { Spring } from "svelte/motion";
import * as THREE from "three";

export type DeviceType = "macbook" | "iphone";
export type DeviceState = "disabled" | "idle" | "hovered" | "focused";
export type MacBookAnimationState = "closed" | "opening" | "open" | "closing";

export interface CameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface DeviceSceneState {
  deviceStates: Record<DeviceType, DeviceState>;
  macbookAnimationState: MacBookAnimationState;

  orbitControlsEnabled: boolean;
  debugMode: boolean;

  springConfig: { stiffness: number; damping: number };
  animationSpeed: number;

  lighting: {
    directional: number;
    ambient: number;
    point1: number;
    point2: number;
  };

  shadows: {
    opacity: number;
    width: number;
    height: number;
    blur: number;
    far: number;
  };

  modelRef: THREE.Group | undefined;
  cameraRef: THREE.PerspectiveCamera | undefined;
  actions: any;
  mixer: any;

  iPhoneTransform: Spring<{ position: [number, number, number]; rotation: [number, number, number] }>;
  macbookRotation: Spring<[number, number, number]>;
  cameraTransform: Spring<CameraConfig>;

  targetCameraConfig: CameraConfig;

  currentMacbookRotation: [number, number, number];

  setDeviceState: (device: DeviceType, state: DeviceState) => void;
  toggleDevice: (device: DeviceType) => void;
  resetToDefaults: () => void;
  resetCamera: () => void;
  resetLighting: () => void;
  resetShadows: () => void;
  resetAnimation: () => void;

  openMacBook: () => void;
  closeMacBook: () => void;

  handleDeviceHover: (device: DeviceType, isHovering: boolean) => void;
  handleDeviceClick: (device: DeviceType) => void;
  handleKeydown: (event: KeyboardEvent) => void;
}

export class DeviceSceneState implements DeviceSceneState {
  resetCamera = () => {
    // Reset device states to idle (which will trigger camera recalculation)
    this.deviceStates = {
      macbook: this.deviceStates.macbook === "disabled" ? "disabled" : "idle",
      iphone: this.deviceStates.iphone === "disabled" ? "disabled" : "idle",
    };
    // Ensure MacBook is closed if it was focused and open
    if (this.macbookAnimationState === "open") {
      this.closeMacBook();
    }
  };

  resetLighting = () => {
    this.lighting = { directional: 2, ambient: 0.8, point1: 1, point2: 0.5 };
  };

  resetShadows = () => {
    this.shadows = { opacity: 0.4, width: 10, height: 10, blur: 2.5, far: 4 };
  };

  resetAnimation = () => {
    this.springConfig = { stiffness: 0.1, damping: 0.4 };
    this.animationSpeed = 6;
    this.macbookAnimationState = "closed";
    if (this.actions?.current?.Animation) {
      // Check if actions are available
      this.closeMacBook();
    }
  };

  resetToDefaults = () => {
    this.deviceStates = { macbook: "idle", iphone: "idle" };
    this.macbookAnimationState = "closed";
    this.springConfig = { stiffness: 0.1, damping: 0.4 };
    this.animationSpeed = 6;
    this.lighting = { directional: 2, ambient: 0.8, point1: 1, point2: 0.5 };
    this.shadows = { opacity: 0.4, width: 10, height: 10, blur: 2.5, far: 4 };
    this.orbitControlsEnabled = true;
    this.debugMode = true;
    if (this.macbookAnimationState !== "closed" && this.actions?.current?.Animation) {
      this.closeMacBook();
    }
    this.resetAnimation();
    this.resetCamera();
    this.resetLighting();
    this.resetShadows();
  };

  deviceStates = $state<Record<DeviceType, DeviceState>>({ macbook: "idle", iphone: "idle" });
  macbookAnimationState = $state<MacBookAnimationState>("closed");
  orbitControlsEnabled = $state(true);
  debugMode = $state(true);
  springConfig = $state({ stiffness: 0.1, damping: 0.4 });
  animationSpeed = $state(6);
  lighting = $state({ directional: 2, ambient: 0.8, point1: 1, point2: 0.5 });
  shadows = $state({ opacity: 0.4, width: 10, height: 10, blur: 2.5, far: 4 });
  iPhoneTransform: Spring<{ position: [number, number, number]; rotation: [number, number, number] }> = new Spring(
    {
      position: [0, 0, 0] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
    },
    this.springConfig
  );
  macbookRotation: Spring<[number, number, number]> = $state(new Spring([0, 0, 0] as [number, number, number], this.springConfig));
  cameraTransform: Spring<CameraConfig> = $state(new Spring(this.getCameraConfig(), this.springConfig));
  modelRef = $state<THREE.Group | undefined>(undefined);
  cameraRef = $state<THREE.PerspectiveCamera | undefined>(undefined);
  actions = $state<any>(undefined);
  mixer = $state<any>(undefined);

  private deviceTransforms = {
    macbook: {
      idle: { position: [3, -0.16, 0] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
      hovered: { position: [3, -0.16, 0] as [number, number, number], rotation: [-0.15, 0, 0] as [number, number, number] },
      focused: { position: [3, -0.16, 0] as [number, number, number], rotation: [-0.3, 0, 0] as [number, number, number] },
    },
    iphone: {
      idle: { position: [-3, 0, 0] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
      hovered: { position: [-3, 0.1, 0] as [number, number, number], rotation: [-0.1, 0, 0] as [number, number, number] },
      focused: { position: [-2.9, 0.5, 0] as [number, number, number], rotation: [-0.2, 0.3, 0.1] as [number, number, number] },
    },
  };

  private getCameraConfig(): CameraConfig {
    const enabledDevices = Object.entries(this.deviceStates)
      .filter(([_, state]) => state !== "disabled")
      .map(([device, _]) => device as DeviceType);

    const focusedDevice = Object.entries(this.deviceStates).find(([_, state]) => state === "focused")?.[0] as DeviceType | undefined;

    // If focused on a specific device
    if (focusedDevice === "macbook") {
      return { position: [2.8, 7.1, -9.5], target: [2.8, 0, 0], fov: 55 };
    }
    if (focusedDevice === "iphone") {
      return { position: [-2.9, 7.1, -9.5], target: [-3, 0, 0], fov: 45 };
    }

    // Default based on enabled devices
    if (enabledDevices.length === 2) {
      return { position: [1.2, 7.1, -9.5], target: [1.2, 0, 0], fov: 50 };
    }
    if (enabledDevices.includes("iphone") && !enabledDevices.includes("macbook")) {
      return { position: [-2.9, 7.1, -9.5], target: [-3, 0, 0], fov: 45 };
    }
    if (enabledDevices.includes("macbook") && !enabledDevices.includes("iphone")) {
      return { position: [2.8, 7.1, -9.5], target: [2.8, 0, 0], fov: 55 };
    }

    // Fallback
    return { position: [1.2, 7.1, -9.5], target: [1.2, 0, 0], fov: 50 };
  }

  targetCameraConfig = $derived(this.getCameraConfig());
  currentMacbookRotation = $derived(this.macbookRotation.current);

  constructor() {
    this.resetToDefaults(); // Call resetToDefaults to initialize properties
  }

  // Method to initialize effects - call this from component
  initializeEffects() {
    // Update camera when target changes
    $effect(() => {
      this.cameraTransform.target = this.targetCameraConfig;
    });

    // Update iPhone transform based on state
    $effect(() => {
      const state = this.deviceStates.iphone;
      if (state !== "disabled") {
        const transform = this.deviceTransforms.iphone[state] || this.deviceTransforms.iphone.idle;
        this.iPhoneTransform.target = transform;
      }
    });

    // Update MacBook transform based on state
    $effect(() => {
      const state = this.deviceStates.macbook;
      if (state !== "disabled") {
        const transform = this.deviceTransforms.macbook[state] || this.deviceTransforms.macbook.idle;
        this.macbookRotation.target = transform.rotation;
      }
    });

    // Update spring configurations
    $effect(() => {
      this.iPhoneTransform.stiffness = this.springConfig.stiffness;
      this.iPhoneTransform.damping = this.springConfig.damping;
      this.macbookRotation.stiffness = this.springConfig.stiffness;
      this.macbookRotation.damping = this.springConfig.damping;
      this.cameraTransform.stiffness = this.springConfig.stiffness;
      this.cameraTransform.damping = this.springConfig.damping;
    });

    // Update camera when cameraRef is available and transform changes
    $effect(() => {
      if (this.cameraRef) {
        const [px, py, pz] = this.cameraTransform.current.position;
        const [tx, ty, tz] = this.cameraTransform.current.target;
        this.cameraRef.position.set(px, py, pz);
        this.cameraRef.lookAt(tx, ty, tz);
        this.cameraRef.fov = this.cameraTransform.current.fov;
        this.cameraRef.updateProjectionMatrix();
      }
    });
  }

  setDeviceState = (device: DeviceType, state: DeviceState) => {
    // Clear focus from other devices when focusing
    if (state === "focused") {
      for (const [otherDevice, _] of Object.entries(this.deviceStates)) {
        if (otherDevice !== device) {
          this.deviceStates[otherDevice as DeviceType] = this.deviceStates[otherDevice as DeviceType] === "disabled" ? "disabled" : "idle";
        }
      }
    }

    this.deviceStates[device] = state;

    // Handle MacBook animation
    if (device === "macbook") {
      if (state === "focused" && this.macbookAnimationState === "closed") {
        this.openMacBook();
      } else if (state !== "focused" && this.macbookAnimationState === "open") {
        this.closeMacBook();
      }
    }
  };

  toggleDevice = (device: DeviceType) => {
    const currentState = this.deviceStates[device];
    this.deviceStates[device] = currentState === "disabled" ? "idle" : "disabled";
  };

  openMacBook = () => {
    if (!this.actions?.current?.Animation) return;

    this.macbookAnimationState = "opening";
    const animation = this.actions.current.Animation;
    animation.reset();
    animation.setLoop(THREE.LoopOnce, 1);
    animation.timeScale = this.animationSpeed;
    animation.clampWhenFinished = true;
    animation.time = 0;
    animation.play();

    // Stop at halfway (lid open position)
    const duration = animation.getClip().duration;
    setTimeout(() => {
      if (animation.isRunning()) {
        animation.paused = true;
        this.macbookAnimationState = "open";
      }
    }, ((duration * 0.5) / this.animationSpeed) * 1000);
  };

  closeMacBook = () => {
    if (!this.actions?.current?.Animation) return;

    this.macbookAnimationState = "closing";
    const animation = this.actions.current.Animation;
    animation.paused = false;
    animation.timeScale = -this.animationSpeed;
    animation.setLoop(THREE.LoopOnce, 1);
    animation.clampWhenFinished = true;
    animation.play();

    // Mark as closed when animation completes
    setTimeout(() => {
      this.macbookAnimationState = "closed";
    }, 1000); // Approximate animation duration
  };

  handleDeviceHover = (device: DeviceType, isHovering: boolean) => {
    const currentState = this.deviceStates[device];
    if (currentState === "disabled" || currentState === "focused") return;

    this.setDeviceState(device, isHovering ? "hovered" : "idle");
  };

  handleDeviceClick = (device: DeviceType) => {
    const currentState = this.deviceStates[device];
    if (currentState === "disabled") return;

    if (currentState === "focused") {
      this.setDeviceState(device, "idle");
    } else {
      this.setDeviceState(device, "focused");
    }
  };

  handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      this.resetCamera();
    }
  };
}

export const deviceSceneState = new DeviceSceneState();
