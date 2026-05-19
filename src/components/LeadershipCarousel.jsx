import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useHorizontalWheelSteps } from '../hooks/useHorizontalWheel';
import { getLeadershipWheelConfig } from '../utils/deviceWheel';
import { ArrowUpRight, X } from 'lucide-react';
import './LeadershipCarousel.css';

const leadershipDetails = [
  {
    id: 1,
    title: 'Tech Club President',
    tag: 'Leadership',
    period: '2023 - Present',
    location: 'Campus Tech Society',
    summary:
      'Led weekly meetings, mentored new members, and shaped the club into a consistent space for technical growth and collaboration.',
    bullets: [
      'Built a 40+ member community with recurring workshops and coding sessions',
      'Coordinated event planning with faculty, sponsors, and student volunteers',
      'Created a simple onboarding flow for new members and project teams',
    ],
    stats: [
      { label: 'Members', value: '40+' },
      { label: 'Events', value: '12+' },
      { label: 'Focus', value: 'Mentorship' },
    ],
  },
  {
    id: 2,
    title: 'Hackathon Organizer',
    tag: 'Events',
    period: '2022 - 2024',
    location: 'Innovation Weekends',
    summary:
      'Organized multi-team hackathons with logistics, judging, and sponsor coordination across several campus weekends.',
    bullets: [
      'Managed registration, judging flow, and volunteer scheduling',
      'Kept the event format fast, simple, and easy to repeat each term',
      'Built templates for sponsor outreach and event day operations',
    ],
    stats: [
      { label: 'Events', value: '3' },
      { label: 'Teams', value: '50+' },
      { label: 'Focus', value: 'Logistics' },
    ],
  },
  {
    id: 3,
    title: 'Mentorship Lead',
    tag: 'Mentorship',
    period: '2023 - Present',
    location: 'Peer Learning Program',
    summary:
      'Supported junior developers through pairing sessions, code reviews, and lightweight project guidance.',
    bullets: [
      'Ran structured pairing sessions for early-stage developers',
      'Reviewed projects with clear feedback and actionable next steps',
      'Designed workshop notes that could be reused by future mentors',
    ],
    stats: [
      { label: 'Mentees', value: '15+' },
      { label: 'Sessions', value: '30+' },
      { label: 'Focus', value: 'Growth' },
    ],
  },
  {
    id: 4,
    title: 'AI Workshop Facilitator',
    tag: 'Education',
    period: '2024',
    location: 'Student AI Series',
    summary:
      'Led hands-on workshops introducing practical LLM workflows, prompt design, and simple demo builds.',
    bullets: [
      'Prepared concise workshop material for fast live demos',
      'Explained prompt patterns and basic AI product thinking',
      'Collected attendee questions to refine each follow-up session',
    ],
    stats: [
      { label: 'Workshops', value: '4' },
      { label: 'Attendees', value: '80+' },
      { label: 'Focus', value: 'LLMs' },
    ],
  },
  {
    id: 5,
    title: 'Open Source Contributor',
    tag: 'Open Source',
    period: '2022 - Present',
    location: 'Student tooling repos',
    summary:
      'Maintained student-facing tools, documentation, and release workflows for projects used by peers.',
    bullets: [
      'Improved docs so new contributors could get started faster',
      'Kept release notes and PR templates lightweight but useful',
      'Tracked issues and feature requests in a simple repeatable process',
    ],
    stats: [
      { label: 'Repos', value: '5+' },
      { label: 'PRs', value: '20+' },
      { label: 'Focus', value: 'Docs' },
    ],
  },
  {
    id: 6,
    title: 'Student Council Representative',
    tag: 'Campus',
    period: '2023 - 2024',
    location: 'Student Affairs',
    summary:
      'Helped bridge student feedback and faculty initiatives through simple, reliable communication channels.',
    bullets: [
      'Collected student feedback and summarized themes for meetings',
      'Helped translate requests into clear action items and follow-up notes',
      'Worked across committees to keep communication consistent',
    ],
    stats: [
      { label: 'Forums', value: '8+' },
      { label: 'Topics', value: '15+' },
      { label: 'Focus', value: 'Policy' },
    ],
  },
  {
    id: 7,
    title: 'Design Sprint Lead',
    tag: 'Product',
    period: '2024',
    location: 'Cross-functional Labs',
    summary:
      'Facilitated short product ideation sessions to move from rough ideas to testable concepts quickly.',
    bullets: [
      'Kept workshops focused on problem framing and quick decisions',
      'Used lightweight sketches and notes to reduce process overhead',
      'Helped teams leave with one clear next step after each session',
    ],
    stats: [
      { label: 'Sprints', value: '6' },
      { label: 'Teams', value: '10+' },
      { label: 'Focus', value: 'UX' },
    ],
  },
  {
    id: 8,
    title: 'Volunteer Coordinator',
    tag: 'Outreach',
    period: '2022 - 2024',
    location: 'Community Programs',
    summary:
      'Organized outreach and mentorship initiatives with simple scheduling, partner communication, and volunteer flow.',
    bullets: [
      'Built a recurring schedule for volunteers and program leads',
      'Kept outreach tasks visible and easy to hand off between teams',
      'Balanced community events with longer-term mentoring efforts',
    ],
    stats: [
      { label: 'Programs', value: '5+' },
      { label: 'Volunteers', value: '25+' },
      { label: 'Focus', value: 'Outreach' },
    ],
  },
];

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
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [wheelConfig, setWheelConfig] = useState(() => getLeadershipWheelConfig());
  const [metrics, setMetrics] = useState({
    heroW: 280,
    heroGap: 10,
    miniW: 240,
    miniGap: 10,
  });

  const wrapperRef = useRef(null);
  const heroTrackRef = useRef(null);
  const metricsRef = useRef({
    heroW: 280,
    heroGap: 10,
    miniW: 240,
    miniGap: 10,
  });
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartIndex = useRef(0);

  const maxIndex = items.length - 1;

  const clampIndex = useCallback(
    (i) => Math.max(0, Math.min(maxIndex, i)),
    [maxIndex]
  );

  const goTo = (index) => setActiveIndex(clampIndex(index));

  const openDetail = useCallback((item) => {
    setSelectedDetail(item);
  }, []);

  const closeDetail = useCallback(() => {
    setSelectedDetail(null);
  }, []);

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

    const next = { heroW, heroGap, miniW, miniGap };
    const prev = metricsRef.current;
    if (
      prev.heroW !== next.heroW ||
      prev.heroGap !== next.heroGap ||
      prev.miniW !== next.miniW ||
      prev.miniGap !== next.miniGap
    ) {
      metricsRef.current = next;
      setMetrics(next);
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

  useEffect(() => {
    const onResize = () => setWheelConfig(getLeadershipWheelConfig());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const wheelHandlers = useMemo(
    () => ({
      onStepLeft: () => setActiveIndex((i) => clampIndex(i - 1)),
      onStepRight: () => setActiveIndex((i) => clampIndex(i + 1)),
      ...wheelConfig,
    }),
    [clampIndex, wheelConfig]
  );

  useHorizontalWheelSteps(wrapperRef, wheelHandlers);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') setActiveIndex((i) => clampIndex(i - 1));
      if (e.key === 'ArrowRight') setActiveIndex((i) => clampIndex(i + 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [clampIndex]);

  useEffect(() => {
    if (!selectedDetail) return undefined;

    const onEscape = (e) => {
      if (e.key === 'Escape') {
        closeDetail();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onEscape);
    };
  }, [selectedDetail, closeDetail]);

  return (
    <section id="leadership" className="leadership-section" aria-label="Leadership Activities">
      <div className="leadership-wrap">
      <div className="leadership-header">
        <h2 className="leadership-title">Leadership Activities.</h2>
      </div>

      <div
        className="leadership-stage"
        ref={wrapperRef}
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
                  <button
                    type="button"
                    className="lead-pill-cta"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetail(leadershipDetails[index]);
                    }}
                    aria-label={`Learn more about ${item.titleLine1} ${item.titleLine2}`}
                  >
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
                <button
                  type="button"
                  className="lead-pill-cta lead-pill-cta--mini"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDetail(leadershipDetails[index]);
                  }}
                  aria-label={`View role details for ${item.bottomTitle}`}
                >
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
      </div>

      {selectedDetail && (
        <div className="lead-modal-backdrop" role="presentation" onMouseDown={closeDetail}>
          <div
            className="lead-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-modal-title"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="lead-modal-close"
              onClick={closeDetail}
              aria-label="Close details"
            >
              <X size={18} />
            </button>

            <div className="lead-modal-hero" style={{ background: 'var(--gradient-brand)' }}>
              <div className="lead-modal-tag">{selectedDetail.tag}</div>
              <h3 id="lead-modal-title" className="lead-modal-title">
                {selectedDetail.title}
              </h3>
              <p className="lead-modal-meta">
                {selectedDetail.period} · {selectedDetail.location}
              </p>
            </div>

            <div className="lead-modal-body">
              <p className="lead-modal-summary">{selectedDetail.summary}</p>

              <div className="lead-modal-stats">
                {selectedDetail.stats.map((stat) => (
                  <div key={stat.label} className="lead-modal-stat">
                    <span className="lead-modal-stat-value">{stat.value}</span>
                    <span className="lead-modal-stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="lead-modal-grid">
                <div>
                  <p className="lead-modal-section-label">Dummy highlights</p>
                  <ul className="lead-modal-list">
                    {selectedDetail.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>

                <div className="lead-modal-note">
                  <p className="lead-modal-section-label">Placeholder content</p>
                  <p>
                    This panel is using temporary data so you can swap in your final
                    leadership entries later without changing the interaction pattern.
                  </p>
                </div>
              </div>

              <div className="lead-modal-actions">
                <button type="button" className="lead-modal-button" onClick={closeDetail}>
                  Close
                </button>
                <button
                  type="button"
                  className="lead-modal-button lead-modal-button-secondary"
                  onClick={closeDetail}
                >
                  <ArrowUpRight size={16} />
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
