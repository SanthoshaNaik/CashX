import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { CATEGORIES } from '../data/portalData';
import { ArrowRight, Check } from 'lucide-react';

export const CategoryCards = ({ onSelect, selectedId, showCheckmark = true }) => {
  const { navigate, currentUser, setCategoryModalOpen } = usePortal();
  const [hoveredId, setHoveredId] = useState(null);

  const handleCardClick = (cat) => {
    if (setCategoryModalOpen) {
      setCategoryModalOpen(false);
    }
    if (!currentUser) {
      localStorage.setItem('cashx_redirect_after_login', cat.route || '/sell-laptop');
      navigate('/login');
      return;
    }
    if (onSelect) {
      onSelect(cat);
    } else {
      navigate(cat.route);
    }
  };

  return (
    <div 
      style={{
        maxWidth: '860px',
        margin: '0 auto',
        width: '100%'
      }}
    >
      <div className="category-grid-2x2">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedId === cat.id;
          const isHovered = hoveredId === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => handleCardClick(cat)}
              onMouseEnter={() => setHoveredId(cat.id)}
              onMouseLeave={() => setHoveredId(null)}
              role="button"
              tabIndex={0}
              className="category-card-item"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(cat);
                }
              }}
              style={{
                position: 'relative',
                background: 'var(--bg-card)',
                backgroundColor: 'var(--bg-card)',
                borderRadius: '20px',
                border: isSelected 
                  ? '2px solid var(--text-main)' 
                  : isHovered 
                    ? '1px solid var(--border-glow)' 
                    : '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                overflow: 'hidden',
                boxShadow: isHovered
                  ? 'var(--shadow-card-hover)'
                  : 'var(--shadow-card)',
                transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Selected Checkmark Badge */}
              {showCheckmark && isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--text-main)',
                    color: 'var(--bg-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                    zIndex: 2,
                    animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <Check size={14} strokeWidth={2.5} />
                </div>
              )}

              {/* Studio Product Photography */}
              <div
                className="category-card-img-wrap"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <img
                  src={cat.image}
                  alt={`${cat.name} Studio Photography`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.1))',
                    transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  loading="lazy"
                />
              </div>

              {/* Bottom Card Information */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  paddingTop: '0.85rem',
                  marginTop: 'auto'
                }}
              >
                {/* Category Title & Small Supporting Text */}
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.2,
                      color: 'var(--text-main)',
                      marginBottom: '0.15rem'
                    }}
                  >
                    {cat.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      color: 'var(--text-muted)',
                      letterSpacing: '-0.01em',
                      lineHeight: 1.3
                    }}
                  >
                    {cat.supportingText || `Sell your ${cat.name.toLowerCase()}`}
                  </p>
                </div>

                {/* Minimal Right-Facing Arrow Icon */}
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: isHovered ? 'var(--btn-outline-hover)' : 'var(--btn-outline-bg)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-main)',
                    flexShrink: 0,
                    transform: isHovered ? 'translateX(3px)' : 'translateX(0)',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <ArrowRight size={15} strokeWidth={2} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
