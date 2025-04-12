import type { Action } from 'svelte/action';

export interface ScrambleOptions {
  texts?: string[];          // Array of texts to cycle through
  currentIndex?: number;     // Starting index
  interval?: number;         // Time between text changes in ms
  scrambleTime?: number;     // Duration of scramble effect
  cyclesPerChar?: number;    // How many random characters per character
  characters?: string;       // Characters to use for scrambling
  autoStart?: boolean;       // Start the effect immediately
  randomize?: boolean;  // Randomize the next index instead of sequential
  onComplete?: () => void;   // Callback when a transition completes
}

interface ScrambleState {
  texts: string[];
  currentIndex: number;
  currentText: string;
  displayedText: string;
  isScrambling: boolean;
  timeoutId: NodeJS.Timeout | null;
  intervalId: NodeJS.Timeout | null;
}

export const scramble: Action<HTMLElement, ScrambleOptions> = (node, options = {}) => {
  const defaultOptions: ScrambleOptions = {
    texts: [''],
    currentIndex: 0,
    interval: 4000,
    scrambleTime: 15,
    cyclesPerChar: 3,
    characters: '!@#$%^&*():{};|,.<>/?[]+-=_',
    autoStart: true,
    randomize: true,
    onComplete: undefined
  };

  const settings = { ...defaultOptions, ...options };
  
  // Initialize state
  const state: ScrambleState = {
    texts: settings.texts || [''],
    currentIndex: settings.currentIndex || 0,
    currentText: '',
    displayedText: '',
    isScrambling: false,
    timeoutId: null,
    intervalId: null
  };

  // Set initial text
  if (state.texts.length > 0 && state.currentIndex! < state.texts.length) {
    state.currentText = state.texts[state.currentIndex!];
    state.displayedText = settings.autoStart ? '' : state.currentText;
    node.textContent = state.displayedText;
  }

  // Start cycling if auto-start is enabled
  if (settings.autoStart && state.texts.length > 0) {
    // Initial scramble
    scrambleTransition(state.texts[state.currentIndex!]);
    
    // Set up interval for cycling texts
    if (state.texts.length > 1 && settings.interval) {
      state.intervalId = setInterval(() => {
        if (settings.randomize) {
          // Get random index different from current one
          let nextIndex;
          if (state.texts.length > 1) {
            do {
              nextIndex = Math.floor(Math.random() * state.texts.length);
            } while (nextIndex === state.currentIndex && state.texts.length > 1);
            state.currentIndex = nextIndex;
          }
        } else {
          state.currentIndex = (state.currentIndex! + 1) % state.texts.length;
        }
        scrambleTransition(state.texts[state.currentIndex!]);
      }, settings.interval);
    }
  }

  function scrambleTransition(newText: string) {
    if (state.isScrambling) return;

    const oldText = state.currentText;
    state.currentText = newText;
    state.isScrambling = true;

    // Animation timing based on scrambleTime setting
    const outTime = settings.scrambleTime || 15; // Use actual scrambleTime value
    const inTime = settings.scrambleTime || 15;  // Use actual scrambleTime value

    // Phase 1: Scramble out
    let position = 0;
    let phase = "out";

    // Clear any existing timeout
    if (state.timeoutId) clearTimeout(state.timeoutId);

    const animate = () => {
      if (phase === "out") {
        // Scramble out the old text
        if (position >= oldText.length) {
          // When completely scrambled out, show empty text before starting phase in
          state.displayedText = "";
          node.textContent = state.displayedText;
          phase = "in";
          position = 0;

          // Small delay before starting to show the new text
          state.timeoutId = setTimeout(animate, 80);
          return;
        }

        // Scramble and remove characters one by one
        const scrambled = oldText
          .split("")
          .map((char, index) => {
            // Characters before current position remain unchanged
            if (index < oldText.length - position - 1) {
              return char;
            }
            // Current character gets scrambled
            else if (index === oldText.length - position - 1) {
              const randomCharIndex = Math.floor(Math.random() * settings.characters!.length);
              return settings.characters![randomCharIndex];
            }
            // Characters after current position are removed
            else {
              return "";
            }
          })
          .join("");

        state.displayedText = scrambled;
        node.textContent = state.displayedText;
        position++;

        // Schedule next frame
        state.timeoutId = setTimeout(animate, outTime);
      } else {
        // Scramble in the new text
        if (position > newText.length) {
          // Animation complete
          state.displayedText = newText;
          node.textContent = state.displayedText;
          state.isScrambling = false;
          
          if (settings.onComplete) {
            settings.onComplete();
          }
          
          return;
        }

        // Build up the new text character by character
        const scrambled = newText
          .split("")
          .map((char, index) => {
            // Characters before current position are shown
            if (index < position) {
              return char;
            }
            // Current character gets scrambled
            else if (index === position) {
              const randomCharIndex = Math.floor(Math.random() * settings.characters!.length);
              return settings.characters![randomCharIndex];
            }
            // Characters after current position are hidden
            else {
              return "";
            }
          })
          .join("");

        state.displayedText = scrambled;
        node.textContent = state.displayedText;
        position++;

        // Schedule next frame
        state.timeoutId = setTimeout(animate, inTime);
      }
    };

    // Start animation
    animate();
  }

  // Update with new options
  function update(newOptions: ScrambleOptions) {
    const oldSettings = { ...settings };
    Object.assign(settings, newOptions);

    // Handle texts changes
    if (newOptions.texts && 
        (newOptions.texts !== oldSettings.texts || 
         newOptions.currentIndex !== oldSettings.currentIndex)) {
      state.texts = newOptions.texts;
      
      // Update current index if provided or necessary
      if (newOptions.currentIndex !== undefined) {
        state.currentIndex = newOptions.currentIndex;
      } else if (state.currentIndex >= state.texts.length) {
        state.currentIndex = 0;
      }
      
      // Update displayed text
      if (!state.isScrambling) {
        scrambleTransition(state.texts[state.currentIndex]);
      }
    }

    // Reset interval if interval time changed
    if (newOptions.interval !== oldSettings.interval && state.intervalId) {
      clearInterval(state.intervalId);
      
      if (settings.interval && state.texts.length > 1) {
        state.intervalId = setInterval(() => {
          if (settings.randomize) {
            // Get random index different from current one
            let nextIndex;
            if (state.texts.length > 1) {
              do {
                nextIndex = Math.floor(Math.random() * state.texts.length);
              } while (nextIndex === state.currentIndex && state.texts.length > 1);
              state.currentIndex = nextIndex;
            }
          } else {
            state.currentIndex = (state.currentIndex + 1) % state.texts.length;
          }
          scrambleTransition(state.texts[state.currentIndex]);
        }, settings.interval);
      }
    }
  }

  // Clean up
  function destroy() {
    if (state.timeoutId) clearTimeout(state.timeoutId);
    if (state.intervalId) clearInterval(state.intervalId);
  }

  return {
    update,
    destroy
  };
}; 