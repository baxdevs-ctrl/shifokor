import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Stethoscope,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useData } from '../../context/DataContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { Doctor } from '../../types/index.ts';

interface QuickAppointmentSectionProps {
  initialDoctorId?: string;
  initialServiceId?: string;
  embedded?: boolean;
}

export const QuickAppointmentSection: React.FC<QuickAppointmentSectionProps> = ({
  initialDoctorId,
  initialServiceId,
  embedded = false,
}) => {
  const { t } = useLanguage();
  const { doctors, services, msct, settings } = useData();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(initialDoctorId || '');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId || '');
  const [date, setDate] = useState<string>(() => {
    // Tomorrow by default or today if early
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [comment, setComment] = useState('');
  const [consent, setConsent] = useState(true);

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Set default doctor if initial provided
  useEffect(() => {
    if (initialDoctorId) {
      setSelectedDoctorId(initialDoctorId);
      const doc = doctors.find((d) => d.id === initialDoctorId);
      if (doc) setSelectedSpecialty(doc.specialtyKey);
    } else if (doctors.length > 0 && !selectedDoctorId) {
      setSelectedDoctorId(doctors[0].id);
    }
  }, [initialDoctorId, doctors]);

  // Fetch available slots when doctor or date changes
  useEffect(() => {
    if (!selectedDoctorId || !date) return;

    let isMounted = true;
    async function loadSlots() {
      try {
        setLoadingSlots(true);
        const res = await fetch(
          `/api/appointments/slots?doctorId=${encodeURIComponent(selectedDoctorId)}&date=${encodeURIComponent(date)}`
        );
        if (res.ok && isMounted) {
          const data = await res.json();
          setAvailableSlots(data.slots || []);
          if (data.slots && data.slots.length > 0) {
            setSelectedTime(data.slots[0]);
          } else {
            setSelectedTime('');
          }
        }
      } catch (err) {
        console.error('Error loading slots:', err);
      } finally {
        if (isMounted) setLoadingSlots(false);
      }
    }

    loadSlots();
    return () => {
      isMounted = false;
    };
  }, [selectedDoctorId, date]);

  // Filter doctors by specialty
  const filteredDoctors = doctors.filter((doc) => {
    if (!doc.active) return false;
    if (selectedSpecialty === 'all') return true;
    return doc.specialtyKey === selectedSpecialty;
  });

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = 'Iltimos, ism va familiyangizni to‘liq kiriting.';
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      errs.phone = 'Iltimos, to‘g‘ri telefon raqamingizni kiriting.';
    }

    if (!selectedDoctorId) {
      errs.doctorId = 'Iltimos, shifokorni tanlang.';
    }

    if (!date) {
      errs.date = 'Iltimos, qabul sanasini tanlang.';
    }

    if (!selectedTime) {
      errs.time = 'Iltimos, qabul vaqtini tanlang.';
    }

    if (!consent) {
      errs.consent = 'Shaxsiy ma’lumotlarni qayta ishlashga rozilik bildirilishi shart.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('error', 'Iltimos, barcha majburiy maydonlarni to‘ldiring');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          doctorId: selectedDoctorId,
          serviceId: selectedServiceId || undefined,
          date,
          time: selectedTime,
          comment: comment.trim(),
          consent,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Qabulga yozilishda xatolik');
      }

      setShowSuccessModal(true);
      showToast('success', 'Arizangiz muvaffaqiyatli yuborildi!');
      // Reset some fields
      setFullName('');
      setPhone('');
      setComment('');
    } catch (err: any) {
      showToast('error', 'Xatolik', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <section
      id="quick-appointment-section"
      className={
        embedded
          ? 'w-full'
          : 'py-16 md:py-24 bg-gradient-to-b from-blue-50/50 via-white to-slate-50'
      }
    >
      <div className={embedded ? '' : 'max-w-7xl mx-auto px-4 sm:px-6'}>
        {!embedded && (
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold mb-3">
              <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Tezkor onlayn qabul</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0A2540] tracking-tight mb-3">
              {t.booking.title}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {t.booking.subtitle}
            </p>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Info Column */}
            <div className="lg:col-span-4 bg-gradient-to-br from-[#0A2540] to-blue-950 p-6 sm:p-8 text-white flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold mb-6">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Qulay va navbatsiz</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold mb-4 leading-snug">
                  Nega aynan MEDCARE klinikasini tanlashadi?
                </h3>

                <ul className="space-y-4 text-xs sm:text-sm text-slate-300 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>15 yildan ortiq tajribaga ega yetakchi jarroh va tor mutaxassislar.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>128 qatlamli past dozali nurlanishga ega yangi avlod MSCT tomografi.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Natijalarni 24 soat ichida Telegram orqali yuborish tizimi.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Bemor ma'lumotlarining to'liq maxfiyligi va xalqaro sanitariya kafolati.</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300">
                <p className="font-semibold text-white mb-1">Savollaringiz bormi?</p>
                <p className="text-slate-400 mb-2">Qabul bo‘yicha qo‘ng‘iroq qiling:</p>
                <a
                  href={`tel:${settings?.phone || '+998712008800'}`}
                  className="font-bold text-teal-300 text-sm flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {settings?.phone || '+998 71 200 88 00'}
                </a>
              </div>
            </div>

            {/* Right Booking Form */}
            <div className="lg:col-span-8 p-6 sm:p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      {t.booking.fullName} *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) setErrors({ ...errors, fullName: '' });
                        }}
                        placeholder={t.booking.fullNamePlaceholder}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${
                          errors.fullName
                            ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                            : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                        }`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-rose-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      {t.booking.phone} *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) setErrors({ ...errors, phone: '' });
                        }}
                        placeholder={t.booking.phonePlaceholder}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${
                          errors.phone
                            ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                            : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-rose-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Doctor Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Mutaxassislik yo‘nalishi
                    </label>
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => {
                        const newSpec = e.target.value;
                        setSelectedSpecialty(newSpec);
                        // Reset doctor if not matching
                        const match = doctors.find(
                          (d) => newSpec === 'all' || d.specialtyKey === newSpec
                        );
                        if (match) setSelectedDoctorId(match.id);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="all">Barcha yo‘nalishlar</option>
                      <option value="surgery">Jarrohlik</option>
                      <option value="ent">LOR / Otolaringologiya</option>
                      <option value="msct">MSCT / KT diagnostika</option>
                      <option value="laboratory">Laboratoriya</option>
                      <option value="ophthalmology">Oftalmologiya</option>
                      <option value="dentistry">Stomatologiya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      {t.booking.doctor} *
                    </label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <select
                        value={selectedDoctorId}
                        onChange={(e) => {
                          setSelectedDoctorId(e.target.value);
                          if (errors.doctorId) setErrors({ ...errors, doctorId: '' });
                        }}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-800 bg-white focus:outline-none transition-all ${
                          errors.doctorId
                            ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                            : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                        }`}
                      >
                        <option value="">{t.booking.selectDoctor}</option>
                        {filteredDoctors.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} — {d.specialty} ({d.consultationPrice.toLocaleString()} so‘m)
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.doctorId && (
                      <p className="text-rose-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.doctorId}
                      </p>
                    )}
                  </div>
                </div>

                {/* Date & Time Slot Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      {t.booking.date} *
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        min={minDate}
                        max={maxDate}
                        value={date}
                        onChange={(e) => {
                          setDate(e.target.value);
                          if (errors.date) setErrors({ ...errors, date: '' });
                        }}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none transition-all ${
                          errors.date
                            ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                            : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                        }`}
                      />
                    </div>
                    {errors.date && (
                      <p className="text-rose-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.date}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>{t.booking.time} *</span>
                      {loadingSlots && (
                        <span className="text-[11px] font-normal text-blue-600 flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Vaqtlar tekshirilmoqda...
                        </span>
                      )}
                    </label>

                    {availableSlots.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-slate-50">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => {
                              setSelectedTime(slot);
                              if (errors.time) setErrors({ ...errors, time: '' });
                            }}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                              selectedTime === slot
                                ? 'bg-[#0B5ED7] text-white shadow-sm'
                                : 'bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                        {loadingSlots ? 'Yuklanmoqda...' : t.booking.noSlots}
                      </div>
                    )}

                    {errors.time && (
                      <p className="text-rose-600 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.time}
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Comment */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {t.booking.comment}
                  </label>
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t.booking.commentPlaceholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Required Privacy Consent Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => {
                        setConsent(e.target.checked);
                        if (errors.consent) setErrors({ ...errors, consent: '' });
                      }}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 mt-0.5 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      {t.booking.consentText}
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="text-rose-600 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.consent}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#0B5ED7] to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t.booking.submittingBtn}</span>
                      </>
                    ) : (
                      <>
                        <CalendarIcon className="w-4 h-4" />
                        <span>{t.booking.submitBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {t.booking.successTitle}
            </h3>

            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              {t.booking.successDesc}
            </p>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-left text-xs text-slate-700 space-y-1 mb-6">
              <p>
                <span className="font-semibold text-slate-900">Sana va vaqt:</span> {date} — {selectedTime}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Holat:</span>{' '}
                <span className="inline-block px-2 py-0.5 rounded-full bg-blue-200/80 text-blue-900 font-bold text-[10px]">
                  YANGI (Klinika tasdiqlashi kutilmoqda)
                </span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 px-4 bg-[#0B5ED7] hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors"
              >
                {t.booking.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
