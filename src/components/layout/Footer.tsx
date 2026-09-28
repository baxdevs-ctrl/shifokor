import React from 'react';
import {
  Activity,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldAlert,
  Send,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useData } from '../../context/DataContext.tsx';

interface FooterProps {
  onNavigate: (route: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { settings } = useData();

  return (
    <footer className="bg-[#0A2540] text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2">
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 cursor-pointer mb-4"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white shadow-md">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
                {settings?.name || 'MEDCARE'}
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              </span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              {settings?.footerText ||
                'MEDCARE xususiy tibbiyot markazi — xalqaro standartlarga mos diagnostika, zamonaviy jarrohlik va yuqori malakali shifokorlar jamoasi.'}
            </p>

            <div className="flex items-center gap-3">
              {settings?.telegram && (
                <a
                  href={`https://t.me/${settings.telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center text-white transition-colors"
                  aria-label="Telegram"
                >
                  <Send className="w-4 h-4" />
                </a>
              )}
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-pink-600 flex items-center justify-center text-white transition-colors text-xs font-bold"
                  aria-label="Instagram"
                >
                  IG
                </a>
              )}
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-800 flex items-center justify-center text-white transition-colors text-xs font-bold"
                  aria-label="Facebook"
                >
                  FB
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Navigatsiya
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-teal-400 transition-colors"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('doctors')}
                  className="hover:text-teal-400 transition-colors"
                >
                  {t.nav.doctors}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-teal-400 transition-colors"
                >
                  {t.nav.services}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('msct')}
                  className="hover:text-teal-400 transition-colors"
                >
                  {t.nav.msct}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('laboratory')}
                  className="hover:text-teal-400 transition-colors"
                >
                  {t.nav.laboratory}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('promotions')}
                  className="hover:text-teal-400 transition-colors"
                >
                  {t.nav.promotions}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('news')}
                  className="hover:text-teal-400 transition-colors"
                >
                  {t.nav.news}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-teal-400 transition-colors"
                >
                  {t.nav.about}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Medical Directions */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Yo‘nalishlar
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('surgery')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Laparoskopik jarrohlik
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('lor')}
                  className="hover:text-teal-400 transition-colors"
                >
                  LOR / Otolaringologiya
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('msct')}
                  className="hover:text-teal-400 transition-colors"
                >
                  128 qatlamli MSCT / KT
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('laboratory')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Avtomatlashtirilgan laboratoriya
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services', 'ophthalmology')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Oftalmologiya (ko‘z ko‘rigi)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services', 'dentistry')}
                  className="hover:text-teal-400 transition-colors"
                >
                  Zamonaviy stomatologiya
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('booking')}
                  className="text-teal-400 font-semibold hover:underline"
                >
                  Onlayn qabulga yozilish →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts & Emergency */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              {t.nav.contact}
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 text-xs">
                  {settings?.address || "Toshkent shahri, Amir Temur shox ko'chasi, 107-B"}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <a
                  href={`tel:${settings?.phone || '+998712008800'}`}
                  className="hover:text-white font-medium"
                >
                  {settings?.phone || '+998 71 200 88 00'}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a
                  href={`mailto:${settings?.email || 'info@medcare.uz'}`}
                  className="hover:text-white"
                >
                  {settings?.email || 'info@medcare.uz'}
                </a>
              </li>
              <li className="flex items-start gap-2.5 pt-2 border-t border-slate-800">
                <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  <p>{settings?.workingHoursWeekday || 'Dush - Shan: 08:00 - 20:00'}</p>
                  <p className="text-slate-400 mt-0.5">{settings?.workingHoursWeekend}</p>
                </div>
              </li>
            </ul>

            <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{settings?.emergencyInfo || 'Tez tibbiy yordam: 103'}</span>
            </div>
          </div>
        </div>

        {/* Mandatory Medical Disclaimer Banner */}
        <div className="my-8 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 text-center leading-relaxed">
          <p className="font-medium text-slate-300 mb-1">Muhim tibbiy ogohlantirish:</p>
          <p>
            {settings?.medicalDisclaimer ||
              'Saytdagi ma’lumotlar umumiy ma’lumot berish maqsadida taqdim etilgan. Tibbiy tashxis va davolash bo‘yicha yakuniy qarorni malakali tibbiyot mutaxassisi beradi.'}
          </p>
        </div>

        {/* Bottom copyright & links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 pt-4">
          <p>
            © {new Date().getFullYear()} {settings?.name || 'MEDCARE'}. {t.footer.rights}
          </p>

          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-white transition-colors"
            >
              {t.footer.privacyPolicy}
            </button>
            <button
              onClick={() => onNavigate('terms')}
              className="hover:text-white transition-colors"
            >
              {t.footer.terms}
            </button>
            <button
              onClick={() => onNavigate('admin-login')}
              className="hover:text-white flex items-center gap-1 text-slate-400 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
