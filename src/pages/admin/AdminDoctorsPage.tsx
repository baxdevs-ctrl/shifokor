import React, { useState } from 'react';
import { UserCheck, Plus, Search, Edit, Trash2, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Doctor, ServiceCategory } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';

export const AdminDoctorsPage: React.FC = () => {
  const { getAuthHeaders } = useAuth();
  const { doctors, refreshData } = useData();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Doctor | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [specialtyKey, setSpecialtyKey] = useState<ServiceCategory>('surgery');
  const [experienceYears, setExperienceYears] = useState<number>(10);
  const [qualification, setQualification] = useState('');
  const [education, setEducation] = useState('');
  const [biography, setBiography] = useState('');
  const [consultationPrice, setConsultationPrice] = useState<number>(180000);
  const [workingDays, setWorkingDays] = useState('Dushanba, Seshanba, Chorshanba, Payshanba, Juma');
  const [workingHours, setWorkingHours] = useState('09:00 - 16:00');
  const [phone, setPhone] = useState('+998 71 200 88 00');
  const [telegram, setTelegram] = useState('@doctor');
  const [servicesInput, setServicesInput] = useState('');
  const [active, setActive] = useState(true);

  const openCreateModal = () => {
    setEditingDoc(null);
    setName('');
    setPhoto('https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600');
    setSpecialty('');
    setSpecialtyKey('surgery');
    setExperienceYears(10);
    setQualification('');
    setEducation('');
    setBiography('');
    setConsultationPrice(180000);
    setWorkingDays('Dushanba, Seshanba, Chorshanba, Payshanba, Juma');
    setWorkingHours('09:00 - 16:00');
    setPhone('+998 71 200 88 00');
    setTelegram('@dr_medcare');
    setServicesInput('');
    setActive(true);
    setModalOpen(true);
  };

  const openEditModal = (doc: Doctor) => {
    setEditingDoc(doc);
    setName(doc.name);
    setPhoto(doc.photo);
    setSpecialty(doc.specialty);
    setSpecialtyKey(doc.specialtyKey);
    setExperienceYears(doc.experienceYears);
    setQualification(doc.qualification);
    setEducation(doc.education);
    setBiography(doc.biography);
    setConsultationPrice(doc.consultationPrice);
    setWorkingDays(doc.workingDays.join(', '));
    setWorkingHours(doc.workingHours);
    setPhone(doc.phone);
    setTelegram(doc.telegram);
    setServicesInput(doc.services.join('\n'));
    setActive(doc.active);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !specialty.trim()) {
      showToast('error', 'Ism va mutaxassislik kiritilishi shart');
      return;
    }

    setSubmitting(true);
    const payload = {
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      photo: photo.trim() || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
      specialty: specialty.trim(),
      specialtyKey,
      experienceYears: Number(experienceYears) || 0,
      qualification: qualification.trim(),
      education: education.trim(),
      biography: biography.trim(),
      services: servicesInput.split('\n').map((s) => s.trim()).filter(Boolean),
      consultationPrice: Number(consultationPrice) || 0,
      workingDays: workingDays.split(',').map((d) => d.trim()).filter(Boolean),
      workingHours: workingHours.trim(),
      phone: phone.trim(),
      telegram: telegram.trim(),
      rating: editingDoc?.rating || 4.9,
      reviewsCount: editingDoc?.reviewsCount || 1,
      active,
    };

    try {
      const url = editingDoc ? `/api/admin/doctors/${editingDoc.id}` : '/api/admin/doctors';
      const method = editingDoc ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Shifokorni saqlashda xatolik');

      showToast('success', editingDoc ? 'Shifokor ma’lumotlari yangilandi' : 'Yangi shifokor qo‘shildi');
      setModalOpen(false);
      refreshData();
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/doctors/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('O‘chirishda xatolik');
      showToast('success', 'Shifokor o‘chirildi');
      setDeleteId(null);
      refreshData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleToggleActive = async (doc: Doctor) => {
    try {
      const res = await fetch(`/api/admin/doctors/${doc.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ active: !doc.active }),
      });
      if (!res.ok) throw new Error('Holatni o‘zgartirishda xatolik');
      showToast('success', `Shifokor holati ${!doc.active ? 'faollashtirildi' : 'nofaol qilindi'}`);
      refreshData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const filtered = doctors.filter((d) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Shifokorlarni Boshqarish
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Klinika shifokorlari ro‘yxati, qabul narxlari va ish jadvallari
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Shifokor qidirish..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 shadow-xs"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-[#0B5ED7] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi shifokor</span>
          </button>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-5">Shifokor</th>
                <th className="py-3.5 px-4">Mutaxassislik</th>
                <th className="py-3.5 px-4">Tajriba</th>
                <th className="py-3.5 px-4">Qabul narxi</th>
                <th className="py-3.5 px-4">Ish vaqti</th>
                <th className="py-3.5 px-4">Holat</th>
                <th className="py-3.5 px-5 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={doc.photo}
                        alt={doc.name}
                        className="w-9 h-9 rounded-xl object-cover shadow-xs"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{doc.name}</p>
                        <p className="text-[10px] text-slate-400">{doc.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{doc.specialty}</td>
                  <td className="py-3.5 px-4">{doc.experienceYears} yil</td>
                  <td className="py-3.5 px-4 font-bold text-blue-700">
                    {doc.consultationPrice.toLocaleString()} so‘m
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{doc.workingHours}</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleActive(doc)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        doc.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {doc.active ? 'Faol' : 'Nofaol'}
                    </button>
                  </td>
                  <td className="py-3.5 px-5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(doc)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-blue-600"
                      title="Tahrirlash"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(doc.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"
                      title="O‘chirish"
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 my-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingDoc ? 'Shifokorni tahrirlash' : 'Yangi shifokor qo‘shish'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    To‘liq Ism *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Dr. Karimov Anvar"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Mutaxassislik nomi *
                  </label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    required
                    placeholder="Bosh jarroh, laparoskopist"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Yo‘nalish kategoriyasi
                  </label>
                  <select
                    value={specialtyKey}
                    onChange={(e) => setSpecialtyKey(e.target.value as ServiceCategory)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="surgery">Jarrohlik</option>
                    <option value="ent">LOR</option>
                    <option value="msct">MSCT / KT</option>
                    <option value="laboratory">Laboratoriya</option>
                    <option value="ophthalmology">Oftalmologiya</option>
                    <option value="dentistry">Stomatologiya</option>
                    <option value="cardiology">Kardiologiya</option>
                    <option value="neurology">Nevrologiya</option>
                    <option value="other">Boshqa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tajriba (yil)
                  </label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Konsultatsiya narxi (so‘m)
                  </label>
                  <input
                    type="number"
                    step="5000"
                    value={consultationPrice}
                    onChange={(e) => setConsultationPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Rasm URL manzili
                </label>
                <input
                  type="url"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Ish kunlari
                  </label>
                  <input
                    type="text"
                    value={workingDays}
                    onChange={(e) => setWorkingDays(e.target.value)}
                    placeholder="Dushanba, Seshanba, Juma"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Ish soatlari
                  </label>
                  <input
                    type="text"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    placeholder="09:00 - 15:00"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Malaka va darajasi
                </label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="Oliy toifali shifokor, fan nomzodi"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Ma’lumot va stajirovkalar
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="Toshkent Tibbiyot Akademiyasi..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Qisqacha biografiya
                </label>
                <textarea
                  rows={2}
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Ko‘rsatadigan xizmatlari (har biri yangi qatorda)
                </label>
                <textarea
                  rows={3}
                  value={servicesInput}
                  onChange={(e) => setServicesInput(e.target.value)}
                  placeholder="Laparoskopik xoletsistektomiya&#10;Gernioplastika"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="doc-active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="doc-active" className="text-xs font-bold text-slate-700">
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
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#0B5ED7] hover:bg-blue-700 text-white text-xs font-bold shadow-md"
                >
                  {submitting ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center">
            <AlertCircle className="w-10 h-10 text-rose-600 mx-auto mb-3" />
            <h3 className="font-bold text-base mb-1">Shifokorni o‘chirish</h3>
            <p className="text-xs text-slate-500 mb-6">Ushbu shifokor profili o‘chiriladi.</p>
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
