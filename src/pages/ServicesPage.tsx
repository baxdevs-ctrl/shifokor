import React, { useState } from 'react';
import { Search, Clock, Activity, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useData } from '../context/DataContext.tsx';
import { ServiceCategory } from '../types/index.ts';

interface ServicesPageProps {
  initialCategory?: string;
  onNavigate: (route: string, param?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ initialCategory, onNavigate }) => {
  const { t } = useLanguage();
  const { services } = useData();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>(initialCategory || 'all');

  const categories = [
    { key: 'all', label: 'Barcha xizmatlar' },
    { key: 'surgery', label: 'Jarrohlik' },
    { key: 'ent', label: 'LOR / ENT' },
    { key: 'ophthalmology', label: 'Oftalmologiya' },
    { key: 'dentistry', label: 'Stomatologiya' },
    { key: 'cardiology', label: 'Kardiologiya' },
    { key: 'neurology', label: 'Nevrologiya' },
    { key: 'other', label: 'UZI & Terapiya' },
  ];

  const filteredServices = services.filter((srv) => {
    if (!srv.active) return false;
    if (selectedCat !== 'all' && srv.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = srv.name.toLowerCase().includes(q);
      const matchDesc = srv.description.toLowerCase().includes(q);
      const matchCat = srv.categoryNameUz.toLowerCase().includes(q);
      return matchName || matchDesc || matchCat;
    }
    return true;
  });

  return (
    <div className="py-10 md:py-16 bg-[#F6FAFD] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-[#0A2540] tracking-tight mb-3">
            {t.services.title}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t.services.subtitle}
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.services.searchPlaceholder}
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

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-slate-200">
            <p className="font-bold text-slate-800 text-lg mb-1">Xizmat topilmadi</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((srv) => (
              <div
                key={srv.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {srv.categoryNameUz}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {srv.durationMinutes} {t.services.minutes}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-2 leading-snug">
                    {srv.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {srv.description}
                  </p>

                  {srv.preparationInstructions && (
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-[11px] text-amber-900 mb-5 leading-relaxed">
                      <span className="font-bold block mb-0.5">Tayyorgarlik ko‘rsatmasi:</span>
                      {srv.preparationInstructions}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Xizmat narxi:</span>
                    <span className="text-base font-extrabold text-[#0B5ED7]">
                      {srv.price.toLocaleString()} so‘m
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigate('booking', `service=${srv.id}`)}
                    className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-[#0B5ED7] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span>{t.services.bookService}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
