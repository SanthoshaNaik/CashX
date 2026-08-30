import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { usePortal } from '../context/PortalContext';

const SLIDES = [
  {
    id: 'laptop-exchange',
    category: 'laptop',
    badge: 'Limited Period Offer',
    title: 'Up to ₹9K exchange bonus*',
    subtitle: 'Sell old laptop & switch to latest MacBook or AI Laptop with TheCashX Upgrade Program',
    buttonText: 'Upgrade Now',
    route: '/sell-laptop',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=90',
    disclaimer: '*T&C Apply',
    lightBg: 'linear-gradient(135deg, #d8f5ee 0%, #ebfbf7 50%, #d5f2ea 100%)',
    darkBg: 'linear-gradient(135deg, #0f2b26 0%, #133a34 50%, #0d2420 100%)',
    btnBg: '#2dd4bf',
    btnHoverBg: '#14b8a6',
    btnTextColor: '#042f2e',
    textColor: '#0f172a',
    subtextColor: '#334155',
    darkTextColor: '#f0fdfa',
    darkSubtextColor: '#99f6e4'
  },
  {
    id: 'macmini-promo',
    category: 'macmini',
    badge: 'Apple Silicon Buyback',
    title: 'Get Top Value for Mac Mini M1/M2/M4*',
    subtitle: 'Instant doorstep valuation & DoD military-grade certified data sanitization on the spot',
    buttonText: 'Sell Mac Mini',
    route: '/sell-macmini',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=90',
    disclaimer: '*Instant UPI Settlement',
    lightBg: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #e0e7ff 100%)',
    darkBg: 'linear-gradient(135deg, #0c253d 0%, #15385b 50%, #0d1e38 100%)',
    btnBg: '#38bdf8',
    btnHoverBg: '#0ea5e9',
    btnTextColor: '#082f49',
    textColor: '#0f172a',
    subtextColor: '#334155',
    darkTextColor: '#f8fafc',
    darkSubtextColor: '#bae6fd'
  },
  {
    id: 'desktop-rigs',
    category: 'desktop',
    badge: 'Component Value Boost',
    title: 'Exchange Gaming Rigs & Towers*',
    subtitle: 'We calculate individual component value for GPUs, CPUs & RAM for maximum cash payout',
    buttonText: 'Sell Desktop PC',
    route: '/sell-desktop',
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=90',
    disclaimer: '*Custom Tower Evaluation',
    lightBg: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 50%, #fed7aa 100%)',
    darkBg: 'linear-gradient(135deg, #3d2b09 0%, #4a340c 50%, #2b1f07 100%)',
    btnBg: '#f59e0b',
    btnHoverBg: '#d97706',
    btnTextColor: '#451a03',
    textColor: '#1c1917',
    subtextColor: '#44403c',
    darkTextColor: '#fef3c7',
    darkSubtextColor: '#fde68a'
  },
  {
    id: 'monitor-upgrade',
    category: 'monitor',
    badge: 'Zero Transit Damage Risk',
    title: 'Up to ₹15,000 for 4K & Gaming Monitors*',
    subtitle: 'Free doorstep inspection for Dell, Samsung, LG, BenQ & ASUS ROG displays in 2 hours',
    buttonText: 'Sell Monitor Now',
    route: '/sell-monitor',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=90',
    disclaimer: '*Free Doorstep Pickup',
    lightBg: 'linear-gradient(135deg, #f3e8ff 0%, #faf5ff 50%, #ede9fe 100%)',
    darkBg: 'linear-gradient(135deg, #2b1145 0%, #3b175e 50%, #1f0b33 100%)',
    btnBg: '#c084fc',
    btnHoverBg: '#a855f7',
    btnTextColor: '#3b0764',
    textColor: '#1e1b4b',
    subtextColor: '#3730a3',
    darkTextColor: '#faf5ff',
    darkSubtextColor: '#e9d5ff'
  }
];

// Infinite loop array: [Clone Last, Slide 1, Slide 2, Slide 3, Slide 4, Clone First]
const EXTENDED_SLIDES = [
  { ...SLIDES[SLIDES.length - 1], uniqueKey: 'clone-last' },
  ...SLIDES.map((s, idx) => ({ ...s, uniqueKey: `real-${s.id}-${idx}` })),
  { ...SLIDES[0], uniqueKey: 'clone-first' }
];

