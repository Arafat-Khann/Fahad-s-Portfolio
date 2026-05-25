import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import './Testimonials.css';

const testimonials = [
  {
    quote: 'Fahad brings a rare mix of product thinking and technical execution. He moves quickly, but the work stays clean and considered.',
    name: 'Alex Johnson',
    title: 'Senior Engineer',
    company: 'Tech Internship',
    initials: 'AJ',
  },
  {
    quote: 'He picked up new tools fast and kept pushing the quality bar higher. That combination is hard to find.',
    name: 'Sara Malik',
    title: 'Project Lead',
    company: 'Research Lab',
    initials: 'SM',
  },
  {
    quote: 'His enthusiasm for AI and software is contagious, and he consistently raises the standard of whatever team he joins.',
    name: 'Omar Raza',
    title: 'Collaborator',
    company: 'Product Sprint',
    initials: 'OR',
  },
  {
    quote: 'Reliable, sharp, and always thinking two steps ahead. His code is documented, scalable, and shipped on time.',
    name: 'Nadia Cheema',
    title: 'Supervisor',
    company: 'Internship',
    initials: 'NC',
  },
];

export default function Testimonials() {
  const railRef = useRef(null);
  const cardRefs = useRef([]);
  const scrollRafRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const maxIndex = testimonials.length - 1;

  const clampIndex = useCallback((index) => Math.max(0, Math.min(maxIndex, index)), [maxIndex]);

  const syncActiveIndex = useCallback(() => {
    const rail = railRef.current;
    if (!rail || cardRefs.current.length === 0) return;

    const railCenter = rail.scrollLeft + rail.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(cardCenter - railCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex((currentIndex) => (currentIndex === closestIndex ? currentIndex : closestIndex));
  }, []);

  const scrollToIndex = useCallback(
    (index) => {
      const nextIndex = clampIndex(index);
      const rail = railRef.current;
      const card = cardRefs.current[nextIndex];

      if (!rail || !card) return;

      const targetLeft = card.offsetLeft - (rail.clientWidth - card.clientWidth) / 2;
      rail.scrollTo({ left: targetLeft, behavior: 'smooth' });
      setActiveIndex(nextIndex);
    },
    [clampIndex]
  );

  const handleRailScroll = useCallback(() => {
    if (scrollRafRef.current) {
      cancelAnimationFrame(scrollRafRef.current);
    }

    scrollRafRef.current = requestAnimationFrame(syncActiveIndex);
  }, [syncActiveIndex]);

  useEffect(() => {
    syncActiveIndex();

    const onResize = () => syncActiveIndex();
    window.addEventListener('resize', onResize);

    if (typeof ResizeObserver !== 'undefined' && railRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => syncActiveIndex());
      resizeObserverRef.current.observe(railRef.current);
    }

    return () => {
      window.removeEventListener('resize', onResize);

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }

      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, [syncActiveIndex]);

  return (
    <section className="testimonials-section" id="testimonials">
      <motion.div
        className="testimonials-shell glass-panel"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="testimonials-header">
          <div>
            <p className="testimonials-kicker">Testimonials</p>
            <h2 className="testimonials-title">What people say</h2>
          </div>

          <div className="testimonials-controls" aria-label="Testimonial navigation">
            <button
              type="button"
              className="testimonials-nav"
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="testimonials-nav"
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={activeIndex === maxIndex}
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="testimonials-carousel">
          <div className="testimonials-rail" ref={railRef} onScroll={handleRailScroll}>
            {testimonials.map((testimonial, index) => {
              const isActive = index === activeIndex;

              return (
                <motion.article
                  key={testimonial.name}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  className={`testimonial-card ${isActive ? 'is-active' : ''}`}
                  initial={{ opacity: 0, y: 18, scale: 0.97 }}
                  animate={{
                    opacity: isActive ? 1 : 0.72,
                    y: isActive ? 0 : 8,
                    scale: isActive ? 1 : 0.98,
                  }}
                  transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="testimonial-top">
                    <span className="testimonial-avatar">{testimonial.initials}</span>
                    <Quote size={18} className="testimonial-quote-icon" />
                  </div>

                  <p className="testimonial-quote">{testimonial.quote}</p>

                  <div className="testimonial-footer">
                    <div>
                      <div className="testimonial-name">{testimonial.name}</div>
                      <div className="testimonial-role">
                        {testimonial.title} · {testimonial.company}
                      </div>
                    </div>

                    <div className="testimonial-index" aria-hidden="true">
                      0{index + 1}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
