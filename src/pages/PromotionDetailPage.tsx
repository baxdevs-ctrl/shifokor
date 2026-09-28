import React from 'react';
import { ArrowLeft, Clock, Flame, Calendar, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useData } from '../context/DataContext.tsx';
import { QuickAppointmentSection } from '../components/booking/QuickAppointmentSection.tsx';

interface PromotionDetailPageProps {
  promoId: string;
  onNavigate: (route: string, param?: string) => void;
}

export const PromotionDetailPage: React.FC<PromotionDetailPageProps> = ({
  promoId,
  onNavigate,
}) => {
  const { t } = useLanguage();
  const { promotions } = useData();

  const promo = promotions.find((p) => p.id === promoId || p.slug === promoId);

  if (!promo) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Aksiya topilmadi</h2>
        <p className="text-slate-500 text-sm mb-6">Ushbu aksiya tugagan yoki o‘chirilgan bo‘lishi mumkin.</p>
        <button
          onClick={() => onNavigate('promotions')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
        >
          Aksiyalarga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="py-10 md:py-16 bg-[#F6FAFD] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => onNavigate('promotions')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Barcha aksiyalarga qaytish</span>
        </button>

        <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 mb-12">
          <div className="relative aspect-[21/9] bg-slate-100 overflow-hidden">
            <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-rose-600 text-white font-extrabold text-sm shadow-md">
              -{promo.discountPercent}% chegirma
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <span className="text-xs font-bold text-amber-600 block mb-1">
              {promo.subtitle}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4 leading-tight">
              {promo.title}
            </h1>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 mb-6">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>
                Amal qilish muddati: {promo.startDate} dan {promo.endDate} gacha
              </span>
            </div>

            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed mb-8">
              <p>{promo.description}</p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 leading-relaxed">
              <span className="font-bold block mb-1">Qabul shartlari:</span>
              Chegirma qabulga onlayn yozilgan yoki administratorga aksiya haqida xabar bergan barcha bemorlar uchun amal qiladi. Joylar soni cheklangan bo‘lishi mumkin.
            </div>
          </div>
        </div>

        {/* Quick Booking for this promotion */}
        <div>
          <h2 className="text-2xl font-black text-[#0A2540] mb-4">
            Aksiya doirasida qabulga yozilish
          </h2>
          <QuickAppointmentSection embedded={true} />
        </div>
      </div>
    </div>
  );
};
