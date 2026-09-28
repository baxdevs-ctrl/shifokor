import React, { useState, useEffect } from 'react';
import {
  Phone,
  Calendar,
  Menu,
  X,
  Search,
  ChevronDown,
  Globe,
  Stethoscope,
  Activity,
  Layers,
  FlaskConical,
  Flame,
  Newspaper,
  Info,
  Clock,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useData } from '../../context/DataContext.tsx';
import { Language } from '../../types/index.ts';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string, param?: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate, onOpenSearch }) => {
  const { language, setLanguage, t } = useLanguage();
  const { settings } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t.nav.home, route: 'home' },
    { label: t.nav.doctors, route: 'doctors' },
    { label: t.nav.services, route: 'services' },
    { label: t.nav.msct, route: 'msct' },
    { label: t.nav.laboratory, route: 'laboratory' },
    { label: t.nav.promotions, route: 'promotions' },
    { label: t.nav.news, route: 'news' },
    { label: t.nav.contact, route: 'contact' },
  ];

  const handleNavClick = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'uz', label: 'UZ' },
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <>
      {/* Top micro bar for clinic info & emergency */}
      <div className="bg-[#0A2540] text-slate-300 text-xs py-1.5 px-4 hidden md:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              {settings?.address || "Toshkent shahri, Amir Temur shox ko'chasi 107-B"}
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              {settings?.workingHoursWeekday || 'Dush - Shan: 08:00 - 20:00'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-teal-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              128 qatlamli MSCT & ISO 15189 laboratoriya
            </span>
            <button
              onClick={() => onNavigate('admin-login')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {t.nav.adminPanel}
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5'
            : 'bg-white border-b border-slate-100 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0A2540] flex items-center gap-1">
                {settings?.name || 'MEDCARE'}
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:block">
                {settings?.tagline || 'Zamonaviy tibbiyot markazi'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNavClick(item.route)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#0B5ED7] bg-blue-50 font-semibold'
                      : 'text-slate-700 hover:text-[#0B5ED7] hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Qidiruv (Ctrl+K)"
              aria-label="Qidirish"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{language.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-24 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in zoom-in-95">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-blue-50 ${
                        language === l.code ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Phone Call Link (Desktop) */}
            <a
              href={`tel:${settings?.phone || '+998712008800'}`}
              className="hidden xl:flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-[#0A2540] hover:text-[#0B5ED7] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#0B5ED7]">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold leading-tight">
                {settings?.phone || '+998 71 200 88 00'}
              </span>
            </a>

            {/* Primary Appointment CTA */}
            <button
              onClick={() => handleNavClick('booking')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0B5ED7] to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/25 hover:shadow-lg transition-all active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.nav.bookAppointment}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Menyu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-4">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {navItems.map((item) => (
                <button
                  key={item.route}
                  onClick={() => handleNavClick(item.route)}
                  className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    currentRoute === item.route
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <a
                href={`tel:${settings?.phone || '+998712008800'}`}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 text-slate-800 rounded-xl font-semibold text-sm"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                {settings?.phone || '+998 71 200 88 00'}
              </a>

              <button
                onClick={() => handleNavClick('booking')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#0B5ED7] text-white rounded-xl font-bold text-sm shadow-md"
              >
                <Calendar className="w-4 h-4" />
                {t.nav.bookAppointment}
              </button>

              <button
                onClick={() => handleNavClick('admin-login')}
                className="text-center text-xs text-slate-500 py-1 hover:text-slate-800"
              >
                {t.nav.adminPanel}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
