import React from 'react';
import {
  Calendar,
  Activity,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Scissors,
  Layers,
  FlaskConical,
  Eye,
  Smile,
  Phone,
  Clock,
  Sparkles,
  Flame,
  Award,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useData } from '../context/DataContext.tsx';
import { QuickAppointmentSection } from '../components/booking/QuickAppointmentSection.tsx';
import { AdvertisementBanner } from '../components/common/AdvertisementBanner.tsx';

interface HomePageProps {
  onNavigate: (route: string, param?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { doctors, services, laboratory, msct, promotions, news, settings } = useData();

  const quickServices = [
    {
      title: 'Jarrohlik',
      subtitle: 'Laparoskopik kam invaziv operatsiyalar',
      desc: 'O‘t qopi toshlari, churralar va appenditsit operatsiyalari kichik kesmalar bilan tez tiklanish kafolati.',
      icon: Scissors,
      route: 'surgery',
      badge: 'Laparoskopiya',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      title: 'LOR / ENT',
      subtitle: 'Otolaringologiya markazi',
      desc: 'Quloq, tomoq va burun kasalliklarini videoendoskopik diagnostika qilish va operatsiyasiz davolash.',
      icon: Stethoscope,
      route: 'lor',
      badge: 'Endoskopiya',
      color: 'from-teal-600 to-emerald-600',
    },
    {
      title: 'MSCT / KT',
      subtitle: '128 qatlamli tomografiya',
      desc: 'Bosh miya, o‘pka, umurtqa va qorin a’zolarini 0.5 mm gacha bo‘lgan yuqori aniqlikdagi 3D tasviri.',
      icon: Layers,
      route: 'msct',
      badge: '128 qatlam',
      color: 'from-sky-600 to-blue-700',
    },
    {
      title: 'Laboratoriya',
      subtitle: '50+ turdagi tahlillar',
      desc: 'Umumiy qon, gormonlar, biokimyo va vitaminlar. Natijalarni 24 soat ichida Telegram orqali olish.',
      icon: FlaskConical,
      route: 'laboratory',
      badge: 'ISO 15189',
      color: 'from-indigo-600 to-purple-600',
    },
    {
      title: 'Oftalmologiya',
      subtitle: 'Ko‘z mikroxirurgiyasi va ko‘rik',
      desc: 'Avtorefraktometriya, to‘r parda ko‘rigi, glaukoma skriningi va ko‘zoynak individual tanlash.',
      icon: Eye,
      route: 'services',
      param: 'ophthalmology',
      badge: 'Lazer & Kompyuter',
      color: 'from-cyan-600 to-teal-700',
    },
    {
      title: 'Stomatologiya',
      subtitle: 'Zamonaviy estetik tish davolash',
      desc: 'Og‘riqsiz davolash, ultratovushli Air-Flow tozalash va nurli estetik plombalar.',
      icon: Smile,
      route: 'services',
      param: 'dentistry',
      badge: 'Og‘riqsiz',
      color: 'from-blue-500 to-cyan-600',
    },
  ];

  return (
    <div className="w-full">
      {/* ========================================================
          1. HERO SECTION
         ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F6FAFD] via-white to-blue-50/40 pt-8 pb-16 lg:py-20">
        {/* Soft background accents */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-teal-100/40 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-900 border border-blue-200 text-xs font-bold mb-6">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-[#0A2540] tracking-tight leading-[1.15] mb-6">
                {t.hero.headline}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
                {t.hero.subtext}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <button
                  onClick={() => onNavigate('booking')}
                  className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#0B5ED7] to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-500/25 active:scale-95 transition-all flex items-center gap-2.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t.hero.bookBtn}</span>
                </button>

                <button
                  onClick={() => onNavigate('services')}
                  className="px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-sm hover:shadow transition-all flex items-center gap-2"
                >
                  <span>{t.hero.servicesBtn}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200/80">
                {t.hero.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] sm:aspect-[5/4] bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=900"
                    alt="MEDCARE Clinic modern interior and equipment"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
                    <div className="text-white">
                      <span className="text-xs font-bold text-teal-300 uppercase tracking-wider block mb-1">
                        MEDCARE Innovatsiyalari
                      </span>
                      <p className="font-bold text-base leading-snug">
                        128 qatlamli MSCT va xalqaro gigiyena standartidagi operatsion bloklar
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Trust Card 1 */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Bemorlar ishonchi</p>
                    <p className="text-sm font-black text-slate-900">4.9 / 5.0 (980+ baho)</p>
                  </div>
                </div>

                {/* Floating Trust Card 2 */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Shoshilinch xizmat</p>
                    <p className="text-sm font-black text-slate-900">24/7 Qabul bo‘limi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. QUICK SERVICE CARDS
         ======================================================== */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold mb-2">
                <Activity className="w-3.5 h-3.5" />
                <span>Asosiy yo‘nalishlar</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A2540] tracking-tight">
                Klinikamiz tibbiy xizmatlari
              </h2>
            </div>
            <button
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0B5ED7] hover:text-blue-800 transition-colors"
            >
              <span>Barcha xizmatlarni ko‘rish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickServices.map((qs, idx) => {
              const IconComp = qs.icon;
              return (
                <div
                  key={idx}
                  onClick={() => onNavigate(qs.route, qs.param)}
                  className="group relative bg-[#F8FAFC] hover:bg-white p-7 rounded-3xl border border-slate-200/80 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${qs.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white text-slate-700 border border-slate-200">
                        {qs.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#0A2540] mb-1 group-hover:text-blue-700 transition-colors">
                      {qs.title}
                    </h3>
                    <p className="text-xs font-semibold text-teal-600 mb-3">{qs.subtitle}</p>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                      {qs.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                    <span>Batafsil ma’lumot</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. HERO ADVERTISEMENT BANNER
         ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <AdvertisementBanner placement="home_hero" onNavigate={onNavigate} />
      </div>

      {/* ========================================================
          4. QUICK APPOINTMENT SECTION
         ======================================================== */}
      <QuickAppointmentSection />

      {/* ========================================================
          5. FEATURED DOCTORS ("Bizning mutaxassislar")
         ======================================================== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>Malakali shifokorlar</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0A2540] tracking-tight">
                {t.doctors.title}
              </h2>
              <p className="text-slate-600 text-sm mt-2">{t.doctors.subtitle}</p>
            </div>

            <button
              onClick={() => onNavigate('doctors')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0B5ED7] hover:text-blue-800 transition-colors"
            >
              <span>Barcha shifokorlar ({doctors.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {doctors.slice(0, 6).map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Photo & Badge */}
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={doc.photo}
                      alt={doc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-bold shadow-sm">
                      {doc.experienceYears} {t.doctors.experience}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <span className="text-xs font-bold text-teal-600 block mb-1">
                      {doc.specialty}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-2">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                      {doc.biography}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">{t.doctors.consultationPrice}:</span>
                        <span className="font-bold text-slate-900">
                          {doc.consultationPrice.toLocaleString()} so‘m
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Ish kunlari:</span>
                        <span className="font-medium text-slate-700">
                          {doc.workingDays.slice(0, 3).join(', ')}...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onNavigate('doctor-details', doc.id)}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors text-center"
                  >
                    {t.doctors.viewProfile}
                  </button>
                  <button
                    onClick={() => onNavigate('booking', `doctor=${doc.id}`)}
                    className="py-2.5 px-3 rounded-xl bg-[#0B5ED7] hover:bg-blue-700 text-white text-xs font-bold transition-colors text-center shadow-sm"
                  >
                    {t.doctors.bookAppointment}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. HOME BANNER ADVERTISEMENT
         ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <AdvertisementBanner placement="home_banner" onNavigate={onNavigate} />
      </div>

      {/* ========================================================
          7. PROMOTIONS & OFFERS
         ======================================================== */}
      {promotions.length > 0 && (
        <section className="py-16 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>Aksiyalar</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0A2540] tracking-tight">
                  {t.promotions.title}
                </h2>
                <p className="text-slate-600 text-sm mt-1">{t.promotions.subtitle}</p>
              </div>

              <button
                onClick={() => onNavigate('promotions')}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-800 transition-colors"
              >
                <span>Barcha aksiyalar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-600 text-white font-extrabold text-xs shadow-md">
                      -{p.discountPercent}%
                    </div>
                    {p.badge && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 text-slate-800 font-bold text-[10px]">
                        {p.badge}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {p.description}
                    </p>
                    <p className="text-[11px] text-slate-400 font-semibold mb-6">
                      Muddati: {p.endDate} {t.promotions.validUntil}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onNavigate('promotion-details', p.id)}
                        className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
                      >
                        {t.promotions.detailsBtn}
                      </button>
                      <button
                        onClick={() => {
                          if (p.ctaLink.startsWith('/')) {
                            const parts = p.ctaLink.replace('/', '').split('?');
                            onNavigate(parts[0], parts[1]);
                          } else {
                            onNavigate('booking');
                          }
                        }}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-colors shadow-sm"
                      >
                        {t.promotions.bookBtn}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          8. LATEST NEWS & HEALTH ARTICLES
         ======================================================== */}
      {news.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Maqolalar va yangiliklar</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0A2540] tracking-tight">
                  {t.news.title}
                </h2>
              </div>

              <button
                onClick={() => onNavigate('news')}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0B5ED7] hover:text-blue-800 transition-colors"
              >
                <span>Barcha maqolalar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {news.slice(0, 3).map((item) => (
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
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 text-slate-800 text-[10px] font-bold">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-6">
                      <p className="text-[11px] text-slate-400 font-semibold mb-2">
                        {item.publishedAt} • {item.author}
                      </p>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex items-center gap-1.5 text-xs font-bold text-blue-600">
                    <span>{t.news.readMore}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
