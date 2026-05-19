import { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectModal from './ProjectModal';
import './Projects.css';

const projects = [
  {
    id: 1,
    title: "AI Resume Analyzer",
    category: "Machine Learning / NLP",
    description: "An intelligent system that scores resumes against job descriptions using fine-tuned NLP models, providing actionable feedback.",
    tech: ["Python", "Transformers", "FastAPI", "React"],
    highlights: [
      "Fine-tuned transformer models for semantic resume matching",
      "Reduced manual screening time by 40% in pilot deployments",
      "REST API with React dashboard for recruiter workflows"
    ],
    liveUrl: "#",
    githubUrl: "#",
    image: null,
  },
  {
    id: 2,
    title: "Smart Productivity System",
    category: "Full-Stack AI",
    description: "AI-assisted task planning application that auto-categorizes and prioritizes daily workloads based on historical context.",
    tech: ["TypeScript", "Next.js", "OpenAI API", "PostgreSQL"],
    highlights: [
      "Context-aware prioritization using LLM embeddings",
      "Real-time sync across devices with PostgreSQL",
      "Modular Next.js architecture for rapid iteration"
    ],
    liveUrl: "#",
    githubUrl: "#",
    image: null,
  },
  {
    id: 3,
    title: "Analytics Dashboard",
    category: "Data Visualization",
    description: "High-performance dashboard rendering complex datasets with custom WebGL visualizations and real-time WebSocket updates.",
    tech: ["React", "Three.js", "Node.js", "Redis"],
    highlights: [
      "WebGL-powered charts for million-row datasets",
      "WebSocket pipeline for sub-second data refresh",
      "Redis caching layer for query optimization"
    ],
    liveUrl: "#",
    githubUrl: "#",
    image: null,
  },
  {
    id: 4,
    title: "Automated Support Bot",
    category: "Conversational AI",
    description: "A context-aware support chatbot deployed across multiple messaging platforms, resolving 60% of Tier 1 queries automatically.",
    tech: ["Python", "LangChain", "Vector DB", "Docker"],
    highlights: [
      "RAG pipeline with vector search over knowledge base",
      "Multi-channel deployment via Docker containers",
      "60% Tier-1 query resolution without human handoff"
    ],
    liveUrl: "#",
    githubUrl: "#",
    image: null,
  }
];

export default function Projects() {
  const viewportRef = useRef(null);
  const cardRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [originRect, setOriginRect] = useState(null);
  const rafRef = useRef(null);

  const updateFocusedCard = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(viewportCenter - cardCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setFocusedIndex(closestIndex);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateFocusedCard);
    };

    updateFocusedCard();
    viewport.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateFocusedCard);

    return () => {
      viewport.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateFocusedCard);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateFocusedCard]);

  const openModal = (project, e) => {
    const card = e.currentTarget.closest('.project-card');
    if (card) {
      setOriginRect(card.getBoundingClientRect());
    }
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setOriginRect(null);
  };

  const scrollToCard = useCallback((direction) => {
    const nextIndex = Math.max(
      0,
      Math.min(projects.length - 1, focusedIndex + direction),
    );

    cardRefs.current[nextIndex]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [focusedIndex]);

  return (
    <section id="projects" className="projects-section">
      <div className="projects-inner">
        <div className="projects-header">
          <h2 className="section-title">Selected Works</h2>
        </div>

        <div
          ref={viewportRef}
          className="projects-scroll-viewport"
          aria-label="Selected works carousel"
        >
          <div className="projects-scroll-track">
            <div className="projects-scroll-spacer" aria-hidden="true" />
            {projects.map((project, index) => {
              const focused = focusedIndex === index;
              return (
                <article
                  key={project.id}
                  ref={(el) => { cardRefs.current[index] = el; }}
                  className={`project-card ${focused ? 'focused' : 'inactive'}`}
                  onClick={(e) => openModal(project, e)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openModal(project, e);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${project.title}`}
                  aria-current={focused ? 'true' : undefined}
                >
                  <div className="project-card-inner">
                    <div className="project-top">
                      <span className="project-category">{project.category}</span>
                      <button
                        type="button"
                        className="project-link"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(project, e);
                        }}
                        aria-label={`Open ${project.title}`}
                      >
                        <ArrowUpRight size={20} />
                      </button>
                    </div>
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-desc">{project.description}</p>
                    <div className="project-tech">
                      {project.tech.map((t) => (
                        <span key={t} className="tech-pill">{t}</span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
            <div className="projects-scroll-spacer" aria-hidden="true" />
          </div>
        </div>

        <div className="projects-nav" aria-label="Selected works navigation">
          <button
            type="button"
            className="projects-nav-button"
            onClick={() => scrollToCard(-1)}
            aria-label="Previous project"
            disabled={focusedIndex === 0}
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            className="projects-nav-button"
            onClick={() => scrollToCard(1)}
            aria-label="Next project"
            disabled={focusedIndex === projects.length - 1}
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          originRect={originRect}
          onClose={closeModal}
        />
      )}
    </section>
  );
}
