import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Experience.css';

const experiences = [
  {
    id: 1,
    role: "AI Engineering Intern",
    company: "TechNova Solutions",
    period: "2023 - Present",
    description: "Developed and deployed LLM-powered automation workflows. Integrated fine-tuned NLP models to streamline internal operations, reducing manual processing time by 40%.",
    color: "var(--color-accent-1)"
  },
  {
    id: 2,
    role: "Software Engineering Intern",
    company: "DataSphere Inc.",
    period: "Summer 2023",
    description: "Built full-stack analytics dashboards using React and Node.js. Architected RESTful APIs and optimized SQL database queries for high-volume data retrieval.",
    color: "var(--color-accent-2)"
  },
  {
    id: 3,
    role: "Freelance Full-Stack Developer",
    company: "Independent",
    period: "2022 - 2023",
    description: "Designed and engineered bespoke web applications for diverse clients. Focused on responsive design, performance optimization, and seamless user experiences.",
    color: "var(--color-text-secondary)"
  }
];

function ExperienceCard({ exp, index, progress }) {
  const isEven = index % 2 === 0;
  
  // Spatial movement based on scroll progress
  const y = useTransform(progress, [0, 1], [50, -50]);
  const opacity = useTransform(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(progress, [0, 0.5, 1], [0.95, 1, 0.95]);
  
  // Create a depth effect by adjusting z-index implicitly through scale and slight parallax
  const xOffset = isEven ? -30 : 30;
  const x = useTransform(progress, [0, 1], [xOffset, -xOffset]);

  return (
    <motion.div 
      className={`exp-card glass-panel ${isEven ? 'left' : 'right'}`}
      style={{ y, opacity, scale, x }}
      whileHover={{ scale: 1.02, y: -10 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
    >
      <div className="exp-indicator" style={{ backgroundColor: exp.color }} />
      <div className="exp-content">
        <h3 className="exp-role">{exp.role}</h3>
        <div className="exp-meta">
          <span className="exp-company">{exp.company}</span>
          <span className="exp-period">{exp.period}</span>
        </div>
        <p className="exp-desc">{exp.description}</p>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} className="experience-section">
      <div className="experience-container">
        <h2 className="section-title">Experience</h2>
        <div className="timeline-line" />
        <div className="experience-list">
          {experiences.map((exp, index) => (
            <ExperienceCard 
              key={exp.id} 
              exp={exp} 
              index={index} 
              progress={scrollYProgress} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
