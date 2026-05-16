import React from 'react';
import { useSmoothScroll } from './hooks/useSmoothScroll';
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

  return (
    <>
      <CustomCursor />
      <main>
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
