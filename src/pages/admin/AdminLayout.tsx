import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  Activity,
  FlaskConical,
  Layers,
  Flame,
  Megaphone,
  Newspaper,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';

interface AdminLayoutProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentRoute,
  onNavigate,
  children,
}) => {
  const { admin, logout } = useAuth();
  const { settings } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarLinks = [
    { label: 'Dashboard', route: 'admin-dashboard', icon: LayoutDashboard },
    { label: 'Qabullar', route: 'admin-appointments', icon: Calendar },
    { label: 'Bemorlar', route: 'admin-patients', icon: Users },
    { label: 'Shifokorlar', route: 'admin-doctors', icon: UserCheck },
    { label: 'Xizmatlar', route: 'admin-services', icon: Activity },
    { label: 'Laboratoriya', route: 'admin-laboratory', icon: FlaskConical },
    { label: 'MSCT / KT', route: 'admin-msct', icon: Layers },
    { label: 'Aksiyalar', route: 'admin-promotions', icon: Flame },
    { label: 'Reklama', route: 'admin-advertisements', icon: Megaphone },
    { label: 'Yangiliklar', route: 'admin-news', icon: Newspaper },
    { label: 'Xabarlar', route: 'admin-contacts', icon: MessageSquare },
    { label: 'Sozlamalar', route: 'admin-settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    onNavigate('admin-login');
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col lg:flex-row text-slate-800">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0A2540] text-slate-300 shrink-0 select-none">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('admin-dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white shadow-md">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-white text-base tracking-tight">MEDCARE</span>
              <span className="text-[10px] block text-teal-400 font-semibold uppercase">Admin Panel</span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {sidebarLinks.map((item) => {
            const Icon = item.icon;
            const active = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => onNavigate(item.route)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-[#0B5ED7] text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Klinika saytiga o‘tish</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tizim Boshqaruvi
              </p>
              <h2 className="text-sm font-bold text-slate-800">
                {sidebarLinks.find((l) => l.route === currentRoute)?.label || 'Boshqaruv'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Saytni ko‘rish</span>
            </button>

            {/* Admin Profile */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div className="hidden md:block text-left text-xs">
                <p className="font-bold text-slate-900 leading-tight">{admin?.name || 'Administrator'}</p>
                <p className="text-[10px] text-slate-400">{admin?.email || 'admin@medcare.uz'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0A2540] text-slate-300 p-4 border-b border-slate-800 animate-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-white text-sm">MEDCARE Menyu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5 mb-4">
              {sidebarLinks.map((item) => (
                <button
                  key={item.route}
                  onClick={() => {
                    onNavigate(item.route);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left p-2.5 rounded-xl text-xs font-semibold ${
                    currentRoute === item.route
                      ? 'bg-[#0B5ED7] text-white'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between">
              <button
                onClick={() => onNavigate('home')}
                className="text-xs text-slate-400 hover:text-white py-1"
              >
                Saytga qaytish
              </button>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-400 font-bold py-1"
              >
                Chiqish
              </button>
            </div>
          </div>
        )}

        {/* Subpage content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
