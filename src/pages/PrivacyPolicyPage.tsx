import React from 'react';
import { ShieldCheck, ArrowLeft, Lock } from 'lucide-react';
import { useData } from '../context/DataContext.tsx';

export const PrivacyPolicyPage: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
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
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-6">
            <Lock className="w-6 h-6" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
            Shaxsiy ma’lumotlar maxfiyligi siyosati
          </h1>
          <p className="text-xs text-slate-400 font-medium mb-8">
            Oxirgi yangilanish: 2026-yil sentabr
          </p>

          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. Umumiy qoidalar</h2>
              <p>
                Ushbu Maxfiylik siyosati {settings?.name || 'MEDCARE'} ko‘p tarmoqli xususiy tibbiyot markazi tomonidan bemorlar va veb-sayt foydalanuvchilarining shaxsiy ma’lumotlarini yig‘ish, saqlash, qayta ishlash va himoya qilish tartibini belgilaydi.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">2. Yig‘iladigan ma’lumotlar</h2>
              <p>
                Klinika veb-sayti orqali faqat qabulga yozilish va aloqa o‘rnatish uchun zarur bo‘lgan minimal ma’lumotlar yig‘iladi:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Bemorning to‘liq ismi-sharifi;</li>
                <li>Aloqa uchun telefon raqami;</li>
                <li>Elektron pochta manzili (ixtiyoriy ravishda);</li>
                <li>Murojaat sababi yoki qisqacha shikoyat.</li>
              </ul>
              <p className="mt-2 font-medium text-slate-800">
                Biz saytda keraksiz nozik tibbiy kartalar va to‘liq kasallik tarixini saqlamaymiz.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">3. Ma’lumotlardan foydalanish maqsadi</h2>
              <p>
                Shaxsiy ma’lumotlar faqat quyidagi maqsadlarda ishlatiladi:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Shifokor qabuliga navbatni rejalashtirish va tasdiqlash;</li>
                <li>Klinika ma’muriyati tomonidan bemor bilan telefon yoki Telegram orqali bog‘lanish;</li>
                <li>Tibbiy xizmat sifatini nazorat qilish.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">4. Ma’lumotlar himoyasi va oshkor etmaslik</h2>
              <p>
                Bemorlarning telefon raqamlari va shaxsiy ma’lumotlari hech qachon ommaviy sahifalarda e’lon qilinmaydi va uchinchi shaxslarga tijorat maqsadida sotilmaydi yoki berilmaydi.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">5. Bemor roziligi</h2>
              <p>
                Onlayn shaklni to‘ldirayotganda majburiy rozilik katagini belgilash orqali bemor yuqoridagi shartlarga rozilik bildirgan hisoblanadi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
