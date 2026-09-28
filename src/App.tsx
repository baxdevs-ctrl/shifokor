import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { DataProvider } from './context/DataContext.tsx';

// Layout & Global Components
import { Header } from './components/layout/Header.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { MobileStickyBar } from './components/layout/MobileStickyBar.tsx';
import { GlobalSearchModal } from './components/common/GlobalSearchModal.tsx';
import { AIAssistantWidget } from './components/common/AIAssistantWidget.tsx';
import { PromotionPopupModal } from './components/common/PromotionPopupModal.tsx';

// Public Pages
import { HomePage } from './pages/HomePage.tsx';
import { DoctorsPage } from './pages/DoctorsPage.tsx';
import { DoctorDetailsPage } from './pages/DoctorDetailsPage.tsx';
import { ServicesPage } from './pages/ServicesPage.tsx';
import { SurgeryPage } from './pages/SurgeryPage.tsx';
import { LORPage } from './pages/LORPage.tsx';
import { MSCTPage } from './pages/MSCTPage.tsx';
import { LaboratoryPage } from './pages/LaboratoryPage.tsx';
import { LaboratoryDetailPage } from './pages/LaboratoryDetailPage.tsx';
import { PromotionsPage } from './pages/PromotionsPage.tsx';
import { PromotionDetailPage } from './pages/PromotionDetailPage.tsx';
import { NewsPage } from './pages/NewsPage.tsx';
import { NewsDetailPage } from './pages/NewsDetailPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { BookingPage } from './pages/BookingPage.tsx';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage.tsx';
import { TermsPage } from './pages/TermsPage.tsx';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage.tsx';
import { AdminLayout } from './pages/admin/AdminLayout.tsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.tsx';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage.tsx';
import { AdminPatientsPage } from './pages/admin/AdminPatientsPage.tsx';
import { AdminDoctorsPage } from './pages/admin/AdminDoctorsPage.tsx';
import { AdminServicesPage } from './pages/admin/AdminServicesPage.tsx';
import { AdminLaboratoryPage } from './pages/admin/AdminLaboratoryPage.tsx';
import { AdminMSCTPage } from './pages/admin/AdminMSCTPage.tsx';
import { AdminPromotionsPage } from './pages/admin/AdminPromotionsPage.tsx';
import { AdminAdvertisementsPage } from './pages/admin/AdminAdvertisementsPage.tsx';
import { AdminNewsPage } from './pages/admin/AdminNewsPage.tsx';
import { AdminContactsPage } from './pages/admin/AdminContactsPage.tsx';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage.tsx';

