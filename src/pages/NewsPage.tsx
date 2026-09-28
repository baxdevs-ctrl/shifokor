import React, { useState } from 'react';
import { Newspaper, Calendar, Eye, ArrowRight, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useData } from '../context/DataContext.tsx';

interface NewsPageProps {
  onNavigate: (route: string, param?: string) => void;
}

export const NewsPage: React.FC<NewsPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { news } = useData();
  const [search, setSearch] = useState('');

  const activeNews = news.filter((n) => n.active);

  const filtered = activeNews.filter((n) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.summary.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="py-10 md:py-16 bg-[#F6FAFD] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-3">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Klinika hayoti va tibbiy maqolalar</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0A2540] tracking-tight mb-3">
            {t.news.title}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t.news.subtitle}
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Maqolalarni qidirish..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-blue-600 shadow-sm text-slate-800"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-slate-200">
            <p className="font-bold text-slate-800 text-lg mb-1">Maqola topilmadi</p>
            <p className="text-xs text-slate-500">Qidiruv so‘zini o‘zgartiring.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate('news-details', item.id)}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-slate-900 text-[10px] font-bold shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-6 sm:p-7">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.publishedAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {item.views}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug mb-3">
                      {item.title}
                    </h2>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-6">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-7 pt-0 flex items-center gap-1.5 text-xs font-bold text-blue-600">
                  <span>{t.news.readMore}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
