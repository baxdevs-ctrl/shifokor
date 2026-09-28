import React, { useState } from 'react';
import {
  Stethoscope,
  CheckCircle2,
  Calendar,
  Phone,
  ChevronDown,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Video,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useData } from '../context/DataContext.tsx';
import { QuickAppointmentSection } from '../components/booking/QuickAppointmentSection.tsx';

interface LORPageProps {
  onNavigate: (route: string, param?: string) => void;
}

export const LORPage: React.FC<LORPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { doctors, services, settings } = useData();

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const entDoctors = doctors.filter((d) => d.specialtyKey === 'ent');
  const entServices = services.filter((s) => s.category === 'ent');

  const faqs = [
    {
      q: 'Videoendoskopik LOR tekshiruvi og‘riqlimi?',
      a: 'Yo‘q, tekshiruv mutlaqo og‘riqsiz va xavfsizdir. Diametri bir necha millimetr bo‘lgan yumshoq va egiluvchan mikrokamera orqali burun va tomoq shilliq qavati 10 karra kattalashtirilib ekranda ko‘rsatiladi.',
    },
    {
      q: 'Bolalarda adenoidlarni operatsiyasiz davolash mumkinmi?',
      a: 'Adenoidlarning 1- va 2-darajalarida zamonaviy dori terapiyasi, apparatli yuvish va lazer fizioterapiyasi yordamida operatsiyasiz ijobiy natijaga erishish mumkin. Yakuniy xulosa videoendoskopik ko‘rikdan so‘ng belgilanadi.',
    },
    {
      q: 'Gaymoritni ponksiyasiz (teshmasdan) yuvish qanday amalga oshiriladi?',
      a: 'Klinikamizda "Kuku" usulida manfiy bosimli vakuum apparati orqali burun bo‘shliqlari antiseptik va yallig‘lanishga qarshi eritmalar bilan yuviladi. Bu usul shilliq va yiringni og‘riqsiz tozalaydi.',
    },
    {
      q: 'LOR shifokori ko‘rigiga qanday tayyorgarlik ko‘rish lozim?',
      a: 'Ko‘rikdan kamida 1-2 soat oldin burunga tomir toraytiruvchi tomchilar tomizmang va tomoqni kuchli antiseptik bilan chaymang, chunki bu shilliq qavatning tabiiy holatini yashirishi mumkin.',
    },
  ];

  return (
    <div className="py-10 md:py-16 bg-[#F6FAFD] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Department Hero */}
        <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-blue-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-14 relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold mb-4">
              <Stethoscope className="w-4 h-4" />
              <span>MEDCARE Otolaringologiya (LOR)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 leading-tight">
              Quloq, tomoq va burun kasalliklarini videoendoskopik davolash
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Kattalar va bolalar uchun yuqori aniqlikdagi HD videoendoskopiya, gaymoritni teshmasdan davolash va eshitish qobiliyatini tekshirish.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('lor-booking');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                LOR qabuliga yozilish
              </button>
              <a
                href={`tel:${settings?.phone}`}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Qo‘ng‘iroq qilish</span>
              </a>
            </div>
          </div>
        </div>

        {/* Diagnostic Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">HD Videoendoskopiya</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Burun to‘sig‘i, poliplar, tomoq va quloq pardasini monitor ekranida 10 barobar kattalashtirilgan tasvirda ko‘rish.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Punksiyasiz usullar</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gaymorit va sinusitlarni ponksiyasiz (ignasiz), dori vositalari bilan apparatli yuvish muolajalari.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Bolalar LOR xizmati</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kichik yoshdagi bolalarga og‘riqsiz, qulay sharoitda do‘stona yondashuv bilan ko‘rik va muolaja.
            </p>
          </div>
        </div>

        {/* LOR Services & Pricing */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block mb-1">
                LOR Muolajalari
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A2540]">
                LOR xizmatlari va narxlari
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {entServices.map((srv) => (
              <div
                key={srv.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{srv.name}</h3>
                    <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-3 py-1 rounded-full whitespace-nowrap">
                      {srv.price.toLocaleString()} so‘m
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Davomiyligi: ~{srv.durationMinutes} daqiqa</span>
                  <button
                    onClick={() => onNavigate('booking', `service=${srv.id}`)}
                    className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold transition-colors"
                  >
                    Yozilish →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctors Section */}
        {entDoctors.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-black text-[#0A2540] mb-6">
              LOR shifokorlarimiz
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] bg-slate-100 relative">
                    <img src={doc.photo} alt={doc.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 text-xs font-bold text-slate-800">
                      {doc.experienceYears} yil tajriba
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-base text-slate-900 mb-1">{doc.name}</h3>
                    <p className="text-xs text-teal-600 font-semibold mb-2">{doc.specialty}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4">{doc.qualification}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onNavigate('doctor-details', doc.id)}
                        className="flex-1 py-2 text-xs font-bold border border-slate-200 rounded-xl hover:bg-slate-50"
                      >
                        Profil
                      </button>
                      <button
                        onClick={() => onNavigate('booking', `doctor=${doc.id}`)}
                        className="flex-1 py-2 text-xs font-bold bg-[#0B5ED7] text-white rounded-xl hover:bg-blue-700"
                      >
                        Qabulga yozilish
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-[#0A2540] mb-6">
            Ko‘p beriladigan savollar
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-800 hover:text-teal-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-teal-600' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Booking CTA */}
        <div id="lor-booking">
          <QuickAppointmentSection initialDoctorId={entDoctors[0]?.id} embedded={true} />
        </div>
      </div>
    </div>
  );
};
