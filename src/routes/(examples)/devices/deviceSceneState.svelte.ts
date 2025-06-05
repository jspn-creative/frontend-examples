import { getContext, setContext } from 'svelte';
import { Spring } from 'svelte/motion';
import * as THREE from 'three';

export type DeviceType = 'macbook' | 'iphone';
export type DeviceState = 'disabled' | 'idle' | 'hovered' | 'focused';
export type MacBookAnimationState = 'closed' | 'opening' | 'open' | 'closing';

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

class DeviceSceneStateClass implements DeviceSceneState {
  private static readonly DEFAULTS = {
    deviceStates: { macbook: 'idle' as DeviceState, iphone: 'idle' as DeviceState },
    macbookAnimationState: 'closed' as MacBookAnimationState,
    orbitControlsEnabled: true,
    debugMode: true,
    springConfig: { stiffness: 0.1, damping: 0.4 },
    animationSpeed: 6,
    lighting: {
      directional: 2,
      ambient: 0.8,
      point1: 1,
      point2: 0.5
    },
    shadows: {
      opacity: 0.4,
      width: 10,
      height: 10,
      blur: 2.5,
      far: 4
    }
  } as const;

  deviceStates = $state<Record<DeviceType, DeviceState>>({ ...DeviceSceneStateClass.DEFAULTS.deviceStates });
  macbookAnimationState = $state<MacBookAnimationState>(DeviceSceneStateClass.DEFAULTS.macbookAnimationState);
  orbitControlsEnabled = $state(DeviceSceneStateClass.DEFAULTS.orbitControlsEnabled);
  debugMode = $state(DeviceSceneStateClass.DEFAULTS.debugMode);
  springConfig = $state({ ...DeviceSceneStateClass.DEFAULTS.springConfig });
  animationSpeed = $state(DeviceSceneStateClass.DEFAULTS.animationSpeed);
  lighting = $state({ ...DeviceSceneStateClass.DEFAULTS.lighting });
  shadows = $state({ ...DeviceSceneStateClass.DEFAULTS.shadows });

  modelRef = $state<THREE.Group | undefined>(undefined);
  cameraRef = $state<THREE.PerspectiveCamera | undefined>(undefined);
  actions = $state<any>(undefined);
  mixer = $state<any>(undefined);

