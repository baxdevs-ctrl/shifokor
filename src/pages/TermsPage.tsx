import React from 'react';
import { FileText, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useData } from '../context/DataContext.tsx';

export const TermsPage: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const { settings } = useData();

  return (
    <div className="py-12 md:py-16 bg-[#F6FAFD] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bosh sahifaga qaytish</span>
        </button>

        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-6">
            <FileText className="w-6 h-6" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
            Bemor huquqlari va xizmat ko‘rsatish shartlari
          </h1>
          <p className="text-xs text-slate-400 font-medium mb-8">
            {settings?.name || 'MEDCARE'} ko‘p tarmoqli klinikasi
          </p>

          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. Onlayn ariza maqomi</h2>
              <p>
                Veb-sayt orqali to‘ldirilgan ariza dastlabki bron hisoblanadi (holati: YANGI). Qabul vaqti va shifokor ko‘rigi faqat klinika xodimi telefon orqali siz bilan bog‘lanib tasdiqlaganidan so‘ng to‘liq kuchga kiradi.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">2. Bemorning asosiy huquqlari</h2>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>O‘z salomatligi holati, tashxis va davolash usullari haqida to‘liq va tushunarli ma’lumot olish;</li>
                <li>Davolash rejasini va shifokor tanlash huquqi;</li>
                <li>Tibbiy sir va shaxsiy ma’lumotlarning to‘liq maxfiyligi kafolati;</li>
                <li>Xizmatlar narxi bilan oldindan shaffof tarzda tanishish.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">3. Bemorning majburiyatlari</h2>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Kelishilgan qabul vaqtiga kamida 10 daqiqa oldin yetib kelish;</li>
                <li>Qabulga kelolmaslik holatida klinika ma’muriyatini oldindan ogohlantirish;</li>
                <li>Tekshiruvlarga (MSCT, laboratoriya) tayyorgarlik bo‘yicha shifokor ko‘rsatmalariga amal qilish.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">Tibbiy javobgarlik eslatmasi:</span>
                Saytdagi ma’lumotlar umumiy tanishtirish maqsadida taqdim etilgan. Tibbiy tashxis va davolash bo‘yicha yakuniy qaror faqat malakali mutaxassis shaxsan ko‘rik o‘tkazganidan keyin qabul qilinadi.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
