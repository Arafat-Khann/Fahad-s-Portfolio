import { useRef, useState, useCallback, useEffect } from 'react';
import { useHorizontalWheelSteps } from '../hooks/useHorizontalWheel';
import './LeadershipCarousel.css';

const items = [
  {
    id: 1,
    tag: 'Leadership',
    titleLine1: 'Tech Club',
    titleLine2: 'President',
    caption: 'Built a 40+ member engineering community on campus.',
    bottomTitle: 'Tech Club President',
    bottomDesc: 'Community · Mentorship · Events',
    cta: 'Learn more',
    bottomCta: 'View role',
    gradient: 'linear-gradient(165deg, #1a1a2e 0%, #4a2c5a 45%, #9b4d6a 100%)',
    miniGradient: 'linear-gradient(135deg, #0f2847 0%, #1e5f8a 55%, #3d8fb8 100%)',
  },
  {
    id: 2,
    tag: 'Events',
    titleLine1: 'Hackathon',
    titleLine2: 'Organizer',
    caption: 'Coordinated three campus-wide innovation weekends.',
    bottomTitle: 'Hackathon Lead',
    bottomDesc: 'Logistics · Sponsors · Judging',
    cta: 'Learn more',
    bottomCta: 'View role',
    gradient: 'linear-gradient(165deg, #0d2137 0%, #1a4a6e 50%, #2d7ab5 100%)',
    miniGradient: 'linear-gradient(135deg, #2d1f3d 0%, #5c3d6e 100%)',
  },
  {
    id: 3,
    tag: 'Mentorship',
    titleLine1: 'Developer',
    titleLine2: 'Mentor',
    caption: 'Guided junior developers through agile project sprints.',
    bottomTitle: 'Mentorship Lead',
    bottomDesc: 'Code reviews · Pairing · Workshops',
    cta: 'Learn more',
    bottomCta: 'View role',
    gradient: 'linear-gradient(165deg, #1c2e1a 0%, #3d5c34 45%, #6b8f4e 100%)',
    miniGradient: 'linear-gradient(135deg, #3d2b1f 0%, #8b5a3c 100%)',
  },
  {
    id: 4,
    tag: 'Education',
    titleLine1: 'AI Workshop',
    titleLine2: 'Facilitator',
    caption: 'Hosted hands-on LLM workshops for student peers.',
    bottomTitle: 'AI Workshops',
    bottomDesc: 'LLMs · Prompting · Demos',
    cta: 'Learn more',
    bottomCta: 'View role',
    gradient: 'linear-gradient(165deg, #1a1030 0%, #3d2a6e 50%, #7b5cbf 100%)',
    miniGradient: 'linear-gradient(135deg, #1a3040 0%, #2a6b7a 100%)',
  },
  {
    id: 5,
    tag: 'Open Source',
    titleLine1: 'Community',
    titleLine2: 'Contributor',
    caption: 'Maintained tooling repos used by student developers.',
    bottomTitle: 'Open Source',
    bottomDesc: 'Docs · PRs · Releases',
    cta: 'Learn more',
    bottomCta: 'View role',
    gradient: 'linear-gradient(165deg, #1f1f1f 0%, #3d3d3d 50%, #5c5c5c 100%)',
    miniGradient: 'linear-gradient(135deg, #2a1f3d 0%, #5a4080 100%)',
  },
  {
    id: 6,
    tag: 'Campus',
    titleLine1: 'Student Council',
    titleLine2: 'Representative',
    caption: 'Bridged student feedback with faculty initiatives.',
    bottomTitle: 'Student Council',
    bottomDesc: 'Advocacy · Policy · Forums',
    cta: 'Learn more',
    bottomCta: 'View role',
    gradient: 'linear-gradient(165deg, #3d1f1f 0%, #8b3d3d 55%, #c96a5a 100%)',
    miniGradient: 'linear-gradient(135deg, #1f3d2e 0%, #3d7a5c 100%)',
  },
  {
    id: 7,
    tag: 'Product',
    titleLine1: 'Design Sprint',
    titleLine2: 'Lead',
    caption: 'Facilitated cross-functional product ideation sessions.',
    bottomTitle: 'Design Sprints',
    bottomDesc: 'UX · Prototyping · Research',
    cta: 'Learn more',
    bottomCta: 'View role',
    gradient: 'linear-gradient(165deg, #2a1a0a 0%, #6b4520 50%, #c4923d 100%)',
    miniGradient: 'linear-gradient(135deg, #1a2a4a 0%, #3d5a9b 100%)',
  },
  {
    id: 8,
    tag: 'Outreach',
    titleLine1: 'Volunteer',
    titleLine2: 'Coordinator',
    caption: 'Organized mentorship and community outreach programs.',
    bottomTitle: 'Volunteer Lead',
    bottomDesc: 'Outreach · Scheduling · Partners',
    cta: 'Learn more',
    bottomCta: 'View role',
    gradient: 'linear-gradient(165deg, #0a1f2a 0%, #1a4a5c 50%, #3d8a9b 100%)',
    miniGradient: 'linear-gradient(135deg, #4a2a1a 0%, #9b6a3d 100%)',
  },
];