export const CategorySlider = () => {
  const { navigate, currentUser, theme } = usePortal();
  // Starts at index 1 (the first real slide)
  const [currentIdx, setCurrentIdx] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const timerRef = useRef(null);

  const isDark = theme === 'dark';

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIdx((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIdx((prev) => prev - 1);
  }, []);

  const goToSlide = (slideIdx) => {
    setIsTransitioning(true);
    setCurrentIdx(slideIdx + 1);
  };

  // Seamless jump on loop boundaries without animation
  const handleTransitionEnd = () => {
    if (currentIdx === EXTENDED_SLIDES.length - 1) {
      // Reached the clone of first slide -> instantly jump to real first slide (index 1)
      setIsTransitioning(false);
      setCurrentIdx(1);
    } else if (currentIdx === 0) {
      // Reached the clone of last slide -> instantly jump to real last slide (index 4)
      setIsTransitioning(false);
      setCurrentIdx(SLIDES.length);
    }
  };

  // Automatic forward sliding interval
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 4000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  // Touch gesture handlers for mobile
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const handleAction = (slide) => {
    if (!currentUser) {
      localStorage.setItem('cashx_redirect_after_login', slide.route || '/sell-laptop');
      navigate('/login');
      return;
    }
    navigate(slide.route);
  };

  // Compute active pagination dot index (0..3)
  let activeDotIdx = currentIdx - 1;
  if (currentIdx === 0) activeDotIdx = SLIDES.length - 1;
  if (currentIdx === EXTENDED_SLIDES.length - 1) activeDotIdx = 0;

  return (
    <div 
      className="category-slider-wrapper"
      style={{
        width: '100%',
        maxWidth: '1180px',
        margin: '0 auto',
        padding: '0 1rem',
        position: 'relative'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
      }}
      aria-roledescription="carousel"
      aria-label="Promotional Categories Slider"
    >
      {/* Outer Slider Box Container */}
      <div
        className="category-slider-box"
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: isDark 
            ? '0 10px 30px rgba(0, 0, 0, 0.5)' 
            : '0 10px 30px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)',
          background: isDark ? '#0d1117' : '#f8fafc'
        }}
      >
        {/* Navigation Arrow Left */}
        <button
          onClick={prevSlide}
          className="slider-nav-btn slider-nav-prev"
          aria-label="Previous Slide"
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '40px',
            height: '52px',
            borderRadius: '12px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.08)',
            background: isDark ? 'rgba(15, 23, 42, 0.82)' : 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(10px)',
            color: isDark ? '#f8fafc' : '#0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>

        {/* Navigation Arrow Right */}
        <button
          onClick={nextSlide}
          className="slider-nav-btn slider-nav-next"
          aria-label="Next Slide"
          style={{
            position: 'absolute',
            right: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '40px',
            height: '52px',
            borderRadius: '12px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.08)',
            background: isDark ? 'rgba(15, 23, 42, 0.82)' : 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(10px)',
            color: isDark ? '#f8fafc' : '#0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <ChevronRight size={22} strokeWidth={2.5} />
        </button>

        {/* Continuous Seamless Infinite Horizontal Sliding Track */}
        <div
          className="slider-track"
          onTransitionEnd={handleTransitionEnd}
          style={{
            display: 'flex',
            width: '100%',
            transform: `translateX(-${currentIdx * 100}%)`,
            transition: isTransitioning ? 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
            willChange: 'transform'
          }}
        >
          {EXTENDED_SLIDES.map((slide) => {
            return (
              <div
                key={slide.uniqueKey}
                className="slider-slide-item"
                style={{
                  minWidth: '100%',
                  width: '100%',
                  flexShrink: 0,
                  background: isDark ? slide.darkBg : slide.lightBg,
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: '270px'
                }}
              >
                <div
                  className="slider-slide-content"
                  style={{
                    width: '100%',
                    padding: '2.5rem 3.75rem',
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr',
                    alignItems: 'center',
                    gap: '2rem',
                    position: 'relative'
                  }}
                >
                  {/* Left Side: Typography & Action */}
                  <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    
                    {/* Title / Main Headline */}
                    <h2
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(1.75rem, 3.2vw, 2.75rem)',
                        fontWeight: 800,
                        lineHeight: 1.15,
                        letterSpacing: '-0.03em',
                        color: isDark ? slide.darkTextColor : slide.textColor,
                        marginBottom: '1rem',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      {slide.title}
                    </h2>

                    {/* Subtitle / Description */}
                    <p
                      style={{
                        fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)',
                        fontWeight: 500,
                        lineHeight: 1.5,
                        color: isDark ? slide.darkSubtextColor : slide.subtextColor,
                        marginBottom: '1.75rem',
                        maxWidth: '480px',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      {slide.subtitle}
                    </p>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleAction(slide)}
                      className="slider-cta-btn"
                      style={{
                        background: slide.btnBg,
                        color: slide.btnTextColor,
                        fontWeight: 700,
                        fontSize: '1rem',
                        padding: '0.85rem 1.85rem',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = slide.btnHoverBg;
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.18)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = slide.btnBg;
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.12)';
                      }}
                    >
                      {slide.buttonText}
                      <ArrowRight size={18} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Right Side: Product Showcase Image & Disclaimer */}
                  <div 
                    className="slider-image-container"
                    style={{ 
                      position: 'relative', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      height: '100%',
                      minHeight: '200px'
                    }}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '220px',
                        objectFit: 'contain',
                        borderRadius: '16px',
                        filter: isDark 
                          ? 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.6))' 
                          : 'drop-shadow(0 15px 25px rgba(0, 0, 0, 0.15))',
                        transform: 'scale(1)',
                        transition: 'transform 0.5s ease'
                      }}
                      loading="eager"
                    />

                    {/* Subtle T&C / Tag */}
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-0.75rem',
                        right: '0',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)',
                        letterSpacing: '0.02em'
                      }}
                    >
                      {slide.disclaimer}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Pagination Dots */}
      <div
        className="slider-pagination-wrap"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginTop: '1rem'
        }}
      >
        {SLIDES.map((s, idx) => {
          const isActive = idx === activeDotIdx;
          return (
            <button
              key={s.id}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              style={{
                height: '6px',
                width: isActive ? '28px' : '8px',
                borderRadius: '9999px',
                background: isActive 
                  ? (isDark ? '#f8fafc' : '#1e293b') 
                  : (isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.18)'),
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
