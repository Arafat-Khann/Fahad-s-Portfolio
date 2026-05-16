import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY, isVisible]);

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x: cursorXSpring,
        y: cursorYSpring,
        width: 32,
        height: 32,
        borderRadius: '50%',
        backgroundColor: 'rgba(150, 150, 150, 0.4)',
        border: '1px solid #888888',
        boxShadow: '0 0 20px rgba(136, 136, 136, 0.25)',
        pointerEvents: 'none',
        zIndex: 99999,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ opacity: { duration: 0.2 } }}
    />
  );
}
