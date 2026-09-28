import React, { useState } from 'react';
import {
  Phone,
  Send,
  MapPin,
  Clock,
  Mail,
  ShieldAlert,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useData } from '../context/DataContext.tsx';
import { useToast } from '../context/ToastContext.tsx';

interface ContactPageProps {
  onNavigate: (route: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { settings } = useData();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Ismingizni kiriting';
    if (!phone.trim() || phone.trim().length < 7) errs.phone = 'Telefon raqamingizni kiriting';
    if (!message.trim() || message.trim().length < 5) errs.message = 'Xabarni to‘liqroq yozing';
    if (!consent) errs.consent = 'Rozilik bildirilishi shart';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          message: message.trim(),
          consent,
        }),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Xabar yuborishda xatolik');
      }

      setSubmitted(true);
      showToast('success', 'Xabaringiz qabul qilindi!');
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      showToast('error', 'Xatolik', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-10 md:py-16 bg-[#F6FAFD] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-[#0A2540] tracking-tight mb-3">
            {t.contact.title}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <a
            href={`tel:${settings?.phone || '+998712008800'}`}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">{t.contact.callBtn}</p>
                <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {settings?.phone || '+998 71 200 88 00'}
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
          </a>

          {settings?.telegram && (
            <a
              href={`https://t.me/${settings.telegram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold">{t.contact.telegramBtn}</p>
                  <p className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    {settings.telegram}
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-sky-600" />
            </a>
          )}

          <a
            href={settings?.googleMapsDirectionsUrl || 'https://maps.google.com'}
            target="_blank"
            rel="noreferrer"
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                <Navigation className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">{t.contact.directionsBtn}</p>
                <p className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  Google Maps xaritasi
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
          </a>
        </div>

        {/* Contact Info & Message Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
          {/* Info Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0A2540] to-blue-950 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="text-2xl font-black mb-6 tracking-tight">
                Klinika rekvizitlari
              </h2>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">{t.contact.address}</p>
                  <p className="text-sm text-slate-200 leading-snug">
                    {settings?.address || "Toshkent shahri, Amir Temur shox ko'chasi, 107-B"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">{t.contact.workingHours}</p>
                  <p className="text-sm text-slate-200">
                    {settings?.workingHoursWeekday || 'Dush - Shan: 08:00 - 20:00'}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {settings?.workingHoursWeekend}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Qabulxona telefonlari</p>
                  <p className="text-sm font-bold text-white">
                    {settings?.phone || '+998 71 200 88 00'}
                  </p>
                  {settings?.phoneSecondary && (
                    <p className="text-xs text-slate-300 mt-0.5">{settings.phoneSecondary}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Elektron pochta</p>
                  <p className="text-sm text-slate-200">{settings?.email || 'info@medcare.uz'}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-rose-950/60 border border-rose-900/60 text-xs text-rose-300 flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white mb-0.5">{t.contact.emergency}</p>
                <p>{settings?.emergencyInfo || 'Shoshilinch tibbiy yordam: 103'}</p>
              </div>
            </div>
          </div>

          {/* Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              {t.contact.sendMessage}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Savolingiz yoki taklifingiz bormi? Xabar qoldiring, administratorlarimiz tezda javob berishadi.
            </p>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-bold text-base text-emerald-950 mb-1">
                  Xabaringiz qabul qilindi!
                </h3>
                <p className="text-xs text-emerald-800 mb-4">
                  Tez orada klinika ma’muriyati ko‘rsatilgan telefon raqami orqali siz bilan bog‘lanadi.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Yana xabar yuborish
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t.contact.name} *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      placeholder="Ism va familiyangiz"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900"
                    />
                    {errors.name && (
                      <p className="text-rose-600 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {t.contact.phone} *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      placeholder="+998 90 123 45 67"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900"
                    />
                    {errors.phone && (
                      <p className="text-rose-600 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.contact.email}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="namuna@mail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.contact.message} *
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors({ ...errors, message: '' });
                    }}
                    placeholder="Xabaringiz yoki savolingiz matnini kiriting..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900"
                  />
                  {errors.message && (
                    <p className="text-rose-600 text-xs mt-1">{errors.message}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => {
                        setConsent(e.target.checked);
                        if (errors.consent) setErrors({ ...errors, consent: '' });
                      }}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 mt-0.5 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600">
                      {t.booking.consentText}
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="text-rose-600 text-xs mt-1">{errors.consent}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#0B5ED7] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Yuborilmoqda...</span>
                    </>
                  ) : (
                    <span>{t.contact.sendBtn}</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Google Maps Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Xaritada joylashuvimiz
              </h2>
              <p className="text-xs text-slate-500">
                {settings?.address || 'Toshkent shahri, Amir Temur shox ko‘chasi, 107-B'}
              </p>
            </div>
            <a
              href={settings?.googleMapsDirectionsUrl || 'https://maps.google.com'}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Xaritada ochish</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="rounded-2xl overflow-hidden aspect-[21/9] sm:aspect-[24/9] border border-slate-200 bg-slate-100">
            <iframe
              src={settings?.googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MEDCARE Clinic location map"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
