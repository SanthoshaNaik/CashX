import React from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { ValuationModal } from './components/ValuationModal';
import { AuthModal } from './components/AuthModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { SellLaptopPage } from './pages/SellLaptopPage';
import { SellMacBookPage } from './pages/SellMacBookPage';
import { SellDesktopPage } from './pages/SellDesktopPage';
import { ServicesPage } from './pages/ServicesPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { BlogPage } from './pages/BlogPage';
import { CityPage } from './pages/CityPage';
import { BrandPage } from './pages/BrandPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { SitemapPage } from './pages/SitemapPage';
import { AdminPortalPage } from './pages/AdminPortalPage';

const PageRenderer = () => {
  const { currentRoute } = usePortal();

  if (currentRoute === '/about') return <AboutPage />;
  if (currentRoute === '/sell-laptop') return <SellLaptopPage />;
  if (currentRoute === '/sell-macbook') return <SellMacBookPage />;
  if (currentRoute === '/sell-desktop') return <SellDesktopPage />;
  if (currentRoute === '/services') return <ServicesPage />;
  if (currentRoute === '/faq') return <FAQPage />;
  if (currentRoute === '/contact') return <ContactPage />;
  if (currentRoute === '/blog') return <BlogPage />;
  if (currentRoute.startsWith('/city/')) return <CityPage />;
  if (currentRoute.startsWith('/brand/')) return <BrandPage />;
  if (currentRoute === '/privacy') return <PrivacyPage />;
  if (currentRoute === '/terms') return <TermsPage />;
  if (currentRoute === '/sitemap') return <SitemapPage />;
  if (currentRoute === '/admin' || currentRoute === '/agent') return <AdminPortalPage />;

  return <HomePage />;
};

export function App() {
  return (
    <PortalProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1 }}>
          <PageRenderer />
        </main>
        <Footer />
        <FloatingActions />
        <ValuationModal />
        <AuthModal />
      </div>
    </PortalProvider>
  );
}

export default App;
