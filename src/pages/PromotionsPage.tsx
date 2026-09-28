import React from 'react';
import { Flame, Clock, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useData } from '../context/DataContext.tsx';

interface PromotionsPageProps {
  onNavigate: (route: string, param?: string) => void;
}

export const PromotionsPage: React.FC<PromotionsPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { promotions } = useData();

  const nowStr = new Date().toISOString().split('T')[0];
  const activePromos = promotions.filter(
    (p) => p.active && p.startDate <= nowStr && p.endDate >= nowStr
  );

  return (
    <div className="py-10 md:py-16 bg-[#F6FAFD] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-3">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Klinika aksiyalari</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0A2540] tracking-tight mb-3">
            {t.promotions.title}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t.promotions.subtitle}
          </p>
        </div>

        {activePromos.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-slate-200">
            <p className="font-bold text-slate-800 text-lg mb-1">Ayni paytda faol aksiyalar yo‘q</p>
            <p className="text-xs text-slate-500">
              Yaqin kunlarda yangi maxsus takliflar va chegirmalar e’lon qilinadi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activePromos.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-600 text-white font-extrabold text-xs shadow-md">
                      -{p.discountPercent}% chegirma
                    </div>
                    {p.badge && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 text-slate-800 font-bold text-[10px]">
                        {p.badge}
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-7">
                    <span className="text-[11px] font-bold text-amber-600 block mb-1">
                      {p.subtitle}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug mb-3">
                      {p.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-6">
                      {p.description}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-500 mb-6">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Amal qilish muddati:
                      </span>
                      <span className="font-bold text-slate-800">{p.endDate} gacha</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-7 pt-0 flex gap-2">
                  <button
                    onClick={() => onNavigate('promotion-details', p.id)}
                    className="flex-1 py-3 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors text-center"
                  >
                    {t.promotions.detailsBtn}
                  </button>
                  <button
                    onClick={() => {
                      if (p.ctaLink.startsWith('/')) {
                        const parts = p.ctaLink.replace('/', '').split('?');
                        onNavigate(parts[0], parts[1]);
                      } else {
                        onNavigate('booking');
                      }
                    }}
                    className="flex-1 py-3 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-colors text-center shadow-sm"
                  >
                    {p.ctaText || t.promotions.bookBtn}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
