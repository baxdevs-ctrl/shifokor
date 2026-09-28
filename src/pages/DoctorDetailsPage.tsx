import React from 'react';
import {
  Calendar,
  Phone,
  Send,
  Star,
  MapPin,
  Clock,
  Award,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useData } from '../context/DataContext.tsx';
import { QuickAppointmentSection } from '../components/booking/QuickAppointmentSection.tsx';

interface DoctorDetailsPageProps {
  doctorId: string;
  onNavigate: (route: string, param?: string) => void;
}

export const DoctorDetailsPage: React.FC<DoctorDetailsPageProps> = ({ doctorId, onNavigate }) => {
  const { t } = useLanguage();
  const { doctors, settings } = useData();

  const doctor = doctors.find((d) => d.id === doctorId || d.slug === doctorId);

  if (!doctor) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Shifokor topilmadi</h2>
        <p className="text-slate-500 text-sm mb-6">Tanlangan shifokor profili mavjud emas.</p>
        <button
          onClick={() => onNavigate('doctors')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
        >
          Shifokorlar ro‘yxatiga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="py-10 md:py-16 bg-[#F6FAFD] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <button
          onClick={() => onNavigate('doctors')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Barcha shifokorlarga qaytish</span>
        </button>

        {/* Doctor Header Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200/80 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Photo Column */}
            <div className="lg:col-span-4">
              <div className="relative rounded-2xl overflow-hidden shadow-md aspect-[3/4] bg-slate-100 mb-4">
                <img
                  src={doctor.photo}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{doctor.rating} / 5.0 ({doctor.reviewsCount} bemor bahosi)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <a
                  href={`tel:${doctor.phone || settings?.phone}`}
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>Telefon qilish: {doctor.phone || settings?.phone}</span>
                </a>

                {doctor.telegram && (
                  <a
                    href={`https://t.me/${doctor.telegram.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4 text-sky-600" />
                    <span>Telegram orqali bog‘lanish</span>
                  </a>
                )}
              </div>
            </div>

            {/* Details Column */}
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                  {doctor.specialty}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                  {doctor.experienceYears} {t.doctors.experience}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-2">
                {doctor.name}
              </h1>

              <p className="text-sm font-semibold text-teal-700 mb-6 flex items-center gap-2">
                <Award className="w-4 h-4" />
                {doctor.qualification}
              </p>

              {/* Key Meta Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100 text-xs mb-8">
                <div>
                  <span className="text-slate-500 block mb-1">Konsultatsiya to‘lovi:</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {doctor.consultationPrice.toLocaleString()} so‘m
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Ish kunlari:
                  </span>
                  <span className="font-semibold text-slate-800">
                    {doctor.workingDays.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Qabul soatlari:</span>
                  <span className="font-semibold text-slate-800">{doctor.workingHours}</span>
                </div>
              </div>

              {/* Biography */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Shifokor haqida
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {doctor.biography}
                </p>
              </div>

              {/* Education */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>Ma’lumoti va malaka oshiruvi</span>
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">{doctor.education}</p>
              </div>

              {/* Provided Services */}
              {doctor.services.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Ko‘rsatadigan xizmatlari va amaliyotlar
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {doctor.services.map((srv, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-xs font-semibold text-slate-800 border border-slate-100"
                      >
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clinic Location */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center gap-3 text-xs text-blue-900">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <span className="font-bold">Qabul o‘tkaziladigan joy:</span>{' '}
                  {settings?.address || 'MEDCARE markaziy filiali'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Booking for this Doctor */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-[#0A2540] tracking-tight mb-4">
            {doctor.name} qabuliga onlayn yozilish
          </h2>
          <QuickAppointmentSection initialDoctorId={doctor.id} embedded={true} />
        </div>
      </div>
    </div>
  );
};