function AppContent() {
  const { admin, token } = useAuth();

  // Route state
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParam, setRouteParam] = useState<string | undefined>(undefined);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Sync with browser history and hash/path if present
  useEffect(() => {
    const parseUrl = () => {
      const path = window.location.pathname.replace(/^\//, '');
      if (!path || path === '') {
        setCurrentRoute('home');
      } else if (path === 'admin/login') {
        setCurrentRoute('admin-login');
      } else if (path.startsWith('admin/')) {
        const adminSub = path.replace('admin/', '');
        setCurrentRoute(`admin-${adminSub}`);
      } else if (path.startsWith('doctors/')) {
        setCurrentRoute('doctor-details');
        setRouteParam(path.replace('doctors/', ''));
      } else if (path.startsWith('laboratory/')) {
        setCurrentRoute('lab-details');
        setRouteParam(path.replace('laboratory/', ''));
      } else if (path.startsWith('promotions/')) {
        setCurrentRoute('promotion-details');
        setRouteParam(path.replace('promotions/', ''));
      } else if (path.startsWith('news/')) {
        setCurrentRoute('news-details');
        setRouteParam(path.replace('news/', ''));
      } else {
        setCurrentRoute(path);
      }
    };

    parseUrl();
    window.addEventListener('popstate', parseUrl);
    return () => window.removeEventListener('popstate', parseUrl);
  }, []);

  const handleNavigate = (route: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentRoute(route);
    setRouteParam(param);

    // Update browser URL history state cleanly
    let newPath = '/';
    if (route === 'home') newPath = '/';
    else if (route === 'admin-login') newPath = '/admin/login';
    else if (route.startsWith('admin-')) newPath = `/admin/${route.replace('admin-', '')}`;
    else if (route === 'doctor-details' && param) newPath = `/doctors/${param}`;
    else if (route === 'lab-details' && param) newPath = `/laboratory/${param}`;
    else if (route === 'promotion-details' && param) newPath = `/promotions/${param}`;
    else if (route === 'news-details' && param) newPath = `/news/${param}`;
    else newPath = `/${route}${param ? `?${param}` : ''}`;

    window.history.pushState(null, '', newPath);
  };

  const isAdminRoute = currentRoute.startsWith('admin-') && currentRoute !== 'admin-login';

  // Protect admin routes: if not logged in, show login page
  if (isAdminRoute && !token) {
    return <AdminLoginPage onNavigate={handleNavigate} />;
  }

  // Admin section
  if (isAdminRoute) {
    return (
      <AdminLayout currentRoute={currentRoute} onNavigate={handleNavigate}>
        {currentRoute === 'admin-dashboard' && <AdminDashboard onNavigate={handleNavigate} />}
        {currentRoute === 'admin-appointments' && <AdminAppointmentsPage />}
        {currentRoute === 'admin-patients' && <AdminPatientsPage />}
        {currentRoute === 'admin-doctors' && <AdminDoctorsPage />}
        {currentRoute === 'admin-services' && <AdminServicesPage />}
        {currentRoute === 'admin-laboratory' && <AdminLaboratoryPage />}
        {currentRoute === 'admin-msct' && <AdminMSCTPage />}
        {currentRoute === 'admin-promotions' && <AdminPromotionsPage />}
        {currentRoute === 'admin-advertisements' && <AdminAdvertisementsPage />}
        {currentRoute === 'admin-news' && <AdminNewsPage />}
        {currentRoute === 'admin-contacts' && <AdminContactsPage />}
        {currentRoute === 'admin-settings' && <AdminSettingsPage />}
      </AdminLayout>
    );
  }

  if (currentRoute === 'admin-login') {
    return <AdminLoginPage onNavigate={handleNavigate} />;
  }

  // Public Patient Website
  return (
    <div className="min-h-screen flex flex-col bg-[#F6FAFD] text-slate-800 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Sticky Header */}
      <Header
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main Page View */}
      <main className="flex-1 w-full">
        {currentRoute === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentRoute === 'doctors' && <DoctorsPage onNavigate={handleNavigate} />}
        {currentRoute === 'doctor-details' && (
          <DoctorDetailsPage doctorId={routeParam || ''} onNavigate={handleNavigate} />
        )}
        {currentRoute === 'services' && (
          <ServicesPage initialCategory={routeParam} onNavigate={handleNavigate} />
        )}
        {currentRoute === 'surgery' && <SurgeryPage onNavigate={handleNavigate} />}
        {currentRoute === 'lor' && <LORPage onNavigate={handleNavigate} />}
        {currentRoute === 'msct' && <MSCTPage onNavigate={handleNavigate} />}
        {currentRoute === 'laboratory' && <LaboratoryPage onNavigate={handleNavigate} />}
        {currentRoute === 'lab-details' && (
          <LaboratoryDetailPage testId={routeParam || ''} onNavigate={handleNavigate} />
        )}
        {currentRoute === 'promotions' && <PromotionsPage onNavigate={handleNavigate} />}
        {currentRoute === 'promotion-details' && (
          <PromotionDetailPage promoId={routeParam || ''} onNavigate={handleNavigate} />
        )}
        {currentRoute === 'news' && <NewsPage onNavigate={handleNavigate} />}
        {currentRoute === 'news-details' && (
          <NewsDetailPage newsId={routeParam || ''} onNavigate={handleNavigate} />
        )}
        {currentRoute === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {currentRoute === 'contact' && <ContactPage onNavigate={handleNavigate} />}
        {currentRoute === 'booking' && <BookingPage param={routeParam} onNavigate={handleNavigate} />}
        {currentRoute === 'privacy' && <PrivacyPolicyPage onNavigate={handleNavigate} />}
        {currentRoute === 'terms' && <TermsPage onNavigate={handleNavigate} />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Sticky CTA Bar */}
      <MobileStickyBar onNavigate={handleNavigate} />

      {/* AI Assistant Floating Widget */}
      <AIAssistantWidget />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectResult={handleNavigate}
      />

      {/* Optional Promotion Popup Modal */}
      <PromotionPopupModal onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <AppContent />
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
