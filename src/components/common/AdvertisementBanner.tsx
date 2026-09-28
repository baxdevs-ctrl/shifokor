import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AdPlacement } from '../../types/index.ts';
import { useData } from '../../context/DataContext.tsx';

interface AdvertisementBannerProps {
  placement: AdPlacement;
  className?: string;
  onNavigate?: (route: string, param?: string) => void;
}

export const AdvertisementBanner: React.FC<AdvertisementBannerProps> = ({
  placement,
  className = '',
  onNavigate,
}) => {
  const { advertisements } = useData();
  const nowStr = new Date().toISOString().split('T')[0];

  const activeAds = advertisements.filter(
    (a) => a.active && a.placement === placement && a.startDate <= nowStr && a.endDate >= nowStr
  );

  if (activeAds.length === 0) return null;

  const ad = activeAds[0];

  const handleClick = (e: React.MouseEvent) => {
    if (ad.buttonUrl.startsWith('/') && onNavigate) {
      e.preventDefault();
      const parts = ad.buttonUrl.replace('/', '').split('?');
      onNavigate(parts[0], parts[1]);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-[#0A2540] text-white shadow-xl ${className}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-25"
        style={{ backgroundImage: `url(${ad.image})` }}
      />
      
      <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Klinika yangiligi / Maxsus taklif</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
            {ad.title}
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {ad.subtitle}
          </p>
        </div>

        <a
          href={ad.buttonUrl}
          onClick={handleClick}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#0A2540] font-bold text-sm shadow-lg shadow-teal-500/25 transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <span>{ad.buttonText || 'Batafsil'}</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
