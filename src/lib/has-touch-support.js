export default function hasTouchSupport() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
