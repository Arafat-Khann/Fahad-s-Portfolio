import { useEffect, useRef } from 'react';

/**
 * Horizontal trackpad / mouse-wheel scrolling on a container.
 * onDelta(dx): positive = scroll content right, negative = scroll left.
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

      // Shift + vertical wheel → treat as horizontal
      if (e.shiftKey && Math.abs(dy) > Math.abs(dx)) {
        dx = dy;
        dy = 0;
      }

      const isHorizontal =
        Math.abs(dx) > Math.abs(dy) * 0.55 && Math.abs(dx) > 0.5;

      if (!isHorizontal) return;

      const rect = el.getBoundingClientRect();
      const pointerInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      const inView = rect.top < window.innerHeight && rect.bottom > 0;

      if (!inView || !pointerInside) return;

      e.preventDefault();
      onDeltaRef.current(dx, e);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [containerRef, enabled]);
}

/**
 * Step a carousel index when accumulated horizontal wheel delta crosses a threshold.
 */
export function useHorizontalWheelSteps(
  containerRef,
  {
    onStepLeft,
    onStepRight,
    threshold = 60,
    sensitivity = 1,
    enabled = true,
  } = {}
) {
  const accumRef = useRef(0);
  const leftRef = useRef(onStepLeft);
  const rightRef = useRef(onStepRight);
  leftRef.current = onStepLeft;
  rightRef.current = onStepRight;

  useHorizontalWheel(
    containerRef,
    (dx) => {
      accumRef.current += dx * sensitivity;
      if (accumRef.current >= threshold) {
        accumRef.current = 0;
        rightRef.current?.();
      } else if (accumRef.current <= -threshold) {
        accumRef.current = 0;
        leftRef.current?.();
      }
    },
    enabled
  );
}
