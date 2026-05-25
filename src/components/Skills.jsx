import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Skills.css';

import { skills as skillsData } from '../data/portfolioData';

export default function Skills() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  // Flatten skills for display
  const allSkills = Object.values(skillsData).flat();


  return (
    <section id="skills" ref={containerRef} className="skills-section">
      <motion.div style={{ y, opacity }} className="skills-container">
        <h2 className="section-title">Core Competencies</h2>
        <div className="skills-grid">
          {allSkills.map((skill, index) => (
            <motion.div
              key={skill}
              className="skill-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              {skill}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
