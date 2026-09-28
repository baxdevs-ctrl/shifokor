import React, { useState } from 'react';
import { Search, Filter, Phone, Send, Calendar, Star, Award, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useData } from '../context/DataContext.tsx';
import { ServiceCategory } from '../types/index.ts';

interface DoctorsPageProps {
  onNavigate: (route: string, param?: string) => void;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { doctors } = useData();

  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');

  const specialties = [
    { key: 'all', label: 'Barcha mutaxassislar' },
    { key: 'surgery', label: 'Jarrohlik' },
    { key: 'ent', label: 'LOR / Otolaringologiya' },
    { key: 'msct', label: 'Radiologiya / MSCT' },
    { key: 'laboratory', label: 'Klinik laboratoriya' },
    { key: 'ophthalmology', label: 'Oftalmologiya' },
    { key: 'dentistry', label: 'Stomatologiya' },
  ];

  const filteredDoctors = doctors.filter((doc) => {
    if (!doc.active) return false;
    if (selectedSpecialty !== 'all' && doc.specialtyKey !== selectedSpecialty) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = doc.name.toLowerCase().includes(q);
      const matchSpec = doc.specialty.toLowerCase().includes(q);
      const matchQual = doc.qualification.toLowerCase().includes(q);
      return matchName || matchSpec || matchQual;
    }
    return true;
  });

  return (
    <div className="py-10 md:py-16 bg-[#F6FAFD] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-[#0A2540] tracking-tight mb-3">
            {t.doctors.title}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t.doctors.subtitle}
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Shifokor ismi yoki mutaxassisligi..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-800"
            />
          </div>

          {/* Specialty Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            {specialties.map((s) => (
              <button
                key={s.key}
                onClick={() => setSelectedSpecialty(s.key)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedSpecialty === s.key
                    ? 'bg-[#0B5ED7] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-slate-200">
            <p className="font-bold text-slate-800 text-lg mb-1">Shifokor topilmadi</p>
            <p className="text-xs text-slate-500 mb-4">
              Qidiruv so‘rovingizni o‘zgartiring yoki filtrlarni tozalang.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedSpecialty('all');
              }}
              className="px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl hover:bg-blue-100 transition-colors"
            >
              Filtrlarni tozalash
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Photo & Tag */}
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={doc.photo}
                      alt={doc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-bold shadow-md">
                      {doc.experienceYears} {t.doctors.experience}
                    </div>
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-md flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{doc.rating} ({doc.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <span className="text-xs font-extrabold text-teal-600 uppercase tracking-wider block mb-1">
                      {doc.specialty}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-2">
                      {doc.name}
                    </h2>
                    <p className="text-xs font-medium text-slate-500 mb-3">
                      {doc.qualification}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-5">
                      {doc.biography}
                    </p>

                    {/* Price and Schedule */}
                    <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-100 text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">{t.doctors.consultationPrice}:</span>
                        <span className="font-extrabold text-slate-900 text-sm">
                          {doc.consultationPrice.toLocaleString()} so‘m
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-1.5 border-t border-slate-200/60">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Ish vaqti:
                        </span>
                        <span className="font-semibold text-slate-800">
                          {doc.workingHours}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onNavigate('doctor-details', doc.id)}
                    className="py-3 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors text-center"
                  >
                    {t.doctors.viewProfile}
                  </button>
                  <button
                    onClick={() => onNavigate('booking', `doctor=${doc.id}`)}
                    className="py-3 px-3 rounded-xl bg-[#0B5ED7] hover:bg-blue-700 text-white text-xs font-bold transition-colors text-center shadow-md shadow-blue-500/20"
                  >
                    {t.doctors.bookAppointment}
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
