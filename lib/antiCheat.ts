import type { AntiCheatEvent, AntiCheatSummary } from "./types";

/**
 * Calculate anti-cheat summary from events
 */
export const calculateAntiCheatSummary = (
  events: AntiCheatEvent[],
): AntiCheatSummary => {
  const focusSwitches = events.filter(
    (e) => e.type === "focus-lost" || e.type === "focus-regained",
  ).length;
  const pasteDetections = events.filter((e) => e.type === "paste").length;

  return {
    focusSwitches,
    pasteDetections,
    totalEvents: events.length,
  };
};

/**
 * Setup focus tracking on an element
 */
export const setupFocusTracking = (
  element: HTMLElement | null,
  onFocusLost: () => void,
  onFocusRegained: () => void,
) => {
  if (!element) return;

  const handleBlur = () => {
    onFocusLost();
  };

  const handleFocus = () => {
    onFocusRegained();
  };

  element.addEventListener("blur", handleBlur);
  element.addEventListener("focus", handleFocus);

  // Also track window blur/focus for broader detection
  const handleWindowBlur = () => {
    onFocusLost();
  };

  const handleWindowFocus = () => {
    onFocusRegained();
  };

  window.addEventListener("blur", handleWindowBlur);
  window.addEventListener("focus", handleWindowFocus);

  // Cleanup function
  return () => {
    element.removeEventListener("blur", handleBlur);
    element.removeEventListener("focus", handleFocus);
    window.removeEventListener("blur", handleWindowBlur);
    window.removeEventListener("focus", handleWindowFocus);
  };
};

/**
 * Setup window/tab focus tracking (independent of any input element).
 */
export const setupWindowFocusTracking = (
  onFocusLost: () => void,
  onFocusRegained: () => void,
) => {
  const handleWindowBlur = () => onFocusLost();
  const handleWindowFocus = () => onFocusRegained();

  window.addEventListener("blur", handleWindowBlur);
  window.addEventListener("focus", handleWindowFocus);

  return () => {
    window.removeEventListener("blur", handleWindowBlur);
    window.removeEventListener("focus", handleWindowFocus);
  };
};

/**
 * Setup paste detection on an input element
 */
export const setupPasteDetection = (
  element: HTMLElement | null,
  onPaste: () => void,
) => {
  if (!element) return;

  const handlePaste = () => {
    onPaste();
  };

  element.addEventListener("paste", handlePaste);

  // Cleanup function
  return () => {
    element.removeEventListener("paste", handlePaste);
  };
};