  // Base transforms for each device state
  private deviceTransforms = {
    macbook: {
      idle: { position: [3, -0.16, 0] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
      hovered: { position: [3, -0.16, 0] as [number, number, number], rotation: [-0.15, 0, 0] as [number, number, number] },
      focused: { position: [3, -0.16, 0] as [number, number, number], rotation: [-0.3, 0, 0] as [number, number, number] }
    },
    iphone: {
      idle: { position: [-3, 0, 0] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
      hovered: { position: [-3, 0.1, 0] as [number, number, number], rotation: [-0.1, 0, 0] as [number, number, number] },
      focused: { position: [-2.9, 0.5, 0] as [number, number, number], rotation: [-0.2, 0.3, 0.1] as [number, number, number] }
    }
  };

  private getCameraConfig(): CameraConfig {
    const enabledDevices = Object.entries(this.deviceStates)
      .filter(([_, state]) => state !== 'disabled')
      .map(([device, _]) => device as DeviceType);

    const focusedDevice = Object.entries(this.deviceStates)
      .find(([_, state]) => state === 'focused')?.[0] as DeviceType | undefined;

    // If focused on a specific device
    if (focusedDevice === 'macbook') {
      return { position: [2.8, 7.1, -9.5], target: [2.8, 0, 0], fov: 55 };
    }
    if (focusedDevice === 'iphone') {
      return { position: [-2.9, 7.1, -9.5], target: [-3, 0, 0], fov: 45 };
    }

    // Default based on enabled devices
    if (enabledDevices.length === 2) {
      return { position: [1.2, 7.1, -9.5], target: [1.2, 0, 0], fov: 50 };
    }
    if (enabledDevices.includes('iphone') && !enabledDevices.includes('macbook')) {
      return { position: [-2.9, 7.1, -9.5], target: [-3, 0, 0], fov: 45 };
    }
    if (enabledDevices.includes('macbook') && !enabledDevices.includes('iphone')) {
      return { position: [2.8, 7.1, -9.5], target: [2.8, 0, 0], fov: 55 };
    }

    // Fallback
    return { position: [1.2, 7.1, -9.5], target: [1.2, 0, 0], fov: 50 };
  }

  // Initialize springs
  iPhoneTransform = new Spring({ 
    position: [0, 0, 0] as [number, number, number], 
    rotation: [0, 0, 0] as [number, number, number] 
  }, this.springConfig);

  macbookRotation = new Spring([0, 0, 0] as [number, number, number], this.springConfig);

  cameraTransform = new Spring(this.getCameraConfig(), this.springConfig);

  targetCameraConfig = $derived(this.getCameraConfig());
  currentMacbookRotation = $derived(this.macbookRotation.current);

  constructor() {
    // Update camera when target changes
    $effect(() => {
      this.cameraTransform.target = this.targetCameraConfig;
    });

    // Update iPhone transform based on state
    $effect(() => {
      const state = this.deviceStates.iphone;
      if (state !== 'disabled') {
        const transform = this.deviceTransforms.iphone[state] || this.deviceTransforms.iphone.idle;
        this.iPhoneTransform.target = transform;
      }
    });

    // Update MacBook transform based on state
    $effect(() => {
      const state = this.deviceStates.macbook;
      if (state !== 'disabled') {
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
    if (state === 'focused') {
      for (const [otherDevice, _] of Object.entries(this.deviceStates)) {
        if (otherDevice !== device) {
          this.deviceStates[otherDevice as DeviceType] = 
            this.deviceStates[otherDevice as DeviceType] === 'disabled' ? 'disabled' : 'idle';
        }
      }
    }

    this.deviceStates[device] = state;

    // Handle MacBook animation
    if (device === 'macbook') {
      if (state === 'focused' && this.macbookAnimationState === 'closed') {
        this.openMacBook();
      } else if (state !== 'focused' && this.macbookAnimationState === 'open') {
        this.closeMacBook();
      }
    }
  };

  toggleDevice = (device: DeviceType) => {
    const currentState = this.deviceStates[device];
    this.deviceStates[device] = currentState === 'disabled' ? 'idle' : 'disabled';
  };

  openMacBook = () => {
    if (!this.actions?.current?.Animation) return;

    this.macbookAnimationState = 'opening';
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
        this.macbookAnimationState = 'open';
      }
    }, ((duration * 0.5) / this.animationSpeed) * 1000);
  };

  closeMacBook = () => {
    if (!this.actions?.current?.Animation) return;

    this.macbookAnimationState = 'closing';
    const animation = this.actions.current.Animation;
    animation.paused = false;
    animation.timeScale = -this.animationSpeed;
    animation.setLoop(THREE.LoopOnce, 1);
    animation.clampWhenFinished = true;
    animation.play();

    // Mark as closed when animation completes
    setTimeout(() => {
      this.macbookAnimationState = 'closed';
    }, 1000); // Approximate animation duration
  };

  resetToDefaults = () => {
    this.deviceStates = { ...DeviceSceneStateClass.DEFAULTS.deviceStates };
    this.closeMacBook();
    this.springConfig = { ...DeviceSceneStateClass.DEFAULTS.springConfig };
    this.animationSpeed = DeviceSceneStateClass.DEFAULTS.animationSpeed;
    this.lighting = { ...DeviceSceneStateClass.DEFAULTS.lighting };
    this.shadows = { ...DeviceSceneStateClass.DEFAULTS.shadows };
    this.orbitControlsEnabled = DeviceSceneStateClass.DEFAULTS.orbitControlsEnabled;
    this.debugMode = DeviceSceneStateClass.DEFAULTS.debugMode;
  };

  resetCamera = () => {
    // Reset device states to idle (which will trigger camera recalculation)
    this.deviceStates = { 
      macbook: this.deviceStates.macbook === 'disabled' ? 'disabled' : 'idle',
      iphone: this.deviceStates.iphone === 'disabled' ? 'disabled' : 'idle'
    };
  };

  resetLighting = () => {
    this.lighting = { ...DeviceSceneStateClass.DEFAULTS.lighting };
  };

  resetShadows = () => {
    this.shadows = { ...DeviceSceneStateClass.DEFAULTS.shadows };
  };

  resetAnimation = () => {
    this.springConfig = { ...DeviceSceneStateClass.DEFAULTS.springConfig };
    this.animationSpeed = DeviceSceneStateClass.DEFAULTS.animationSpeed;
    this.closeMacBook();
  };

  handleDeviceHover = (device: DeviceType, isHovering: boolean) => {
    const currentState = this.deviceStates[device];
    if (currentState === 'disabled' || currentState === 'focused') return;

    this.setDeviceState(device, isHovering ? 'hovered' : 'idle');
  };

  handleDeviceClick = (device: DeviceType) => {
    const currentState = this.deviceStates[device];
    if (currentState === 'disabled') return;

    if (currentState === 'focused') {
      this.setDeviceState(device, 'idle');
    } else {
      this.setDeviceState(device, 'focused');
    }
  };

  handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.resetCamera();
    }
  };
}

const DEFAULT_KEY = '$_device_scene_state';

export const getDeviceSceneState = (key = DEFAULT_KEY) => {
  return getContext<DeviceSceneState>(key);
};

export const setDeviceSceneState = (key = DEFAULT_KEY) => {
  const deviceSceneState = new DeviceSceneStateClass();
  return setContext(key, deviceSceneState);
};
