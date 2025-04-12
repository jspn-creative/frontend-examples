type RayConfig = {
    height?: string;
    left?: string;
    top?: string;
    width?: string;
    bottom?: string;
    rotation?: number;
    animated?: boolean;
};

type LightSourceConfig = {
    height?: string;
    left?: string;
    top?: string;
    width?: string;
    bottom?: string;
    opacity: number;
};

type RayOptions = {
    minScale?: number;
    maxScale?: number;
    minOpacity?: number;
    maxOpacity?: number;
    minDurationMs?: number;
    maxDurationMs?: number;
    speedMultiplier?: number;
    centered?: boolean;
};

const defaultOptions = {
    minScale: 0.6,
    maxScale: 1.5,
    minOpacity: 0.2,
    maxOpacity: 0.9,
    minDurationMs: 3000,
    maxDurationMs: 6000,
    speedMultiplier: 0,
    centered: false,
};

const rayConfigs: RayConfig[] = [
    { height: "1865px", left: "calc(49.75% - 18px)", top: "-352px", width: "36px", rotation: 0, animated: true },
    { bottom: "147px", left: "calc(49.5% - 11px)", top: "-357px", width: "22px", rotation: 25, animated: true },
    { bottom: "-7px", left: "calc(49.5% - 12px)", top: "-354px", width: "24px", rotation: 11, animated: true },
    { bottom: "-128px", left: "calc(49.5833% - 12.5px)", top: "-350px", width: "25px", rotation: -12 },
    { bottom: "-920px", left: "calc(50% - 17.5px)", top: "-352px", width: "35px", rotation: -24 },
    { bottom: "-164px", left: "calc(49.4167% - 18.5px)", top: "-348px", width: "37px", rotation: -18, animated: true },
    { bottom: "-296px", left: "calc(49.8333% - 8px)", top: "-352px", width: "16px", rotation: -5, animated: true },
    { bottom: "-121px", left: "calc(49.75% - 5.5px)", top: "-352px", width: "11px", rotation: -3 },
    { bottom: "29px", left: "calc(49.75% - 7px)", top: "-354px", width: "14px", rotation: 18 },
    { bottom: "-121px", left: "calc(49.6667% - 7px)", top: "-353px", width: "14px", rotation: 6 }
];

const lightSourceConfigs: LightSourceConfig[] = [
    // { bottom: "-40vh", left: "calc(50% - 50vw)", top: "-40vh", width: "100vw", opacity: 0.3 },
    // { height: "929px", left: "calc(50% - 432.5px)", top: "-252px", width: "865px", opacity: 0.46 },
    // { height: "639px", left: "calc(50% - 389px)", top: "-393px", width: "778px", opacity: 0.72 }
];

function createRayElement(config: RayConfig): HTMLElement {
    const div = document.createElement('div');
    const classes = [
        'ray',
        'absolute',
        'z-[1]',
        'bg-[radial-gradient(50%_50%_at_50%_50%,oklch(1_0_0)_0%,rgba(236,252,255,0.85)_25%,rgba(56,189,248,0.5)_50%,rgba(56,189,248,0)_100%)]',
        'overflow-hidden',
        '[transform-origin:100%_0%_0px]',
        'mix-blend-screen'
    ];

    if (config.animated) {
        classes.push('animated');
        div.style.willChange = 'transform';
    }

    div.className = classes.join(' ');

    Object.entries(config).forEach(([key, value]) => {
        if (key === 'rotation' && typeof value === 'number') {
            div.style.transform = `rotate(${value}deg)`;
        } else if (key !== 'animated' && typeof value === 'string') {
            div.style[key as any] = value;
        }
    });

    return div;
}

function createLightSourceElement(config: LightSourceConfig): HTMLElement {
    const div = document.createElement('div');
    div.className = 'light-source rounded-full absolute z-[1] flex-none overflow-hidden bg-[radial-gradient(50%_50%_at_50%_50%,var(--color-white)_0%,#ffffffff_100%)] [origin-x:1px] [origin-y:0]';

    Object.entries(config).forEach(([key, value]) => {
        if (key === 'opacity') {
            div.style.opacity = value.toString();
        } else {
            div.style[key as any] = value as string;
        }
    });

    return div;
}

export function rays(node: HTMLElement, options: RayOptions = {}) {
    const opts = { ...defaultOptions, ...options };
    let animatedRaysData: { element: HTMLElement; duration: number; phaseOffset: number; originalRotation: string; }[] = [];
    let animationFrame: number;

    // Set container styles
    node.className = `flex-none h-[200vh] overflow-hidden absolute -top-[100%] min-w-screen w-[100vw] z-[1] blur-[1rem]  ${!opts.centered ? '-rotate-33 -left-80 [mask:radial-gradient(90%_50%_at_60%_40%,rgb(0,0,0)_0%,transparent_70%)]' : '[mask:radial-gradient(50%_50%_at_40%_50%,_rgb(0,_0,_0)_0%,_rgba(0,_0,_0,_1)_0%,_#ffffff00_100%)]'}`;

    function init() {
        // Clear any existing content
        node.innerHTML = '';

        // Create rays
        rayConfigs.forEach(config => {
            const rayElement = createRayElement(config);
            node.appendChild(rayElement);

            if (config.animated) {
                const duration = Math.random() * (opts.maxDurationMs - opts.minDurationMs) + opts.minDurationMs;
                const phaseOffset = Math.random() * 2 * Math.PI;
                const rotation = config.rotation ? `rotate(${config.rotation}deg)` : '';

                animatedRaysData.push({
                    element: rayElement,
                    duration,
                    phaseOffset,
                    originalRotation: rotation
                });
            }
        });

        // Create light sources
        lightSourceConfigs.forEach(config => {
            const lightElement = createLightSourceElement(config);
            node.appendChild(lightElement);
        });

        if (animatedRaysData.length > 0) {
            animationFrame = requestAnimationFrame(animateRays);
        }
    }

    function animateRays(timestamp: number) {
        animatedRaysData.forEach((rayData) => {
            const { element, duration, phaseOffset, originalRotation } = rayData;
            const cycleProgress = ((timestamp * opts.speedMultiplier) / duration + phaseOffset) % (2 * Math.PI);
            const progressFactor = (Math.sin(cycleProgress) + 1) / 2;

            const currentScale = opts.minScale + (opts.maxScale - opts.minScale) * progressFactor;
            const currentOpacity = opts.minOpacity + (opts.maxOpacity - opts.minOpacity) * progressFactor;

            element.style.opacity = currentOpacity.toString();
            element.style.transform = `scale(${currentScale}) ${originalRotation}`;
        });

        animationFrame = requestAnimationFrame(animateRays);
    }

    init();

    return {
        update(newOptions: RayOptions) {
            Object.assign(opts, { ...defaultOptions, ...newOptions });
            init();
        },
        destroy() {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            animatedRaysData = [];
            node.innerHTML = '';
        }
    };
}