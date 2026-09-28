import React, { useState } from 'react';
import {
  Layers,
  Clock,
  ShieldAlert,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useData } from '../context/DataContext.tsx';
import { QuickAppointmentSection } from '../components/booking/QuickAppointmentSection.tsx';
import { AdvertisementBanner } from '../components/common/AdvertisementBanner.tsx';

interface MSCTPageProps {
  onNavigate: (route: string, param?: string) => void;
}

export const MSCTPage: React.FC<MSCTPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { msct, doctors } = useData();

  const [filterCat, setFilterCat] = useState('all');

  const categories = ['all', 'Nevrologik MSCT', 'Torakal MSCT', 'Abdominal MSCT', 'Ortopedik MSCT', 'Vaskulyar MSCT', 'LOR MSCT'];

  const filtered = msct.filter((m) => {
    if (!m.active) return false;
    if (filterCat !== 'all' && m.category !== filterCat) return false;
    return true;
  });

  const radiologist = doctors.find((d) => d.specialtyKey === 'msct');

  return (
    <div className="py-10 md:py-16 bg-[#F6FAFD] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-12 relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold mb-4">
              <Layers className="w-4 h-4 text-teal-300" />
              <span>128 qatlamli zamonaviy tomograf</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 leading-tight">
              {t.msct.title}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              {t.msct.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('msct-booking');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                MSCT qabuliga yozilish
              </button>
            </div>
          </div>
        </div>

        {/* Required Medical Disclaimer */}
        <div className="mb-10 p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-1">Muhim ma’lumot va ko‘rsatma:</span>
            <p>{t.msct.disclaimer}</p>
          </div>
        </div>

        {/* Ad Banner for MSCT */}
        <div className="mb-12">
          <AdvertisementBanner placement="msct_page" onNavigate={onNavigate} />
        </div>

        {/* Technology Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">0.5 mm aniqlik</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              128 qatlamli skanerlash mikroskopik o‘zgarishlar va qon quyilishlarni dastlabki bosqichda aniqlash imkonini beradi.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Minimal nurlanish</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dozani avtomatik hisoblash protokoli bemor salomatligini asrab, nurlanishni 60% gacha kamaytiradi.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Natija 2 soatda</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Radiolog shifokor xulosasi, plyonka va barcha 3D tasvirlar yozilgan CD disk 2 soat ichida beriladi.
            </p>
          </div>
        </div>

        {/* MSCT Catalog */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                Diagnostika turlari
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A2540]">
                MSCT tekshiruvlari katalogi va narxlari
              </h2>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 no-scrollbar">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilterCat(c)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    filterCat === c
                      ? 'bg-[#0B5ED7] text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {c === 'all' ? 'Barchasi' : c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      ~{item.durationMinutes} daqiqa
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-2">
                    {item.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Preparation Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1.5 mb-4">
                    <p>
                      <span className="font-bold text-slate-900">Tayyorgarlik:</span> {item.preparation}
                    </p>
                    {item.contrastAvailable && (
                      <p className="text-teal-700 font-medium">
                        <span className="font-bold">Kontrast:</span> {item.contrastDetails}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Tekshiruv narxi:</span>
                    <span className="text-lg font-black text-[#0B5ED7]">
                      {item.price.toLocaleString()} so‘m
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigate('booking', `service=${item.id}`)}
                    className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-[#0B5ED7] text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-2"
                  >
                    <span>Yozilish</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Radiologist Expert Highlight */}
        {radiologist && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 mb-16 flex flex-col sm:flex-row items-center gap-6">
            <img
              src={radiologist.photo}
              alt={radiologist.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 shadow-md"
            />
            <div className="flex-1 text-center sm:text-left">
              <span className="text-xs font-bold text-blue-600 block mb-1">Bo‘lim boshlig‘i xulosasi</span>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{radiologist.name}</h3>
              <p className="text-xs text-slate-500 font-medium mb-3">{radiologist.qualification}</p>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                Barcha MSCT tasvirlari xalqaro radiologiya assotsiatsiyasi protokoli asosida tahlil qilinib, shaxsiy shifokor konsultatsiyasi bilan taqdim etiladi.
              </p>
            </div>
          </div>
        )}

        {/* Booking */}
        <div id="msct-booking">
          <QuickAppointmentSection initialDoctorId={radiologist?.id} embedded={true} />
        </div>
      </div>
    </div>
  );
};
