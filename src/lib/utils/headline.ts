import type { Action } from 'svelte/action';

interface HeadlineParams {
  maxLines?: number;
  minFontSize?: number;
  maxFontSize?: number;
  lineHeight?: number;
  transitionDuration?: number;
}

export const headline: Action<HTMLElement, HeadlineParams | undefined> = (node: HTMLElement, params:HeadlineParams = {}) => {
  let measureEl: HTMLElement | null = null;
  let currentFontSize = params.minFontSize ?? 16;
  let rafId: number;
  let debounceTimeout: number;

  const defaultParams: Required<HeadlineParams> = {
    maxLines: 1,
    minFontSize: 16,
    maxFontSize: 140,
    lineHeight: 1.2,
    transitionDuration: 300
  };

  function createMeasureElement() {
    if (measureEl) return;
    
    measureEl = document.createElement(node.tagName);
    measureEl.textContent = node.textContent;
    measureEl.style.cssText = `
      position: fixed;
      left: -9999px;
      top: -9999px;
      margin: 0;
      padding: 0;
      word-wrap: break-word;
      overflow-wrap: break-word;
      font-size: ${currentFontSize}px;
      line-height: ${defaultParams.lineHeight};
      visibility: hidden;
    `;
    document.body.appendChild(measureEl);
  } 

  function removeMeasureElement() {
    if (measureEl) {
      document.body.removeChild(measureEl);
      measureEl = null;
    }
  }

  function debounce(fn: () => void, delay: number) {
    clearTimeout(debounceTimeout);
    debounceTimeout = window.setTimeout(fn, delay);
  }

  function calculateFontSize() {
    if (!document.body.contains(node)) return;

    const mergedParams = { ...defaultParams, ...params };
    const { maxLines, minFontSize, maxFontSize, lineHeight } = mergedParams;

    createMeasureElement();
    cancelAnimationFrame(rafId);
    
    rafId = requestAnimationFrame(() => {
      if (!measureEl) return;
      
      try {
        const computedStyle = globalThis.getComputedStyle(node);
        const nodeWidth = node.getBoundingClientRect().width;
        
        Object.assign(measureEl.style, {
          width: `${nodeWidth}px`,
          maxWidth: computedStyle.maxWidth,
          padding: computedStyle.padding,
          boxSizing: computedStyle.boxSizing
        });

        let low = minFontSize;
        let high = maxFontSize;
        let bestSize = minFontSize;

        const measureLines = () => {
          if (!measureEl) return 0;
          const range = document.createRange();
          range.selectNodeContents(measureEl);
          return Array.from(range.getClientRects()).length;
        };

      // Binary search for optimal font size
        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          if (!measureEl) break;
          
          measureEl.style.fontSize = `${mid}px`;
          measureEl.style.lineHeight = String(lineHeight);

          const lines = measureLines();
          
          if (lines <= maxLines) {
            // Only update bestSize if we're sure this is optimal
            measureEl.style.fontSize = `${mid + 1}px`;
            const nextLines = measureLines();
            if (nextLines > maxLines) {
              // Current size is optimal - it fits and next size doesn't
              bestSize = mid -1;
              break;
            }
            // Current size works but might not be optimal yet
            bestSize = mid;
            low = mid + 1; // Need 1px padding on larger viewports for some reason.
          } else {
            // Too many lines, try smaller size
            high = mid - 1;
          }
        }

        currentFontSize = bestSize;
        Object.assign(node.style, {
          fontSize: `${currentFontSize}px`,
          lineHeight: String(lineHeight),
          opacity: '1'
        });
      } catch (error) {
        console.error('Error calculating font size:', error);
      } finally {
        removeMeasureElement();
      }
    });
  }

  // Initial setup
  Object.assign(node.style, {
    margin: '0',
    padding: '0',
    width: '100%',
    overflowWrap: 'break-word',
    transition: `all ${defaultParams.transitionDuration}ms ease-out`,
    opacity: '0',
    fontSize: `${currentFontSize}px`,
    lineHeight: String(defaultParams.lineHeight)
  });

  const resizeObserver = new ResizeObserver(() => {
    debounce(calculateFontSize, 100);
  });

  resizeObserver.observe(node);
  if (node.parentElement) {
    resizeObserver.observe(node.parentElement);
  }

  calculateFontSize();

  return {
    update(newParams: HeadlineParams = {}) {
      params = newParams;
      calculateFontSize();
    },
    destroy() {
      removeMeasureElement();
      resizeObserver.disconnect();
      clearTimeout(debounceTimeout);
      cancelAnimationFrame(rafId);
    }
  };
};
