import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { experience } from '../data/portfolioData';
import './Experience.css';

function ExperienceCard({ exp, index, progress, isActive }) {
  const isEven = index % 2 === 0;

  const y = useTransform(progress, [0, 1], [50, -50]);
  const opacity = useTransform(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(progress, [0, 0.5, 1], [0.95, 1, 0.95]);

  const xOffset = isEven ? -30 : 30;
  const x = useTransform(progress, [0, 1], [xOffset, -xOffset]);

  return (
    <motion.div
      className={`exp-card glass-panel ${isEven ? 'left' : 'right'}`}
      style={{ y, opacity, scale, x }}
      whileHover={{ scale: 1.02, y: -10 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
    >
      <div className={`exp-indicator ${isActive ? 'active' : ''}`} />
      <div className="exp-content">
        <h3 className="exp-role">{exp.role}</h3>
        <div className="exp-meta">
          <span className="exp-company">{exp.company}</span>
          <span className="exp-period">{exp.period}</span>
        </div>
        {exp.bullets && exp.bullets.length > 0 && (
          <ul className="exp-bullets">
            {exp.bullets.map((bullet, idx) => (
              <li key={idx} className="exp-bullet">{bullet}</li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      const idx = Math.min(
        experience.length - 1,
        Math.floor(v * experience.length)
      );
      setActiveIndex(idx);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <section id="experience" ref={containerRef} className="experience-section">
      <div className="experience-container">
        <h2 className="section-title">Experience</h2>
        <motion.div className="timeline-line" />
        <div className="experience-list">
          {experience.map((exp, index) => (
            <ExperienceCard
              key={exp.id}
              exp={exp}
              index={index}
              progress={scrollYProgress}
              isActive={activeIndex === index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
