import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import './Projects.css';

const projects = [
  {
    id: 1,
    title: "AI Resume Analyzer",
    category: "Machine Learning / NLP",
    description: "An intelligent system that scores resumes against job descriptions using fine-tuned NLP models, providing actionable feedback.",
    tech: ["Python", "Transformers", "FastAPI", "React"]
  },
  {
    id: 2,
    title: "Smart Productivity System",
    category: "Full-Stack AI",
    description: "AI-assisted task planning application that auto-categorizes and prioritizes daily workloads based on historical context.",
    tech: ["TypeScript", "Next.js", "OpenAI API", "PostgreSQL"]
  },
  {
    id: 3,
    title: "Analytics Dashboard",
    category: "Data Visualization",
    description: "High-performance dashboard rendering complex datasets with custom WebGL visualizations and real-time WebSocket updates.",
    tech: ["React", "Three.js", "Node.js", "Redis"]
  },
  {
    id: 4,
    title: "Automated Support Bot",
    category: "Conversational AI",
    description: "A context-aware support chatbot deployed across multiple messaging platforms, resolving 60% of Tier 1 queries automatically.",
    tech: ["Python", "LangChain", "Vector DB", "Docker"]
  }
];

export default function Projects() {
  const targetRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const [xRange, setXRange] = useState([0, -1000]); // Default fallback
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  useEffect(() => {
    const updateScrollRange = () => {
      if (scrollAreaRef.current) {
        const scrollWidth = scrollAreaRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        // Calculate the maximum leftward scroll needed to reach the end
        // Add a bit of padding so it centers nicely
        const maxScroll = -(scrollWidth - viewportWidth);
        setXRange([viewportWidth * 0.05, maxScroll - (viewportWidth * 0.05)]);
      }
    };

    updateScrollRange();
    window.addEventListener("resize", updateScrollRange);
    return () => window.removeEventListener("resize", updateScrollRange);
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], xRange);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    const handler = (v) => {
      let closest = 0;
      let best = Infinity;
      projects.forEach((_, index) => {
        const progressPoint = index / Math.max(1, projects.length - 1);
        const dist = Math.abs(v - progressPoint);
        if (dist < best) {
          best = dist;
          closest = index;
        }
      });
      setFocusedIndex(closest);
    };

    scrollYProgress.on("change", handler);
    return () => scrollYProgress.clearListeners && scrollYProgress.clearListeners();
  }, [scrollYProgress]);

  return (
    <section ref={targetRef} className="projects-container">
      <div className="projects-sticky">
        <div className="projects-header">
          <h2 className="section-title">Selected Works</h2>
        </div>
        <motion.div ref={scrollAreaRef} style={{ x }} className="projects-scroll-area">
          {projects.map((project, index) => {
            const focused = focusedIndex === index;
            const scaleVal = focused ? 1 : 0.9;
            const opacityVal = focused ? 1 : 0.45;

            return (
              <motion.div 
                key={project.id}
                className={"project-card glass-panel " + (focused ? 'focused' : '')}
                style={{ transform: `scale(${scaleVal})`, opacity: opacityVal }}
              >
                <div className="project-card-inner">
                  <div className="project-top">
                    <span className="project-category">{project.category}</span>
                    <motion.button 
                      className="project-link"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ArrowUpRight size={24} />
                    </motion.button>
                  </div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>
                  <div className="project-tech">
                    {project.tech.map(t => (
                      <span key={t} className="tech-pill">{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