export default function LeadershipCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [metrics, setMetrics] = useState({
    heroW: 280,
    heroGap: 10,
    miniW: 240,
    miniGap: 10,
  });

  const wrapperRef = useRef(null);
  const heroTrackRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartIndex = useRef(0);

  const maxIndex = items.length - 1;

  const clampIndex = useCallback(
    (i) => Math.max(0, Math.min(maxIndex, i)),
    [maxIndex]
  );

  const goTo = (index) => setActiveIndex(clampIndex(index));

  const measure = useCallback(() => {
    const heroCard = heroTrackRef.current?.querySelector('.lead-hero-card');
    const miniCard = heroTrackRef.current
      ?.closest('.leadership-section')
      ?.querySelector('.lead-mini-card');

    if (!heroCard) return;

    const heroStyle = getComputedStyle(heroCard);
    const heroW = heroCard.offsetWidth;
    const heroGap = parseFloat(heroStyle.marginRight) || 12;

    let miniW = 340;
    let miniGap = 12;
    if (miniCard) {
      const miniStyle = getComputedStyle(miniCard);
      miniW = miniCard.offsetWidth;
      miniGap = parseFloat(miniStyle.marginRight) || 12;
    }

    const newMetrics = { heroW, heroGap, miniW, miniGap };
    const prev = measure.metricsRef || metrics;
    if (
      prev.heroW !== newMetrics.heroW ||
      prev.heroGap !== newMetrics.heroGap ||
      prev.miniW !== newMetrics.miniW ||
      prev.miniGap !== newMetrics.miniGap
    ) {
      measure.metricsRef = newMetrics;
      setMetrics(newMetrics);
    }
  }, []);

  useEffect(() => {
    let rafId = null;
    const scheduled = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => measure());
    };

    scheduled();
    window.addEventListener('resize', scheduled);
    const ro = new ResizeObserver(scheduled);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => {
      window.removeEventListener('resize', scheduled);
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [measure]);

  const heroOffset = activeIndex * (metrics.heroW + metrics.heroGap);
  const miniOffset = activeIndex * (metrics.miniW + metrics.miniGap);

  const handlePointerDown = (e) => {
    if (e.button !== 0 || e.target.closest('button')) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartIndex.current = activeIndex;
    wrapperRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const delta = dragStartX.current - e.clientX;
    const threshold = metrics.heroW * 0.28;
    const steps = Math.round(delta / threshold);
    setActiveIndex(clampIndex(dragStartIndex.current + steps));
  };

  const handlePointerUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    wrapperRef.current?.releasePointerCapture(e.pointerId);
  };

  useHorizontalWheelSteps(wrapperRef, {
    onStepLeft: () => setActiveIndex((i) => clampIndex(i - 1)),
    onStepRight: () => setActiveIndex((i) => clampIndex(i + 1)),
    threshold: 160,
    sensitivity: 0.35,
  });

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') setActiveIndex((i) => clampIndex(i - 1));
      if (e.key === 'ArrowRight') setActiveIndex((i) => clampIndex(i + 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [clampIndex]);

  return (
    <section id="leadership" className="leadership-section" aria-label="Leadership Activities">
      <div className="leadership-header">
        <h2 className="leadership-title">Leadership Activities.</h2>
      </div>

      <div
        className="leadership-stage"
        ref={wrapperRef}
        data-lenis-prevent
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Top row — large hero cards */}
        <div className="lead-row lead-row-hero">
          <div
            ref={heroTrackRef}
            className="lead-track lead-track-hero"
            style={{
              transform: `translate3d(-${heroOffset}px, 0, 0)`,
            }}
          >
            {items.map((item, index) => (
              <article
                key={item.id}
                className={`lead-hero-card ${index === activeIndex ? 'is-active' : ''}`}
              >
                <div
                  className="lead-hero-media"
                  style={{ background: item.gradient }}
                  aria-hidden="true"
                />
                <div className="lead-hero-scrim" aria-hidden="true" />
                <span className="lead-hero-tag">{item.tag}</span>
                <div className="lead-hero-titles">
                  <span className="lead-hero-line1">{item.titleLine1}</span>
                  <span className="lead-hero-line2">{item.titleLine2}</span>
                </div>
                <div className="lead-hero-footer">
                  <button type="button" className="lead-pill-cta">
                    {item.cta}
                  </button>
                  <p className="lead-hero-caption">{item.caption}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Bottom row — compact cards */}
        <div className="lead-row lead-row-mini">
          <div
            className="lead-track lead-track-mini"
            style={{
              transform: `translate3d(-${miniOffset}px, 0, 0)`,
            }}
          >
            {items.map((item, index) => (
              <article
                key={`mini-${item.id}`}
                className={`lead-mini-card ${index === activeIndex ? 'is-active' : ''}`}
              >
                <div
                  className="lead-mini-media"
                  style={{ background: item.miniGradient }}
                  aria-hidden="true"
                />
                <div className="lead-mini-scrim" aria-hidden="true" />
                <span className="lead-mini-tag">{item.tag}</span>
                <div className="lead-mini-copy">
                  <p className="lead-mini-title">{item.bottomTitle}</p>
                  <p className="lead-mini-desc">{item.bottomDesc}</p>
                </div>
                <button type="button" className="lead-pill-cta lead-pill-cta--mini">
                  {item.bottomCta}
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="lead-controls">
        <div className="lead-dots" role="tablist" aria-label="Carousel pagination">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Go to slide ${index + 1}`}
              className={`lead-dot ${index === activeIndex ? 'is-active' : ''}`}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
