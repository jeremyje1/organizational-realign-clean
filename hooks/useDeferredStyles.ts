/**
 * CSS Optimization Hook
 * Helps reduce CSS preload warnings by deferring non-critical styles
 */

'use client';

import { useEffect } from 'react';

export function useDeferredStyles() {
  useEffect(() => {
    // Defer non-critical CSS loading
    const deferStyles = () => {
      const links = document.querySelectorAll('link[rel="preload"][as="style"]');
      links.forEach((link) => {
        const href = link.getAttribute('href');
        if (href && !href.includes('critical')) {
          // Convert preload to actual stylesheet after page load
          setTimeout(() => {
            const stylesheet = document.createElement('link');
            stylesheet.rel = 'stylesheet';
            stylesheet.href = href;
            document.head.appendChild(stylesheet);
            link.remove();
          }, 100);
        }
      });
    };

    // Run after page load
    if (document.readyState === 'complete') {
      deferStyles();
    } else {
      window.addEventListener('load', deferStyles);
      return () => window.removeEventListener('load', deferStyles);
    }
  }, []);
}

export default useDeferredStyles;
