import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './LeadershipCarousel.css';

const leadershipItems = [
  {
    id: 1,
    tag: 'Creative Leadership',
    title: 'Ecombranding.co',
    label: 'Agency Co-Founder',
    period: '2021 - 2024',
    imageClass: 'leadership-visual leadership-visual--one',
    description:
      'Built a creative agency focused on e-commerce branding, product imagery, and conversion-first content systems. The work blended strategy, design, and execution across a small but fast-moving team.',
    highlights: ['Brand systems', 'Product visuals', 'Landing pages', 'Creative direction'],
  },
  {
    id: 2,
    tag: 'Operational Leadership',
    title: 'Image2work',
    label: 'Pakistan Operations Lead',
    period: '2023 - 2024',
    imageClass: 'leadership-visual leadership-visual--two',
    description:
      'Scaled a regional AI operations team, coordinated annotation pipelines, and kept delivery predictable across multiple deadlines. The role demanded clear process design and calm execution at speed.',
    highlights: ['Team scaling', 'QA pipelines', 'SFTP delivery', 'Process design'],
  },
  {
    id: 3,
    tag: 'Research Leadership',
    title: 'Wayne State University',
    label: 'Graduate Research Assistant',
    period: '2025 - Present',
    imageClass: 'leadership-visual leadership-visual--three',
    description:
      'Leading research in generative AI and temporal super-resolution for breast DCE-MRI. The focus is on building reproducible methods that improve the fidelity and utility of medical imaging workflows.',
    highlights: ['Diffusion models', 'Medical imaging', 'Quantitative metrics', 'Published research'],
  },
  {
    id: 4,
    tag: 'Cross-Functional',
    title: 'Truck It In',
    label: 'CRM / Systems Lead',
    period: '2021 - 2022',
    imageClass: 'leadership-visual leadership-visual--four',
    description:
      'Implemented CRM systems during a growth phase and supported sales operations with reporting, adoption, and documentation. This was practical leadership grounded in structure and enablement.',
    highlights: ['CRM rollout', 'Dashboards', 'Team training', 'SOPs'],
  },
  {
    id: 5,
    tag: 'Design Leadership',
    title: 'Eminent Ecom',
    label: 'Lead Visual Designer',
    period: '2021 - 2022',
    imageClass: 'leadership-visual leadership-visual--five',
    description:
      'Designed brand assets and product visuals for a global e-commerce branding company. The work sharpened visual judgment, speed, and the ability to keep a consistent aesthetic across many deliverables.',
    highlights: ['Branding', 'Product visuals', '3D thinking', 'Visual systems'],
  },
  {
    id: 6,
    tag: 'Community',
    title: 'GIKI Alumni Association',
    label: 'Vice President, Merchandising',
    period: '2022 - 2023',
    imageClass: 'leadership-visual leadership-visual--six',
    description:
      'Launched a university merchandise initiative and coordinated branding, marketing, and execution with leadership stakeholders. The work centered on community building and creating something durable.',
    highlights: ['Merchandise launch', 'Brand strategy', 'Stakeholder coordination', 'Community building'],
  },
  {
    id: 7,
    tag: 'Engineering + Logistics',
    title: 'Noble AgroFood',
    label: 'Overseas Logistics Lead',
    period: '2022 - 2024',
    imageClass: 'leadership-visual leadership-visual--seven',
    description:
      'Managed imports, customs coordination, and refrigerated shipments with a focus on reliability and operational discipline. The role connected logistics planning with execution in the real world.',
    highlights: ['Import operations', 'Customs', 'Cold chain', 'Supply chain'],
  },
  {
    id: 8,
    tag: 'People Leadership',
    title: 'Team Hammerhead ARC',
    label: 'President / Volunteer Engineer',
    period: '2020 - 2021',
    imageClass: 'leadership-visual leadership-visual--eight',
    description:
      'Led coordination, volunteer engineering, and technical collaboration for a student team. It reinforced how leadership is often about alignment, clarity, and keeping momentum moving.',
    highlights: ['Team leadership', 'Volunteer engineering', 'Coordination', 'Execution'],
  },
];

export default function LeadershipCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const barRef = useRef(null);
  const tabRefs = useRef([]);
  const scrollRafRef = useRef(null);

  const maxIndex = leadershipItems.length - 1;

  const clampIndex = useCallback(
    (index) => Math.max(0, Math.min(maxIndex, index)),
    [maxIndex]
  );

  const activeItem = leadershipItems[activeIndex];

  const syncTabIntoView = useCallback((index) => {
    const tab = tabRefs.current[index];
    if (!tab) return;

    tab.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, []);

  const goTo = useCallback(
    (index) => {
      const nextIndex = clampIndex(index);
      setActiveIndex(nextIndex);
      syncTabIntoView(nextIndex);
    },
    [clampIndex, syncTabIntoView]
  );

  const onBarScroll = useCallback(() => {
    if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    scrollRafRef.current = requestAnimationFrame(() => {
      const bar = barRef.current;
      if (!bar) return;

      const barCenter = bar.scrollLeft + bar.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      tabRefs.current.forEach((tab, index) => {
        if (!tab) return;
        const tabCenter = tab.offsetLeft + tab.clientWidth / 2;
        const distance = Math.abs(tabCenter - barCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex((current) => (current === closestIndex ? current : closestIndex));
    });
  }, []);

  useEffect(() => {
    syncTabIntoView(0);
    return () => {
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    };
  }, [syncTabIntoView]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowLeft') goTo(activeIndex - 1);
      if (event.key === 'ArrowRight') goTo(activeIndex + 1);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, goTo]);

  return (
    <section id="leadership" className="leadership-section" aria-label="Leadership Activities">
      <div className="leadership-wrap">
        <div className="leadership-header">
          <p className="leadership-kicker">Leadership Activities</p>
        </div>

        <motion.div
          className="leadership-media-shell"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              className={activeItem.imageClass}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="leadership-visual-card">
                <div className="leadership-visual-topline">
                  <span>{activeItem.tag}</span>
                  <span>{activeItem.period}</span>
                </div>
                <div className="leadership-visual-title">{activeItem.title}</div>
                <div className="leadership-visual-label">{activeItem.label}</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="leadership-bar-shell" aria-label="Leadership tabs and navigation">
          <button
            type="button"
            className="leadership-arrow"
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous leadership item"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="leadership-bar" ref={barRef} onScroll={onBarScroll} role="tablist" aria-label="Leadership options">
            {leadershipItems.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={item.id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`leadership-tab ${isActive ? 'is-active' : ''}`}
                  onClick={() => goTo(index)}
                >
                  <span className="leadership-tab-label">{item.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="leadership-arrow"
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === maxIndex}
            aria-label="Next leadership item"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            className="leadership-copy-box"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="leadership-copy-meta">
              <div>
                <div className="leadership-copy-kicker">{activeItem.tag}</div>
                <div className="leadership-copy-subtitle">{activeItem.period}</div>
              </div>
              <div className="leadership-copy-subtitle">Demo leadership data</div>
            </div>

            <h3 className="leadership-copy-title">{activeItem.title}</h3>
            <p className="leadership-copy-description">{activeItem.description}</p>

            <div className="leadership-copy-highlights" aria-label="Leadership highlights">
              {activeItem.highlights.map((highlight) => (
                <span key={highlight} className="leadership-highlight-pill">
                  {highlight}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
