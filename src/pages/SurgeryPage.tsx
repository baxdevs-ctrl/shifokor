import React, { useState } from 'react';
import {
  Scissors,
  CheckCircle2,
  Calendar,
  Phone,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useData } from '../context/DataContext.tsx';
import { QuickAppointmentSection } from '../components/booking/QuickAppointmentSection.tsx';

interface SurgeryPageProps {
  onNavigate: (route: string, param?: string) => void;
}

export const SurgeryPage: React.FC<SurgeryPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { doctors, services, settings } = useData();

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const surgeons = doctors.filter((d) => d.specialtyKey === 'surgery');
  const surgicalServices = services.filter((s) => s.category === 'surgery');

  const faqs = [
    {
      q: 'Laparoskopik operatsiya oddiy ochiq operatsiyadan qanday farq qiladi?',
      a: 'Laparoskopiyada katta kesmalar qilinmaydi. Buning o‘rniga diametri 5-10 mm bo‘lgan bir nechta kichik teshiklar orqali mikro-optik video va maxsus jarrohlik asboblari kiritiladi. Bu operatsiyadan keyingi og‘riqni kamaytiradi va bemorning odatiy hayotga tezroq qaytishini ta’minlaydi.',
    },
    {
      q: 'Rejalashtirilgan operatsiyadan oldin qanday tahlillar topshiriladi?',
      a: 'Standart tayyorgarlik doirasida umumiy qon va siydik tahlili, koagulogramma (qon ivishi), biokimyoviy tahlil, qon guruhi va rezus omil, gepatit B va C, EKG hamda terapevt ko‘rigi talab etiladi. Barcha tahlillarni klinikamiz laboratoriyasida 1 kunda topshirish mumkin.',
    },
    {
      q: 'Operatsiyadan so‘ng statsionarda qancha muddat qolish kerak?',
      a: 'Aksariyat kam invaziv laparoskopik aralashuvlardan (masalan, xoletsistektomiya yoki churra plastikasi) so‘ng bemor 1 yoki 2 kun shifokorlar nazoratida bo‘ladi va uchinchi kuni uyiga ruxsat beriladi.',
    },
    {
      q: 'Operatsiyadan oldin ovqatlanish mumkinmi?',
      a: 'Rejali operatsiya o‘tkaziladigan kunda och qoringa kelish zarur. Operatsiyadan kamida 8 soat oldin ovqatlanish va 4 soat oldin suv ichish to‘xtatiladi. Anesteziolog ko‘rsatmalariga qat’iy rioya qilinishi lozim.',
    },
  ];

  return (
    <div className="py-10 md:py-16 bg-[#F6FAFD] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Department Hero */}
        <div className="bg-gradient-to-r from-[#0A2540] via-blue-950 to-blue-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-14 relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold mb-4">
              <Scissors className="w-4 h-4" />
              <span>MEDCARE Jarrohlik Bo‘limi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 leading-tight">
              Zamonaviy kam invaziv laparoskopik jarrohlik
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Germaniya va Janubiy Koreya standartlariga mos operatsion bloklar, yuqori malakali jarrohlar va qisqa reabilitatsiya davri.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('surgery-booking');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                Jarroh qabuliga yozilish
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

        {/* Surgical Advantages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Kichik kesmalar</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Katta chandiqlarsiz, atigi 5-10 mm teshiklar orqali mikro-optik asboblar yordamida aniq amaliyot.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Tezkor sog‘ayish</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bemor operatsiyadan keyin 1-2 kunda mustaqil harakatlanib, odatiy ish faoliyatiga qaytishi mumkin.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Qat’iy sterillik</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Laminar havo oqimi filtrlari (HEPA) bilan jihozlangan ISO toza xonalari va zamonaviy narkoz apparatlari.
            </p>
          </div>
        </div>

        {/* Surgical Services List */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                Operatsiyalar ro‘yxati
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A2540]">
                Jarrohlik amaliyotlari va narxlari
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {surgicalServices.map((srv) => (
              <div
                key={srv.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{srv.name}</h3>
                    <span className="text-xs font-extrabold text-[#0B5ED7] bg-blue-50 px-3 py-1 rounded-full whitespace-nowrap">
                      {srv.price.toLocaleString()} so‘m
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {srv.description}
                  </p>
                  {srv.fullDetails && (
                    <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl mb-4">
                      {srv.fullDetails}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Taxminiy vaqt: {srv.durationMinutes} daqiqa</span>
                  <button
                    onClick={() => onNavigate('booking', `service=${srv.id}`)}
                    className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-[#0B5ED7] text-white text-xs font-bold transition-colors"
                  >
                    Yozilish →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Doctors */}
        {surgeons.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-black text-[#0A2540] mb-6">
              Jarrohlarimiz
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {surgeons.map((doc) => (
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

        {/* Preparation Guidelines */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 mb-16">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Operatsiyaga tayyorgarlik bo‘yicha umumiy tavsiyalar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
              <span className="font-bold text-blue-900 block mb-1">1. Tahlillar va ko‘rik</span>
              Operatsiyadan oldin jarroh va anesteziolog ko‘rigidan o‘tib, barcha tayinlangan laboratoriya tahlillari va EKG topshiriladi.
            </div>
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
              <span className="font-bold text-blue-900 block mb-1">2. Parhez va ochlik tartibi</span>
              Operatsiyadan 8 soat oldin og‘ir ovqat iste’mol qilinmaydi. Narkoz xavfsizligi uchun och qoringa kelish qat’iy talab etiladi.
            </div>
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
              <span className="font-bold text-blue-900 block mb-1">3. Qabul qilinayotgan dorilar</span>
              Muntazam qon suyultiruvchi yoki qon bosimi dori vositalarini qabul qilayotgan bo‘lsangiz, bu haqida shifokorga xabar berish shart.
            </div>
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
              <span className="font-bold text-blue-900 block mb-1">4. Shaxsiy gigiyena</span>
              Operatsiya kuni toza kiyim va qulay poyabzalda kelish, taqinchoqlar va bo‘yoqlarni olib qo‘yish tavsiya qilinadi.
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-[#0A2540] mb-6">
            Ko‘p beriladigan savollar (FAQ)
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-800 hover:text-blue-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-blue-600' : ''
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

        {/* Booking CTA Section */}
        <div id="surgery-booking">
          <QuickAppointmentSection initialDoctorId={surgeons[0]?.id} embedded={true} />
        </div>
      </div>
    </div>
  );
};
