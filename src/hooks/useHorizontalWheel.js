import { useEffect, useRef } from 'react';

/**
 * Horizontal trackpad / mouse-wheel on a container.
 * Never blocks clearly vertical scroll (fixes Lenis / page scroll jank).
 */
export function useHorizontalWheel(containerRef, onDelta, enabled = true) {
  const onDeltaRef = useRef(onDelta);
  onDeltaRef.current = onDelta;

  useEffect(() => {
    if (!enabled) return;
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      let dx = e.deltaX;
      let dy = e.deltaY;

      if (e.shiftKey && Math.abs(dy) > Math.abs(dx)) {
        dx = dy;
        dy = 0;
      }

      // Let vertical page scroll pass through — critical for smooth Lenis
      const isClearlyVertical =
        Math.abs(dy) >= Math.abs(dx) || Math.abs(dy) > 4;

      const isClearlyHorizontal =
        !isClearlyVertical &&
        Math.abs(dx) > Math.abs(dy) * 1.75 &&
        Math.abs(dx) > 14;

      if (!isClearlyHorizontal) return;

      const rect = el.getBoundingClientRect();
      const pointerInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!pointerInside) return;

      e.preventDefault();
      e.stopPropagation();
      onDeltaRef.current(dx, e);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [containerRef, enabled]);
}

export function useHorizontalWheelSteps(containerRef, options = {}) {
  const accumRef = useRef(0);
  const optsRef = useRef(options);
  optsRef.current = options;

  const leftRef = useRef(options.onStepLeft);
  const rightRef = useRef(options.onStepRight);
  leftRef.current = options.onStepLeft;
  rightRef.current = options.onStepRight;

  useHorizontalWheel(
    containerRef,
    (dx) => {
      const { threshold = 60, sensitivity = 1 } = optsRef.current;
      accumRef.current += dx * sensitivity;
      if (accumRef.current >= threshold) {
        accumRef.current = 0;
        rightRef.current?.();
      } else if (accumRef.current <= -threshold) {
        accumRef.current = 0;
        leftRef.current?.();
      }
    },
    options.enabled ?? true
  );
}
