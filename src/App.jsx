import React, { useEffect } from 'react';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import Header from './components/Header';
import CustomCursor from './components/CustomCursor';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import LeadershipCarousel from './components/LeadershipCarousel';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';

function App() {
  // Initialize Lenis smooth scroll
  useSmoothScroll();

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    scrollToTop();

    const onPageShow = (event) => {
      if (event.persisted) {
        scrollToTop();
      }
    };

    window.addEventListener('pageshow', onPageShow);

    return () => {
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  return (
    <>
      <CustomCursor />
      <Header />
      <main id="top">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <LeadershipCarousel />
        <Testimonials />
        <Contact />
      </main>
    </>
  );
}

export default App;
