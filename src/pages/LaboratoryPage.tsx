import React, { useState } from 'react';
import {
  FlaskConical,
  Search,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Send,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useData } from '../context/DataContext.tsx';
import { LabCategory } from '../types/index.ts';
import { AdvertisementBanner } from '../components/common/AdvertisementBanner.tsx';

interface LaboratoryPageProps {
  onNavigate: (route: string, param?: string) => void;
}

export const LaboratoryPage: React.FC<LaboratoryPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { laboratory, settings } = useData();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: 'Barcha tahlillar' },
    { key: 'Umumiy tahlillar', label: 'Umumiy tahlillar' },
    { key: 'Biokimyo', label: 'Biokimyo' },
    { key: 'Gormonlar', label: 'Gormonlar' },
    { key: 'Immunologiya', label: 'Immunologiya' },
    { key: 'Vitaminlar', label: 'Vitaminlar' },
    { key: 'Infeksiya testlari', label: 'Infeksiya testlari' },
  ];

  const filteredTests = laboratory.filter((test) => {
    if (!test.active) return false;
    if (selectedCat !== 'all' && test.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = test.name.toLowerCase().includes(q);
      const matchCode = test.code.toLowerCase().includes(q);
      const matchDesc = test.description.toLowerCase().includes(q);
      return matchName || matchCode || matchDesc;
    }
    return true;
  });

  return (
    <div className="py-10 md:py-16 bg-[#F6FAFD] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-[#0A2540] rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-12 relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold mb-4">
              <FlaskConical className="w-4 h-4" />
              <span>Avtomatlashtirilgan laboratoriya</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 leading-tight">
              {t.laboratory.title}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              {t.laboratory.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('booking', 'type=lab')}
                className="px-6 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                Tahlil topshirishga yozilish
              </button>
              {settings?.telegram && (
                <a
                  href={`https://t.me/${settings.telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4 text-sky-400" />
                  <span>Natijalarni Telegramda olish</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Ad Banner */}
        <div className="mb-10">
          <AdvertisementBanner placement="laboratory_page" onNavigate={onNavigate} />
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.laboratory.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white text-slate-800 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setSelectedCat(c.key)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCat === c.key
                    ? 'bg-[#0B5ED7] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Laboratory Tests Grid */}
        {filteredTests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-slate-200">
            <p className="font-bold text-slate-800 text-lg mb-1">Tahlil topilmadi</p>
            <p className="text-xs text-slate-500 mb-4">
              Iltimos, boshqa toifani tanlang yoki qidiruv so‘zini o‘zgartiring.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCat('all');
              }}
              className="px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl hover:bg-blue-100 transition-colors"
            >
              Filtrlarni tozalash
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                      {test.code}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {test.category}
                    </span>
                  </div>

                  <h3
                    onClick={() => onNavigate('lab-details', test.id)}
                    className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-2 cursor-pointer leading-snug"
                  >
                    {test.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {test.description}
                  </p>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5 mb-5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Muddati:</span>
                      <span className="font-semibold text-slate-800">{test.resultDurationText}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Namuna:</span>
                      <span className="font-medium text-slate-700">{test.sampleType}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Tahlil narxi:</span>
                    <span className="text-base font-extrabold text-[#0B5ED7]">
                      {test.price.toLocaleString()} so‘m
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onNavigate('lab-details', test.id)}
                      className="py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
                    >
                      Batafsil
                    </button>
                    <button
                      onClick={() => onNavigate('booking', `service=${test.id}`)}
                      className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-[#0B5ED7] text-white text-xs font-bold transition-colors shadow-sm"
                    >
                      Yozilish
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quality Standards Guarantee */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Xalqaro sifat nazorati (ISO 15189)
              </h3>
              <p className="text-xs text-slate-500 max-w-xl mt-1 leading-relaxed">
                Laboratoriyamiz har kuni sifat nazorati kalibratsiyasidan o‘tadi. Natijalar shifokor-laborant tomonidan tekshirilib tasdiqlanadi.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('booking', 'type=lab')}
            className="px-6 py-3 bg-[#0B5ED7] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors shrink-0"
          >
            Tahlil topshirishga yozilish
          </button>
        </div>
      </div>
    </div>
  );
};
