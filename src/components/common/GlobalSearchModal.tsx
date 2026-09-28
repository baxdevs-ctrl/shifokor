import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  User,
  Activity,
  FlaskConical,
  Layers,
  Flame,
  Newspaper,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import {
  Doctor,
  MedicalService,
  LaboratoryTest,
  MSCTService,
  Promotion,
  NewsArticle,
} from '../../types/index.ts';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (route: string, id?: string) => void;
}

interface SearchResults {
  doctors: Doctor[];
  services: MedicalService[];
  laboratory: LaboratoryTest[];
  msct: MSCTService[];
  promotions: Promotion[];
  news: NewsArticle[];
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults>({
    doctors: [],
    services: [],
    laboratory: [],
    msct: [],
    promotions: [],
    news: [],
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ doctors: [], services: [], laboratory: [], msct: [], promotions: [], news: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onSelectResult('search');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSelectResult]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ doctors: [], services: [], laboratory: [], msct: [], promotions: [], news: [] });
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const totalResults =
    results.doctors.length +
    results.services.length +
    results.laboratory.length +
    results.msct.length +
    results.promotions.length +
    results.news.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Shifokor, xizmat, tahlil yoki MSCT qidiring..."
            className="w-full px-3 py-1 text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none text-base"
          />
          {loading ? (
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
          ) : query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[11px] font-semibold text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">
              ESC
            </span>
          )}
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query.trim() && (
            <div className="py-8 text-center text-slate-400 text-sm">
              <p className="font-medium text-slate-600 mb-1">Tezkor tibbiy qidiruv</p>
              <p className="text-xs">Masalan: "Jarroh", "LOR", "MSCT", "Qon tahlili", "Oftalmolog"</p>
            </div>
          )}

          {query.trim() && !loading && totalResults === 0 && (
            <div className="py-10 text-center text-slate-500">
              <p className="font-semibold text-base">Hech narsa topilmadi</p>
              <p className="text-xs text-slate-400 mt-1">
                "{query}" bo‘yicha natija yo‘q. Boshqa so‘z bilan urinib ko‘ring.
              </p>
            </div>
          )}

          {/* Doctors */}
          {results.doctors.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                Shifokorlar
              </span>
              <div className="space-y-1">
                {results.doctors.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      onSelectResult('doctor-details', d.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900 group-hover:text-blue-700">
                          {d.name}
                        </p>
                        <p className="text-xs text-slate-500">{d.specialty}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Services */}
          {results.services.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                Tibbiy Xizmatlar
              </span>
              <div className="space-y-1">
                {results.services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectResult('services', s.category);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-teal-50 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900 group-hover:text-teal-700">
                          {s.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {s.categoryNameUz} • {s.price.toLocaleString()} so‘m
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MSCT */}
          {results.msct.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                MSCT / KT Diagnostika
              </span>
              <div className="space-y-1">
                {results.msct.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectResult('msct', m.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900 group-hover:text-indigo-700">
                          {m.name}
                        </p>
                        <p className="text-xs text-slate-500">{m.price.toLocaleString()} so‘m</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Laboratory */}
          {results.laboratory.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                Laboratoriya Tahlillari
              </span>
              <div className="space-y-1">
                {results.laboratory.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      onSelectResult('lab-details', l.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                        <FlaskConical className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900 group-hover:text-emerald-700">
                          {l.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {l.code} • {l.price.toLocaleString()} so‘m • {l.resultDurationText}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Promotions */}
          {results.promotions.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                Aksiyalar
              </span>
              <div className="space-y-1">
                {results.promotions.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectResult('promotion-details', p.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-50 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                        <Flame className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900 group-hover:text-amber-700">
                          {p.title}
                        </p>
                        <p className="text-xs text-slate-500">{p.discountPercent}% chegirma</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
