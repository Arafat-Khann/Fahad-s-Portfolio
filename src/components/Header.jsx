import './Header.css';

export default function Header() {
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
    <header className="site-header glass-panel">
      <a className="site-brand" href="#top" aria-label="Go to top of page">
        Fahad.
      </a>

      <nav className="site-nav" aria-label="Section navigation">
        {navItems.map((item) => (
          <a
            key={item.label}
            className={`site-nav-link ${item.cta ? 'is-cta' : ''}`}
            href={item.href}
          >
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </header>
  );
}
