import React from 'react';
import { Calendar, Phone, Send } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useData } from '../../context/DataContext.tsx';

interface MobileStickyBarProps {
  onNavigate: (route: string) => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { settings } = useData();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 shadow-2xl flex items-center gap-2">
      {/* Phone Call */}
      <a
        href={`tel:${settings?.phone || '+998712008800'}`}
        className="flex-1 flex flex-col items-center justify-center py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
        aria-label="Qo'ng'iroq qilish"
      >
        <Phone className="w-5 h-5 text-blue-600 mb-0.5" />
        <span className="text-[10px] font-bold">Qo‘ng‘iroq</span>
      </a>

      {/* Telegram */}
      {settings?.telegram && (
        <a
          href={`https://t.me/${settings.telegram.replace('@', '')}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-2 px-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 transition-colors"
          aria-label="Telegram"
        >
          <Send className="w-5 h-5 text-sky-600 mb-0.5" />
          <span className="text-[10px] font-bold">Telegram</span>
        </a>
      )}

      {/* Primary Booking CTA */}
      <button
        onClick={() => onNavigate('booking')}
        className="flex-[2] flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-gradient-to-r from-[#0B5ED7] to-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/25 active:scale-95 transition-transform"
      >
        <Calendar className="w-4 h-4" />
        <span>{t.nav.bookAppointment}</span>
      </button>
    </div>
  );
};
