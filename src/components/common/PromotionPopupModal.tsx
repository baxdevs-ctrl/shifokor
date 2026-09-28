import React, { useState, useEffect } from 'react';
import { X, Flame, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext.tsx';

interface PromotionPopupModalProps {
  onNavigate: (route: string, param?: string) => void;
}

export const PromotionPopupModal: React.FC<PromotionPopupModalProps> = ({ onNavigate }) => {
  const { advertisements, settings } = useData();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if popup ad is enabled in clinic settings
    if (settings && settings.popupAdEnabled === false) {
      return;
    }

    const dismissed = sessionStorage.getItem('medcare_popup_dismissed');
    if (dismissed) return;

    const nowStr = new Date().toISOString().split('T')[0];
    const popupAd = advertisements.find(
      (a) => a.active && a.placement === 'popup' && a.startDate <= nowStr && a.endDate >= nowStr
    );

    if (popupAd) {
      // Delay popup by 4 seconds so it doesn't immediately irritate the user
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [advertisements, settings]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('medcare_popup_dismissed', 'true');
  };

  const nowStr = new Date().toISOString().split('T')[0];
  const popupAd = advertisements.find(
    (a) => a.active && a.placement === 'popup' && a.startDate <= nowStr && a.endDate >= nowStr
  );

  if (!isOpen || !popupAd) return null;

  const handleAction = () => {
    handleClose();
    if (popupAd.buttonUrl.startsWith('/')) {
      const parts = popupAd.buttonUrl.replace('/', '').split('?');
      onNavigate(parts[0], parts[1]);
    } else {
      window.location.href = popupAd.buttonUrl;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in zoom-in-95">
        <button
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center shadow-md transition-colors"
          aria-label="Yopish"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative h-48 sm:h-56 bg-slate-100 overflow-hidden">
          <img
            src={popupAd.image}
            alt={popupAd.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-xs shadow-md">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Maxsus mavsumiy taklif</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
            {popupAd.title}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            {popupAd.subtitle}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Keyinroq
            </button>
            <button
              onClick={handleAction}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0B5ED7] hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors"
            >
              <span>{popupAd.buttonText || 'Batafsil'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
