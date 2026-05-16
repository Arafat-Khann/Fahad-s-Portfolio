import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
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
          <p className="testimonials-kicker">Testimonials</p>
          <h2 className="testimonials-title">What people say</h2>
          <p className="testimonials-description">
            Placeholder testimonials for now. These can be swapped with real references later without changing the layout.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.article
              className="testimonial-card"
              key={testimonial.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
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
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
