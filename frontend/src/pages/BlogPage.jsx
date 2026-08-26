import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { BLOG_POSTS } from '../data/portalData';
import { BookOpen, Clock, ArrowRight, X, ShieldCheck, Calculator } from 'lucide-react';

export const BlogPage = () => {
  const { setValuationModalOpen, COMPANY_INFO } = usePortal();
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div>
      <section style={{ padding: '4rem 0 3rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div className="container">
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>IT BUYBACK & RESALE INSIGHTS</span>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>Laptop Buyback <span className="text-gradient-gold">Blog & Value Guide</span></h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem' }}>
            Learn how to safely wipe your data, maximize your laptop resale price, and time your hardware upgrades.
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 0', background: 'var(--bg-pitch)' }}>
        <div className="container">
          <div className="grid-3">
            {BLOG_POSTS.map(post => (
              <div key={post.id} className="card-dark" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className="badge badge-gold">{post.category}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={12} /> {post.readTime}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', lineHeight: 1.4 }}>{post.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {post.snippet}
                  </p>
                </div>

                <button 
                  className="btn btn-outline" 
                  onClick={() => setSelectedPost(post)}
                  style={{ width: '100%', padding: '0.6rem' }}
                >
                  Read Full Article <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Article Reader Modal */}
      {selectedPost && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 150, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card-dark" style={{ maxWidth: '700px', width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'relative', padding: '2rem' }}>
            <button onClick={() => setSelectedPost(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'var(--text-muted)' }}>
              <X size={22} />
            </button>

            <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>{selectedPost.category}</span>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{selectedPost.title}</h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
              <span>Published by {COMPANY_INFO.name} Editorial Team</span>
              <span>•</span>
              <span>{selectedPost.readTime}</span>
            </div>

            <div style={{ color: 'var(--text-main)', fontSize: '0.98rem', lineHeight: 1.8, marginBottom: '2rem' }}>
              <p style={{ marginBottom: '1rem' }}>{selectedPost.content}</p>
              <p style={{ marginBottom: '1rem' }}>
                Before handing over any electronic device to a buyer, ensure you perform complete data sanitization. At <strong>{COMPANY_INFO.name}</strong>, our field inspection team executes certified DoD 5220.22-M data wiping for every device bought.
              </p>
              <p>
                To get an instant estimate on what your current laptop, MacBook, or desktop is worth today, use our live automated pricing calculator.
              </p>
            </div>

            <button className="btn btn-gold" style={{ width: '100%' }} onClick={() => { setSelectedPost(null); setValuationModalOpen(true); }}>
              <Calculator size={18} /> Calculate Your Laptop's Resale Value Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
