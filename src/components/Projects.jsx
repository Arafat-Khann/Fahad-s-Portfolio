import { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectModal from './ProjectModal';
import './Projects.css';

import { projects } from '../data/portfolioData';

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
                      <span className="project-category">{project.type}</span>
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
