import React from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { ValuationModal } from './components/ValuationModal';
import { CategoryModal } from './components/CategoryModal';
import { AuthModal } from './components/AuthModal';

// Public Customer Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { SellLaptopPage } from './pages/SellLaptopPage';
import { SellDesktopPage } from './pages/SellDesktopPage';
import { SellMonitorPage } from './pages/SellMonitorPage';
import { SellMacMiniPage } from './pages/SellMacMiniPage';
import { SellMacBookPage } from './pages/SellMacBookPage';
import { ServicesPage } from './pages/ServicesPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { BlogPage } from './pages/BlogPage';
import { CityPage } from './pages/CityPage';
import { BrandPage } from './pages/BrandPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { SitemapPage } from './pages/SitemapPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';

// Admin Portal Application
import { AdminApp } from './admin/AdminApp';

const PageRenderer = () => {
  const { currentRoute, currentUser } = usePortal();

  // Admin Route Handler: Separate Admin Workspace
  if (currentRoute.startsWith('/admin')) {
    return <AdminApp />;
  }

  // Protect all /sell-* routes: redirect to /login if not authenticated
  const isSellRoute = currentRoute.startsWith('/sell-');
  if (isSellRoute && !currentUser) {
    localStorage.setItem('cashx_redirect_after_login', currentRoute);
    return <LoginPage />;
  }

  if (currentRoute === '/login' || currentRoute === '/auth') return <LoginPage />;
  if (currentRoute === '/orders' || currentRoute === '/profile' || currentRoute === '/account') return <ProfilePage />;
  if (currentRoute === '/about') return <AboutPage />;
  if (currentRoute === '/sell-laptop') return <SellLaptopPage />;
  if (currentRoute === '/sell-desktop') return <SellDesktopPage />;
  if (currentRoute === '/sell-monitor') return <SellMonitorPage />;
  if (currentRoute === '/sell-macmini') return <SellMacMiniPage />;
  if (currentRoute === '/sell-macbook') return <SellMacBookPage />;
  if (currentRoute === '/services') return <ServicesPage />;
  if (currentRoute === '/faq') return <FAQPage />;
  if (currentRoute === '/contact') return <ContactPage />;
  if (currentRoute === '/blog') return <BlogPage />;
  if (currentRoute.startsWith('/city/')) return <CityPage />;
  if (currentRoute.startsWith('/brand/')) return <BrandPage />;
  if (currentRoute === '/privacy') return <PrivacyPage />;
  if (currentRoute === '/terms') return <TermsPage />;
  if (currentRoute === '/sitemap') return <SitemapPage />;

  return <HomePage />;
};

export function App() {
  // Check if loaded on admin route to render clean isolated Admin App
  const hash = window.location.hash.replace('#', '') || '/';
  const isAdminRoute = hash.startsWith('/admin');

  if (isAdminRoute) {
    return <AdminApp />;
  }

  return (
    <PortalProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1 }}>
          <PageRenderer />
        </main>
        <Footer />
        <FloatingActions />
        <CategoryModal />
        <ValuationModal />
        <AuthModal />
      </div>
    </PortalProvider>
  );
}

export default App;

