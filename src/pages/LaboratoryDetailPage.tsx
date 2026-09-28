import React from 'react';
import {
  FlaskConical,
  Clock,
  ShieldAlert,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useData } from '../context/DataContext.tsx';
import { QuickAppointmentSection } from '../components/booking/QuickAppointmentSection.tsx';

interface LaboratoryDetailPageProps {
  testId: string;
  onNavigate: (route: string, param?: string) => void;
}

export const LaboratoryDetailPage: React.FC<LaboratoryDetailPageProps> = ({
  testId,
  onNavigate,
}) => {
  const { t } = useLanguage();
  const { laboratory } = useData();

  const test = laboratory.find((l) => l.id === testId || l.code === testId);

  if (!test) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Tahlil topilmadi</h2>
        <p className="text-slate-500 text-sm mb-6">Tanlangan laboratoriya tahlili mavjud emas.</p>
        <button
          onClick={() => onNavigate('laboratory')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
        >
          Laboratoriya katalogiga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="py-10 md:py-16 bg-[#F6FAFD] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => onNavigate('laboratory')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Laboratoriya katalogiga qaytish</span>
        </button>

        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200/80 mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
              {test.code}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              {test.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4 leading-snug">
            {test.name}
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed mb-8">
            {test.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#F8FAFC] border border-slate-100 text-xs mb-8">
            <div>
              <span className="text-slate-400 block mb-1">Tahlil narxi:</span>
              <span className="text-lg font-black text-[#0B5ED7]">
                {test.price.toLocaleString()} so‘m
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Muddati:
              </span>
              <span className="font-semibold text-slate-800">{test.resultDurationText}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Tekshiriluvchi namuna:</span>
              <span className="font-semibold text-slate-800">{test.sampleType}</span>
            </div>
          </div>

          {/* Preparation Instructions */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Tahlilga tayyorgarlik ko‘rsatmasi</span>
            </h3>
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm text-amber-950 leading-relaxed">
              {test.preparation}
            </div>
          </div>

          {/* Medical Notice */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Eslatma: Laboratoriya tahlillari natijalari kasallik tashxisi hisoblanmaydi. Tahlil natijalarini to‘g‘ri baholash va davolash rejasini tuzish uchun shifokor mutaxassis ko‘rigi talab qilinadi.
            </span>
          </div>
        </div>

        {/* Booking */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Tahlil topshirish uchun qabulga yozilish
          </h2>
          <QuickAppointmentSection initialServiceId={test.id} embedded={true} />
        </div>
      </div>
    </div>
  );
};
