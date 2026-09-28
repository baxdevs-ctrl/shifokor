import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { ClinicSettings } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';

export const AdminSettingsPage: React.FC = () => {
  const { getAuthHeaders } = useAuth();
  const { settings, updateSettingsState, refreshData } = useData();
  const { showToast } = useToast();

  const [form, setForm] = useState<ClinicSettings>({
    name: 'MEDCARE',
    tagline: 'Zamonaviy tibbiyot. Ishonchli xizmat.',
    logo: '/logo.svg',
    phone: '+998 71 200 88 00',
    phoneSecondary: '+998 90 123 45 67',
    telegram: '@medcare_uz',
    whatsapp: '+998712008800',
    email: 'info@medcare.uz',
    address: "Toshkent shahri, Amir Temur shox ko'chasi, 107-B",
    workingHoursWeekday: 'Dush - Shan: 08:00 - 20:00',
    workingHoursWeekend: 'Yakshanba: 09:00 - 15:00',
    emergencyInfo: 'Shoshilinch tibbiy yordam: 103 yoki +998 71 200 88 03',
    googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2995.836025178651!2d69.2818!3d41.3325',
    googleMapsDirectionsUrl: 'https://maps.google.com/?q=41.3325,69.2818',
    instagram: 'https://instagram.com/medcare_uz',
    facebook: 'https://facebook.com/medcare.uz',
    telegramChannel: 'https://t.me/medcare_clinic',
    footerText: 'MEDCARE xususiy tibbiyot markazi — xalqaro standartlarga mos diagnostika, zamonaviy jarrohlik va yuqori malakali shifokorlar jamoasi.',
    medicalDisclaimer: 'Saytdagi ma’lumotlar umumiy tanishtirish maqsadida taqdim etilgan. Tibbiy tashxis va davolash bo‘yicha yakuniy qaror faqat malakali mutaxassis shaxsan ko‘rik o‘tkazganidan keyin qabul qilinadi.',
    allowOnlineBooking: true,
    popupAdEnabled: true,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Sozlamalarni saqlashda xatolik');

      const updated = await res.json();
      updateSettingsState(updated);
      showToast('success', 'Klinika sozlamalari muvaffaqiyatli saqlandi!');
      refreshData();
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Klinika Sozlamalari
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Klinika nomi, manzillari, telefonlari, ish vaqti va ijtimoiy tarmoqlar havolalari
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
        {/* Basic Brand */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
            Klinika brendi va shiori
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Klinika nomi
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Klinika shiori (Tagline)
              </label>
              <input
                type="text"
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Contacts */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
            Aloqa ma’lumotlari
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Asosiy telefon raqam
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Qo‘shimcha telefon raqam
              </label>
              <input
                type="text"
                name="phoneSecondary"
                value={form.phoneSecondary}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Telegram profil / bot
              </label>
              <input
                type="text"
                name="telegram"
                value={form.telegram}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Elektron pochta (Email)
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Address and Hours */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
            Manzil va Ish tartibi
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Klinika to‘liq manzili
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Ish kunlari va vaqtlari
                </label>
                <input
                  type="text"
                  name="workingHoursWeekday"
                  value={form.workingHoursWeekday}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Dam olish / Navbatchilik vaqti
                </label>
                <input
                  type="text"
                  name="workingHoursWeekend"
                  value={form.workingHoursWeekend}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Shoshilinch tibbiy yordam ma’lumoti
              </label>
              <input
                type="text"
                name="emergencyInfo"
                value={form.emergencyInfo}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Map Links */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
            Google Maps integratsiyasi
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Google Maps Embed URL (Iframe src)
              </label>
              <input
                type="text"
                name="googleMapsEmbedUrl"
                value={form.googleMapsEmbedUrl}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Google Maps Yo‘nalish ochish havolasi (Directions)
              </label>
              <input
                type="text"
                name="googleMapsDirectionsUrl"
                value={form.googleMapsDirectionsUrl}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Footers and Disclaimers */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
            Footer va Tibbiy ogohlantirish matnlari
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Footer tavsifi
              </label>
              <textarea
                rows={2}
                name="footerText"
                value={form.footerText}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Majburiy tibbiy ogohlantirish (Disclaimer)
              </label>
              <textarea
                rows={2}
                name="medicalDisclaimer"
                value={form.medicalDisclaimer}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        {/* Feature Switches */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
            Qo‘shimcha imkoniyatlar
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="allowOnlineBooking"
                checked={form.allowOnlineBooking}
                onChange={handleChange}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-800">
                Onlayn qabulga yozilish tizimi faol bo‘lsin
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="popupAdEnabled"
                checked={form.popupAdEnabled}
                onChange={handleChange}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-800">
                Saytda reklama Pop-up oynasi ko‘rsatilsin
              </span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#0B5ED7] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saqlanmoqda...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>O‘zgarishlarni saqlash</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
