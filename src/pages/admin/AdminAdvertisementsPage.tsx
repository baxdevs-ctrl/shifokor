import React, { useState } from 'react';
import { Megaphone, Plus, Search, Edit, Trash2, AlertCircle, Eye, Sparkles } from 'lucide-react';
import { Advertisement, AdPlacement } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';

export const AdminAdvertisementsPage: React.FC = () => {
  const { getAuthHeaders } = useAuth();
  const { advertisements, refreshData } = useData();
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [image, setImage] = useState('');
  const [buttonText, setButtonText] = useState('Batafsil');
  const [buttonUrl, setButtonUrl] = useState('/services');
  const [placement, setPlacement] = useState<AdPlacement>('home_banner');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [priority, setPriority] = useState<number>(1);
  const [active, setActive] = useState(true);

  const openCreateModal = () => {
    setEditingAd(null);
    setTitle('');
    setSubtitle('');
    setImage('https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200');
    setButtonText('Batafsil ma’lumot');
    setButtonUrl('/msct');
    setPlacement('home_banner');
    setStartDate(new Date().toISOString().split('T')[0]);
    const end = new Date();
    end.setDate(end.getDate() + 60);
    setEndDate(end.toISOString().split('T')[0]);
    setPriority(1);
    setActive(true);
    setModalOpen(true);
  };

  const openEditModal = (ad: Advertisement) => {
    setEditingAd(ad);
    setTitle(ad.title);
    setSubtitle(ad.subtitle);
    setImage(ad.image);
    setButtonText(ad.buttonText);
    setButtonUrl(ad.buttonUrl);
    setPlacement(ad.placement);
    setStartDate(ad.startDate);
    setEndDate(ad.endDate);
    setPriority(ad.priority);
    setActive(ad.active);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      image: image.trim(),
      buttonText: buttonText.trim() || 'Batafsil',
      buttonUrl: buttonUrl.trim() || '/services',
      placement,
      startDate,
      endDate,
      priority: Number(priority) || 1,
      active,
    };

    try {
      const url = editingAd ? `/api/admin/advertisements/${editingAd.id}` : '/api/admin/advertisements';
      const method = editingAd ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Reklamani saqlashda xatolik');

      showToast('success', editingAd ? 'Reklama yangilandi' : 'Yangi reklama yaratildi');
      setModalOpen(false);
      refreshData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/advertisements/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('O‘chirishda xatolik');
      showToast('success', 'Reklama o‘chirildi');
      setDeleteId(null);
      refreshData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Reklama va Bannerlar Tizimi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Saytdagi maxsus bannerlar, joylashuv o‘rinlari va pop-up e’lonlar
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#0B5ED7] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi reklama qo‘shish</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-5">Reklama nomi</th>
                <th className="py-3.5 px-4">Joylashuv (Placement)</th>
                <th className="py-3.5 px-4">Tugma manzili</th>
                <th className="py-3.5 px-4">Ustuvorlik</th>
                <th className="py-3.5 px-4">Muddati</th>
                <th className="py-3.5 px-4">Holat</th>
                <th className="py-3.5 px-5 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {advertisements.map((ad) => (
                <tr key={ad.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <img src={ad.image} alt={ad.title} className="w-10 h-7 object-cover rounded-lg" />
                      <div>
                        <p className="font-bold text-slate-900">{ad.title}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-xs">{ad.subtitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                      {ad.placement}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-blue-700">{ad.buttonUrl}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{ad.priority}</td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500">
                    {ad.startDate} — {ad.endDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ad.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {ad.active ? 'Faol' : 'Nofaol'}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(ad)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(ad.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Modal with Live Banner Preview */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 my-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingAd ? 'Reklamani tahrirlash' : 'Yangi reklama qo‘shish'}
            </h3>

            {/* Live Preview Card */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Saytdagi ko‘rinishining oldindan tahlili (Preview):
              </span>
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900 via-indigo-900 to-[#0A2540] text-white p-5">
                <div
                  className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30"
                  style={{ backgroundImage: `url(${image})` }}
                />
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-extrabold text-base mb-1">{title || 'Reklama sarlavhasi'}</h4>
                    <p className="text-xs text-slate-300">{subtitle || 'Qisqacha izoh yoki da’vat matni'}</p>
                  </div>
                  <button className="px-4 py-2 bg-teal-400 text-slate-950 font-bold text-xs rounded-lg shrink-0">
                    {buttonText || 'Batafsil'}
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Reklama Sarlavhasi *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Yangi 128 qatlamli MSCT diagnostikasi!"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kichik sarlavha (subtitle)
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Minimal nurlanish va yuqori aniqlikdagi tasvirlar"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Joylashuv o‘rni (Placement)
                  </label>
                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value as AdPlacement)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="home_hero">Bosh sahifa (Hero osti)</option>
                    <option value="home_banner">Bosh sahifa (Katta banner)</option>
                    <option value="services_page">Xizmatlar sahifasi</option>
                    <option value="msct_page">MSCT sahifasi</option>
                    <option value="laboratory_page">Laboratoriya sahifasi</option>
                    <option value="sidebar">Yon panel (Sidebar)</option>
                    <option value="popup">Pop-up oyna (Vaqtli modal)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Ustuvorlik (Priority)
                  </label>
                  <input
                    type="number"
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tugma matni
                  </label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="Batafsil"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tugma yo‘naltirish URL manzili
                  </label>
                  <input
                    type="text"
                    value={buttonUrl}
                    onChange={(e) => setButtonUrl(e.target.value)}
                    placeholder="/msct yoki /booking"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Boshlanish sanasi
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tugash sanasi
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Orqa fon rasm URL manzili
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ad-active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="ad-active" className="text-xs font-bold text-slate-700">
                  Faol reklama kampaniyasi sifatida ko‘rsatilsin
                </label>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0B5ED7] hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center">
            <AlertCircle className="w-10 h-10 text-rose-600 mx-auto mb-3" />
            <h3 className="font-bold text-base mb-1">Reklamani o‘chirish</h3>
            <p className="text-xs text-slate-500 mb-6">Ushbu reklama butunlay o‘chiriladi.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
              >
                O‘chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
