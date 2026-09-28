import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, User, Eye, Share2, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useData } from '../context/DataContext.tsx';
import { NewsArticle } from '../types/index.ts';
import { useToast } from '../context/ToastContext.tsx';

interface NewsDetailPageProps {
  newsId: string;
  onNavigate: (route: string, param?: string) => void;
}

export const NewsDetailPage: React.FC<NewsDetailPageProps> = ({ newsId, onNavigate }) => {
  const { t } = useLanguage();
  const { news } = useData();
  const { showToast } = useToast();
  const [article, setArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    async function loadArticle() {
      try {
        const res = await fetch(`/api/news/${newsId}`);
        if (res.ok) {
          const data = await res.json();
          setArticle(data);
        } else {
          const fallback = news.find((n) => n.id === newsId || n.slug === newsId);
          if (fallback) setArticle(fallback);
        }
      } catch (err) {
        const fallback = news.find((n) => n.id === newsId || n.slug === newsId);
        if (fallback) setArticle(fallback);
      }
    }
    loadArticle();
  }, [newsId, news]);

  if (!article) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Maqola topilmadi</h2>
        <button
          onClick={() => onNavigate('news')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
        >
          Yangiliklarga qaytish
        </button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('info', 'Havola nusxalandi');
    }
  };

  return (
    <div className="py-10 md:py-16 bg-[#F6FAFD] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => onNavigate('news')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Barcha maqolalarga qaytish</span>
        </button>

        <article className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 mb-12">
          {/* Cover image */}
          <div className="relative aspect-[21/9] bg-slate-100 overflow-hidden">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 text-slate-900 text-xs font-bold shadow-md">
              {article.category}
            </span>
          </div>

          <div className="p-6 sm:p-10">
            {/* Meta */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <User className="w-4 h-4 text-blue-600" />
                  {article.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {article.publishedAt}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-slate-400" />
                  {article.views} o‘qildi
                </span>
              </div>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-1.5 font-semibold text-xs"
              >
                <Share2 className="w-4 h-4" />
                <span>Ulashish</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Summary Lead */}
            <p className="text-sm sm:text-base font-medium text-slate-600 leading-relaxed mb-8 bg-blue-50/50 p-5 rounded-2xl border-l-4 border-blue-600">
              {article.summary}
            </p>

            {/* Content */}
            <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
              <p className="whitespace-pre-line">{article.content}</p>
            </div>

            {/* Medical Disclaimer */}
            <div className="mt-12 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <span className="font-bold block mb-1">Tibbiy ogohlantirish:</span>
              Ushbu maqoladagi ma’lumotlar faqat umumiy ma’lumot berish maqsadida taqdim etilgan. Qandaydir kasallik alomatlari paydo bo‘lganda, albatta shifokorga murojaat qiling.
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
