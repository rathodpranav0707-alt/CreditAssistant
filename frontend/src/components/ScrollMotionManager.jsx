import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollMotionManager handles:
 * 1. Top reading scroll progress bar (0% -> 100%)
 * 2. Dynamic glassmorphic navbar styling on scroll
 * 3. IntersectionObserver reveal motion animations for elements with .scroll-reveal classes
 */
export const ScrollMotionManager = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // 1. Scroll Progress & Navbar transformation listener
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      } else {
        setScrollProgress(0);
      }

      // Navbar scroll effect
      const navbarEl = document.querySelector('.navbar');
      if (navbarEl) {
        if (window.scrollY > 20) {
          navbarEl.classList.add('navbar-scrolled');
        } else {
          navbarEl.classList.remove('navbar-scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  useEffect(() => {
    // 2. IntersectionObserver for reveal animations on scroll
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        } else {
          // Remove revealed when element leaves viewport so animation re-triggers on scroll back
          entry.target.classList.remove('revealed');
        }
      });
    }, observerOptions);

    // Observe elements with scroll-reveal classes
    const targetSelectors = [
      '.scroll-reveal',
      '.scroll-reveal-left',
      '.scroll-reveal-right',
      '.scroll-reveal-zoom',
    ];

    const elementsToObserve = document.querySelectorAll(targetSelectors.join(','));
    elementsToObserve.forEach((el) => observer.observe(el));

    return () => {
      elementsToObserve.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <div
      className="scroll-progress-bar"
      style={{ width: `${scrollProgress}%` }}
      aria-hidden="true"
    />
  );
};
