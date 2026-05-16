import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink } from 'lucide-react';
import './ProjectModal.css';

function GitHubIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A8.205 8.205 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function ProjectModal({ project, originRect, onClose }) {
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef(null);
  const contentRef = useRef(null);
  const backdropRef = useRef(null);

  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(() => onClose?.(), 420);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'Tab' && contentRef.current) {
        const focusable = [...contentRef.current.querySelectorAll(FOCUSABLE)];
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => setOpen(true));
    const focusTimer = setTimeout(() => closeBtnRef.current?.focus(), 50);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      clearTimeout(focusTimer);
    };
  }, [handleClose]);

  const originStyle = {};
  if (originRect) {
    const ox = originRect.left + originRect.width / 2;
    const oy = originRect.top + originRect.height / 2;
    originStyle.transformOrigin = `${ox}px ${oy}px`;
  }

  const highlights = project.highlights ?? [
    'Delivered end-to-end solution with measurable impact',
    'Collaborated across design and engineering teams',
    'Optimized performance and user experience',
  ];

  return createPortal(
    <div
      ref={backdropRef}
      className={`pm-backdrop ${open ? 'open' : ''}`}
      onMouseDown={(e) => {
        if (e.target === backdropRef.current) handleClose();
      }}
      aria-hidden={!open}
    >
      <div
        className={`pm-content ${open ? 'open' : ''}`}
        style={originStyle}
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pm-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="pm-close"
          onClick={handleClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="pm-hero" aria-hidden="true">
          {project.image ? (
            <img src={project.image} alt="" className="pm-hero-img" loading="lazy" />
          ) : (
            <div className="pm-hero-placeholder" />
          )}
        </div>

        <div className="pm-body">
          <h2 id="pm-title" className="pm-title">{project.title}</h2>
          <p className="pm-desc">{project.description}</p>

          <div className="pm-tech">
            {project.tech.map((t) => (
              <span key={t} className="pm-tech-pill">{t}</span>
            ))}
          </div>

          <ul className="pm-highlights">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="pm-actions">
            <a
              href={project.liveUrl ?? '#'}
              className="pm-btn pm-btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Live Demo
              <ExternalLink size={16} aria-hidden="true" />
            </a>
            <a
              href={project.githubUrl ?? '#'}
              className="pm-btn pm-btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
              <GitHubIcon size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
