import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import './Contact.css';

const CONTACT_EMAIL = 'fahad.qaseeem@gmail.com';
const GITHUB_URL = 'https://github.com/fahadqaseem';
const LINKEDIN_URL = 'https://linkedin.com/in/fahadqaseem/';

function GitHubIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A8.205 8.205 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 0h-14c-1.657 0-3 1.343-3 3v18c0 1.657 1.343 3 3 3h14c1.657 0 3-1.343 3-3v-18c0-1.657-1.343-3-3-3zM8 19h-3v-9h3v9zM6.5 8.5c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zM20 19h-3v-5c0-1.105-.895-2-2-2s-2 .895-2 2v5h-3v-9h3v1.2c.666-.86 1.866-1.2 3-1.2 2.485 0 4 1.514 4 4.8v4.2z" />
    </svg>
  );
}

export default function Contact() {
  const containerRef = useRef(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Contact from ${name || 'Website'}`)}&body=${encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`)}`;

  function openMailClient() {
    const link = document.createElement('a');
    link.href = mailto;
    link.target = '_self';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <section id="contact" ref={containerRef} className="contact-section">
      <motion.div style={{ y, opacity }} className="contact-container glass-panel">
        <div className="contact-info">
          <h2 className="contact-title">Let's Connect</h2>
          <p className="contact-desc">
            Always open to discussing new opportunities, interesting projects, or just chatting about AI and engineering.
          </p>
          <div className="contact-socials">
            <motion.a href={mailto} className="social-link" whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
              <Mail size={24} />
            </motion.a>
            <motion.a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="social-link" whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
              <LinkedInIcon size={24} />
            </motion.a>
            <motion.a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="social-link" whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
              <GitHubIcon size={24} />
            </motion.a>
          </div>
        </div>

        <form
          className="contact-form"
          onSubmit={(e) => {
            e.preventDefault();
            openMailClient();
          }}
        >
          <div className="input-group">
            <input type="text" id="name" required placeholder=" " value={name} onChange={(e) => setName(e.target.value)} />
            <label htmlFor="name">Name</label>
            <div className="input-border"></div>
          </div>
          <div className="input-group">
            <input type="email" id="email" required placeholder=" " value={email} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="email">Email</label>
            <div className="input-border"></div>
          </div>
          <div className="input-group">
            <textarea id="message" required placeholder=" " rows={4} value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
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
