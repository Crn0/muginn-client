export const hasTouchSupport = () => {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};
