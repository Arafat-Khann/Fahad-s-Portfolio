import './Header.css';
import { useState } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: 'About Me', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Leadership Activities', href: '#leadership' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Connect', href: '#contact', cta: true },
  ];

  return (
    <header className={`site-header glass-panel ${open ? 'nav-open' : ''}`}>
      <a className="site-brand" href="#top" aria-label="Go to top of page">
        Fahad.
      </a>

      <button
        className="site-menu-toggle"
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="hamburger" aria-hidden="true" />
      </button>

      <nav className={`site-nav ${open ? 'open' : ''}`} aria-label="Section navigation">
        {navItems.map((item) => (
          <a
            key={item.label}
            className={`site-nav-link ${item.cta ? 'is-cta' : ''}`}
            href={item.href}
            onClick={() => setOpen(false)}
          >
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </header>
  );
}
