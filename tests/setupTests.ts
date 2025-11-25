import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock media element methods used by components to avoid unhandled promise rejections.
if (typeof globalThis.HTMLMediaElement !== "undefined") {
  Object.defineProperty(globalThis.HTMLMediaElement.prototype, "play", {
    configurable: true,
    value: vi.fn().mockResolvedValue(undefined),
  });

  Object.defineProperty(globalThis.HTMLMediaElement.prototype, "pause", {
    configurable: true,
    value: vi.fn(),
  });
}

// Some components call scrollIntoView; provide a noop for test environment.
if (
  typeof Element !== "undefined" &&
  !Element.prototype.scrollIntoView
) {
  Element.prototype.scrollIntoView = vi.fn();
}

// Radix UI relies on ResizeObserver; provide a light mock for jsdom.
if (typeof globalThis !== "undefined" && !("ResizeObserver" in globalThis)) {
  class ResizeObserverMock implements ResizeObserver {
    callback: ResizeObserverCallback;

    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
    }

    observe(): void {
      // No layout to observe in tests, but keep interface intact.
    }

    unobserve(): void {}

    disconnect(): void {}

    // Trigger the callback manually when needed in tests.
    public trigger(entries: ResizeObserverEntry[]): void {
      this.callback(entries, this);
    }
  }

  (globalThis as typeof globalThis & { ResizeObserver: typeof ResizeObserverMock }).ResizeObserver =
    ResizeObserverMock;
}

