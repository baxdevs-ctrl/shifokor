import React from 'react';
import { Calendar, ShieldCheck, Phone, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useData } from '../context/DataContext.tsx';
import { QuickAppointmentSection } from '../components/booking/QuickAppointmentSection.tsx';

interface BookingPageProps {
  param?: string;
  onNavigate: (route: string) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({ param }) => {
  const { t } = useLanguage();
  const { settings } = useData();

  let initialDoctorId: string | undefined = undefined;
  let initialServiceId: string | undefined = undefined;

  if (param) {
    const searchParams = new URLSearchParams(param);
    if (searchParams.get('doctor')) initialDoctorId = searchParams.get('doctor')!;
    if (searchParams.get('service')) initialServiceId = searchParams.get('service')!;
  }

  return (
    <div className="py-10 md:py-16 bg-[#F6FAFD] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>Onlayn qabul tizimi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0A2540] tracking-tight mb-3">
            {t.booking.title}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t.booking.subtitle}
          </p>
        </div>

        <QuickAppointmentSection
          initialDoctorId={initialDoctorId}
          initialServiceId={initialServiceId}
          embedded={true}
        />
      </div>
    </div>
  );
};
