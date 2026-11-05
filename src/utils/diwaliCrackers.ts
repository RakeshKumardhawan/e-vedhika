import confetti from "canvas-confetti";

/**
 * Triggers a vibrant Diwali Crackers / Fireworks burst effect.
 * Can take an optional MouseEvent or touch position (x, y) to originate the cracker explosion directly from the Like button!
 */
export function triggerDiwaliCrackers(e?: React.MouseEvent | MouseEvent | { clientX?: number; clientY?: number }) {
  let originX = 0.5;
  let originY = 0.6;

  if (e && typeof e.clientX === "number" && typeof e.clientY === "number") {
    originX = e.clientX / window.innerWidth;
    originY = e.clientY / window.innerHeight;
  }

  const diwaliColors = ["#f59e0b", "#ef4444", "#10b981", "#3b82f6", "#8b5cf6", "#f43f5e", "#facc15"];

  // Primary Explosive Cracker Burst
  confetti({
    particleCount: 70,
    spread: 360,
    startVelocity: 35,
    origin: { x: Math.max(0.05, Math.min(0.95, originX)), y: Math.max(0.05, Math.min(0.95, originY)) },
    colors: diwaliColors,
    shapes: ["star", "circle"],
    scalar: 1.1,
    zIndex: 99999,
  });

  // Sparkler Fountain
  confetti({
    particleCount: 40,
    angle: 90,
    spread: 60,
    startVelocity: 45,
    origin: { x: Math.max(0.05, Math.min(0.95, originX)), y: Math.max(0.05, Math.min(0.95, originY)) },
    colors: ["#ffd700", "#ff4500", "#ffffff"],
    zIndex: 99999,
    shapes: ["star"],
    scalar: 1.3,
  });

  // Secondary Delayed Celebration Sky Burst
  setTimeout(() => {
    confetti({
      particleCount: 35,
      angle: 60,
      spread: 80,
      origin: { x: Math.max(0.05, originX - 0.1), y: Math.max(0.1, originY - 0.08) },
      colors: ["#f59e0b", "#ec4899", "#10b981"],
      zIndex: 99999,
      shapes: ["star"],
    });

    confetti({
      particleCount: 35,
      angle: 120,
      spread: 80,
      origin: { x: Math.min(0.95, originX + 0.1), y: Math.max(0.1, originY - 0.08) },
      colors: ["#f59e0b", "#3b82f6", "#8b5cf6"],
      zIndex: 99999,
      shapes: ["star"],
    });
  }, 120);
}
