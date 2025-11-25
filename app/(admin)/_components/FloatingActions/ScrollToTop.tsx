'use client';

import React, { useEffect, useState } from 'react';
import type { ScrollToTopProps } from './FloatingActions.types';

const ScrollUpIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path 
      d="M7 14l5-5 5 5" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M7 20l5-5 5 5" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export function ScrollToTop({ 
  threshold = 400, 
  className = '' 
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      // Parse threshold - handle both number (pixels) and string (vh/vw)
      let thresholdValue = 400; // default fallback
      
      if (typeof threshold === 'number') {
        thresholdValue = threshold;
      } else if (typeof threshold === 'string') {
        if (threshold.endsWith('vh')) {
          const vh = parseFloat(threshold);
          thresholdValue = (window.innerHeight * vh) / 100;
        } else if (threshold.endsWith('vw')) {
          const vw = parseFloat(threshold);
          thresholdValue = (window.innerWidth * vw) / 100;
        } else {
          // Try to parse as pixels
          thresholdValue = parseFloat(threshold) || 400;
        }
      }

      setIsVisible(window.scrollY > thresholdValue);
    };

    // Initial check
    handleScroll();

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, isClient]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isClient || !isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      style={{
        backgroundColor: '#2563eb',
        color: 'white'
      }}
      className={`
        floating-action-button
        inline-flex items-center justify-center
        w-12 h-12 rounded-full
        hover:opacity-90
        shadow-lg border-2 border-white
        hover:scale-105 active:scale-95
        transition-all duration-200
        focus:outline-none focus:ring-4 focus:ring-blue-500/25
        ${className}
      `}
      title="Scroll to top"
      aria-label="Scroll to top of page"
    >
      {ScrollUpIcon}
    </button>
  );
}