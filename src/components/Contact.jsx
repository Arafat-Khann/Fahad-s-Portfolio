import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, Terminal, Globe, Send } from 'lucide-react';
import './Contact.css';

export default function Contact() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={containerRef} className="contact-section">
      <motion.div style={{ y, opacity }} className="contact-container glass-panel">
        <div className="contact-info">
          <h2 className="contact-title">Let's Connect</h2>
          <p className="contact-desc">
            Always open to discussing new opportunities, interesting projects, or just chatting about AI and engineering.
          </p>
          <div className="contact-socials">
            <motion.a href="#" className="social-link" whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
              <Mail size={24} />
            </motion.a>
            <motion.a href="#" className="social-link" whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
              <Terminal size={24} />
            </motion.a>
            <motion.a href="#" className="social-link" whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
              <Globe size={24} />
            </motion.a>
          </div>
        </div>

        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <div className="input-group">
            <input type="text" id="name" required placeholder=" " />
            <label htmlFor="name">Name</label>
            <div className="input-border"></div>
          </div>
          <div className="input-group">
            <input type="email" id="email" required placeholder=" " />
            <label htmlFor="email">Email</label>
            <div className="input-border"></div>
          </div>
          <div className="input-group">
            <textarea id="message" required placeholder=" " rows={4}></textarea>
            <label htmlFor="message">Message</label>
            <div className="input-border"></div>
          </div>
          <motion.button 
            type="submit" 
            className="submit-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Send Message
            <Send size={18} className="send-icon" />
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}
