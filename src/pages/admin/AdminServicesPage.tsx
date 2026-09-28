import React, { useState } from 'react';
import { Activity, Plus, Search, Edit, Trash2, AlertCircle } from 'lucide-react';
import { MedicalService, ServiceCategory } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';

export const AdminServicesPage: React.FC = () => {
  const { getAuthHeaders } = useAuth();
  const { services, refreshData } = useData();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<MedicalService | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('surgery');
  const [categoryNameUz, setCategoryNameUz] = useState('Jarrohlik');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(200000);
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [preparationInstructions, setPreparationInstructions] = useState('');
  const [active, setActive] = useState(true);

  const openCreateModal = () => {
    setEditingService(null);
    setName('');
    setCategory('surgery');
    setCategoryNameUz('Jarrohlik');
    setDescription('');
    setPrice(200000);
    setDurationMinutes(30);
    setPreparationInstructions('');
    setActive(true);
    setModalOpen(true);
  };

  const openEditModal = (srv: MedicalService) => {
    setEditingService(srv);
    setName(srv.name);
    setCategory(srv.category);
    setCategoryNameUz(srv.categoryNameUz);
    setDescription(srv.description);
    setPrice(srv.price);
    setDurationMinutes(srv.durationMinutes);
    setPreparationInstructions(srv.preparationInstructions);
    setActive(srv.active);
    setModalOpen(true);
  };

  const handleCategoryChange = (cat: ServiceCategory) => {
    setCategory(cat);
    const map: Record<ServiceCategory, string> = {
      surgery: 'Jarrohlik',
      ent: 'LOR / ENT',
      msct: 'MSCT / KT',
      laboratory: 'Laboratoriya',
      ophthalmology: 'Oftalmologiya',
      dentistry: 'Stomatologiya',
      cardiology: 'Kardiologiya',
      neurology: 'Nevrologiya',
      other: 'Boshqa',
    };
    setCategoryNameUz(map[cat] || 'Boshqa');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      category,
      categoryNameUz,
      description: description.trim(),
      price: Number(price) || 0,
      durationMinutes: Number(durationMinutes) || 30,
      preparationInstructions: preparationInstructions.trim(),
      active,
    };

    try {
      const url = editingService ? `/api/admin/services/${editingService.id}` : '/api/admin/services';
      const method = editingService ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Xizmatni saqlashda xatolik');

      showToast('success', editingService ? 'Xizmat yangilandi' : 'Yangi xizmat qo‘shildi');
      setModalOpen(false);
      refreshData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('O‘chirishda xatolik');
      showToast('success', 'Xizmat o‘chirildi');
      setDeleteId(null);
      refreshData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const filtered = services.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.categoryNameUz.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Tibbiy Xizmatlar Katalogi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Barcha davolash, operatsiya va diagnostika xizmatlari hamda narxlari
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Xizmat qidirish..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 shadow-xs"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-[#0B5ED7] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi xizmat</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-5">Xizmat nomi</th>
                <th className="py-3.5 px-4">Yo‘nalish</th>
                <th className="py-3.5 px-4">Narxi</th>
                <th className="py-3.5 px-4">Vaqti</th>
                <th className="py-3.5 px-4">Holat</th>
                <th className="py-3.5 px-5 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filtered.map((srv) => (
                <tr key={srv.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5">
                    <p className="font-bold text-slate-900">{srv.name}</p>
                    <p className="text-[11px] text-slate-400 truncate max-w-sm">{srv.description}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                      {srv.categoryNameUz}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-[#0B5ED7]">
                    {srv.price.toLocaleString()} so‘m
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{srv.durationMinutes} daqiqa</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        srv.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {srv.active ? 'Faol' : 'Nofaol'}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(srv)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(srv.id)}
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

      {/* CRUD Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 my-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingService ? 'Xizmatni tahrirlash' : 'Yangi xizmat qo‘shish'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Xizmat nomi *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Masalan: Laparoskopik xoletsistektomiya"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Toifasi
                  </label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value as ServiceCategory)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="surgery">Jarrohlik</option>
                    <option value="ent">LOR</option>
                    <option value="ophthalmology">Oftalmologiya</option>
                    <option value="dentistry">Stomatologiya</option>
                    <option value="cardiology">Kardiologiya</option>
                    <option value="neurology">Nevrologiya</option>
                    <option value="other">Boshqa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Narxi (so‘m) *
                  </label>
                  <input
                    type="number"
                    step="5000"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Davomiyligi (daqiqa)
                </label>
                <input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Qisqacha tavsif
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tayyorgarlik ko‘rsatmasi
                </label>
                <textarea
                  rows={2}
                  value={preparationInstructions}
                  onChange={(e) => setPreparationInstructions(e.target.value)}
                  placeholder="Operatsiyadan oldin och qoringa..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="srv-active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="srv-active" className="text-xs font-bold text-slate-700">
                  Saytda faol ko‘rsatilsin
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
            <h3 className="font-bold text-base mb-1">Xizmatni o‘chirish</h3>
            <p className="text-xs text-slate-500 mb-6">Ushbu xizmat butunlay o‘chiriladi.</p>
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
