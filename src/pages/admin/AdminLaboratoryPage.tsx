import React, { useState } from 'react';
import { FlaskConical, Plus, Search, Edit, Trash2, AlertCircle } from 'lucide-react';
import { LaboratoryTest, LabCategory } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';

export const AdminLaboratoryPage: React.FC = () => {
  const { getAuthHeaders } = useAuth();
  const { laboratory, refreshData } = useData();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<LaboratoryTest | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<LabCategory>('Umumiy tahlillar');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(65000);
  const [resultDurationDays, setResultDurationDays] = useState<number>(1);
  const [resultDurationText, setResultDurationText] = useState('1 ish kuni');
  const [sampleType, setSampleType] = useState('Venoz qon');
  const [preparation, setPreparation] = useState('Ertalab och qoringa qon topshirish.');
  const [active, setActive] = useState(true);

  const openCreateModal = () => {
    setEditingTest(null);
    setCode(`LAB-${Date.now().toString().slice(-3)}`);
    setName('');
    setCategory('Umumiy tahlillar');
    setDescription('');
    setPrice(65000);
    setResultDurationDays(1);
    setResultDurationText('1 ish kuni');
    setSampleType('Venoz qon');
    setPreparation('Ertalab och qoringa qon topshirish.');
    setActive(true);
    setModalOpen(true);
  };

  const openEditModal = (test: LaboratoryTest) => {
    setEditingTest(test);
    setCode(test.code);
    setName(test.name);
    setCategory(test.category);
    setDescription(test.description);
    setPrice(test.price);
    setResultDurationDays(test.resultDurationDays);
    setResultDurationText(test.resultDurationText);
    setSampleType(test.sampleType);
    setPreparation(test.preparation);
    setActive(test.active);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      code: code.trim(),
      name: name.trim(),
      category,
      description: description.trim(),
      price: Number(price) || 0,
      resultDurationDays: Number(resultDurationDays) || 1,
      resultDurationText: resultDurationText.trim(),
      sampleType: sampleType.trim(),
      preparation: preparation.trim(),
      active,
    };

    try {
      const url = editingTest ? `/api/admin/laboratory/${editingTest.id}` : '/api/admin/laboratory';
      const method = editingTest ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Tahlilni saqlashda xatolik');

      showToast('success', editingTest ? 'Tahlil yangilandi' : 'Yangi tahlil qo‘shildi');
      setModalOpen(false);
      refreshData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/laboratory/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('O‘chirishda xatolik');
      showToast('success', 'Tahlil o‘chirildi');
      setDeleteId(null);
      refreshData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const filtered = laboratory.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Laboratoriya Boshqaruvi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Qon, biokimyo va immunologik tahlillar ro‘yxati, muddatlari va narxlari
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tahlil qidirish..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 shadow-xs"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-[#0B5ED7] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi tahlil</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-5">Kodi</th>
                <th className="py-3.5 px-4">Tahlil nomi</th>
                <th className="py-3.5 px-4">Toifasi</th>
                <th className="py-3.5 px-4">Narxi</th>
                <th className="py-3.5 px-4">Muddati</th>
                <th className="py-3.5 px-4">Namuna</th>
                <th className="py-3.5 px-4">Holat</th>
                <th className="py-3.5 px-5 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-blue-700">{item.code}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{item.name}</td>
                  <td className="py-3.5 px-4">{item.category}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{item.price.toLocaleString()} so‘m</td>
                  <td className="py-3.5 px-4 text-slate-500">{item.resultDurationText}</td>
                  <td className="py-3.5 px-4 text-slate-500">{item.sampleType}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {item.active ? 'Faol' : 'Nofaol'}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
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
              {editingTest ? 'Tahlilni tahrirlash' : 'Yangi tahlil qo‘shish'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tahlil kodi *
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    placeholder="LAB-101"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Toifasi
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as LabCategory)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Umumiy tahlillar">Umumiy tahlillar</option>
                    <option value="Biokimyo">Biokimyo</option>
                    <option value="Gormonlar">Gormonlar</option>
                    <option value="Immunologiya">Immunologiya</option>
                    <option value="Vitaminlar">Vitaminlar</option>
                    <option value="Infeksiya testlari">Infeksiya testlari</option>
                    <option value="Boshqa">Boshqa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tahlil nomi *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Umumiy qon tahlili"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Namuna turi
                  </label>
                  <input
                    type="text"
                    value={sampleType}
                    onChange={(e) => setSampleType(e.target.value)}
                    placeholder="Venoz qon"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tayyor bo‘lish muddati matni
                </label>
                <input
                  type="text"
                  value={resultDurationText}
                  onChange={(e) => setResultDurationText(e.target.value)}
                  placeholder="1 ish kuni (soat 16:00 gacha)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tahlil tavsifi
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
                  value={preparation}
                  onChange={(e) => setPreparation(e.target.value)}
                  placeholder="Ertalab och qoringa..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="lab-active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="lab-active" className="text-xs font-bold text-slate-700">
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
            <h3 className="font-bold text-base mb-1">Tahlilni o‘chirish</h3>
            <p className="text-xs text-slate-500 mb-6">Ushbu tahlil katalogdan o‘chiriladi.</p>
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
