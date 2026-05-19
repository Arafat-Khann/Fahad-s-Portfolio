/** Trackpad step tuning per viewport class */
export function getLeadershipWheelConfig(width = window.innerWidth) {
  if (width < 480) return { threshold: 92, sensitivity: 0.54 };
  if (width < 768) return { threshold: 102, sensitivity: 0.52 };
  if (width < 1024) return { threshold: 108, sensitivity: 0.5 };
  if (width < 1440) return { threshold: 115, sensitivity: 0.5 };
  if (width < 1920) return { threshold: 122, sensitivity: 0.48 };
  return { threshold: 128, sensitivity: 0.46 };
}
