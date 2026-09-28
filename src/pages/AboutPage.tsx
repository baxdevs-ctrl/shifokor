import React from 'react';
import {
  ShieldCheck,
  Award,
  Users,
  Building2,
  HeartHandshake,
  CheckCircle2,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useData } from '../context/DataContext.tsx';

interface AboutPageProps {
  onNavigate: (route: string, param?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { settings, doctors } = useData();

  return (
    <div className="py-10 md:py-16 bg-[#F6FAFD] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Klinika tarixi va missiyasi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A2540] tracking-tight mb-4">
            {settings?.name || 'MEDCARE'} — Sog‘lom hayot uchun zamonaviy tibbiyot
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {settings?.tagline || 'Zamonaviy tibbiyot. Ishonchli xizmat.'} — biz bemorlarimizga xalqaro standartdagi xavfsiz va samarali tibbiy yordam ko‘rsatishni asosiy vazifa deb bilamiz.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-sm border border-slate-200/90 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                Klinikamiz haqida
              </h2>
              <p>
                MEDCARE ko‘p tarmoqli tibbiyot markazi bemorlarga qulay, tezkor va yuqori texnologiyali diagnostika hamda davolash xizmatlarini taqdim etish maqsadida tashkil etilgan.
              </p>
              <p>
                Bizning markazimizda jahon yetakchilari (Germaniya, Janubiy Koreya, Yaponiya) ishlab chiqargan eng so‘nggi tibbiy uskunalar jamlangan. 128 qatlamli MSCT tomograf, to‘liq avtomatlashtirilgan tahlilatorlar hamda zamonaviy laparoskopik operatsiya xonalari shular jumlasidandir.
              </p>
              <p>
                Har bir bemorga individual yondashuv, shifokorlar o‘rtasida konsilium tizimi va mutlaq maxfiylik klinikamiz faoliyatining bosh tamoyillaridir.
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-slate-100 aspect-[4/3] bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=900"
                  alt="MEDCARE Clinic modern hospital interior"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Xavfsizlik va Sterillik</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              HEPA-filtrlangan toza havo oqimi, bir martalik tibbiy sarflov materiallari va qat’iy xalqaro antiseptik qoidalar.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Malakali Shifokorlar</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Oliy toifali shifokorlar, fan nomzodlari va xorijiy yetakchi klinikalarda malaka oshirgan mutaxassislar jamoasi.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Bemorga G‘amxo‘rlik</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Navbatsiz onlayn qabul tizimi, qulay statsionar palatalar va natijalarni raqamli yetkazib berish qulayligi.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-[#0A2540] to-blue-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-teal-400 mb-1">15+</p>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">Yillik tibbiy amaliyot</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-teal-400 mb-1">25 000+</p>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">Minnatdor bemorlar</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-teal-400 mb-1">128</p>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">Qatlamli MSCT tomograf</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-teal-400 mb-1">50+</p>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">Turdagi laboratoriya tahlillari</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-6">
          <button
            onClick={() => onNavigate('booking')}
            className="px-8 py-3.5 rounded-xl bg-[#0B5ED7] hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <span>Shifokor qabuliga yozilish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
