import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrollArrow from './ScrollArrow';
import './Hero.css';

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className="hero-section">
      <motion.div style={{ y, opacity }} className="hero-content">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="hero-badge"
        >
          Open to Work
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="hero-title"
        >
          Fahad.
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="hero-subtitle text-gradient"
        >
          AI and Software Engineering Intern
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="hero-description"
        >
          Bridging the gap between intelligent systems and human-centric design.
        </motion.p>

        <ScrollArrow />
      </motion.div>

      {/* Decorative background element */}
      <motion.div 
        className="hero-glow"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
      />
    </section>
  );
}
