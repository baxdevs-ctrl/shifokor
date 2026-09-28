import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, Calendar, Trash2, Edit, AlertCircle, Loader2 } from 'lucide-react';
import { Patient } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';

export const AdminPatientsPage: React.FC = () => {
  const { getAuthHeaders } = useAuth();
  const { showToast } = useToast();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/patients', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setPatients(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSaveNotes = async () => {
    if (!editPatient) return;
    try {
      const res = await fetch(`/api/admin/patients/${editPatient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          notes: editPatient.notes,
          email: editPatient.email,
        }),
      });

      if (!res.ok) throw new Error('Saqlashda xatolik');
      showToast('success', 'Bemor ma’lumotlari yangilandi');
      setEditPatient(null);
      fetchPatients();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/patients/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('O‘chirishda xatolik');
      showToast('success', 'Bemor o‘chirildi');
      setDeleteId(null);
      fetchPatients();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const filtered = patients.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.fullName.toLowerCase().includes(q) || p.phone.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Bemorlar Ro‘yxati
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Qabulga yozilgan barcha bemorlar profillari va murojaatlar soni
          </p>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ism yoki telefon qidirish..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 shadow-xs"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Bemorlar yuklanmoqda...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-5">To‘liq Ism</th>
                  <th className="py-3.5 px-4">Telefon</th>
                  <th className="py-3.5 px-4">Qabullar Soni</th>
                  <th className="py-3.5 px-4">Tug‘ilgan Sana</th>
                  <th className="py-3.5 px-4">Qaydlar / Eslatma</th>
                  <th className="py-3.5 px-5 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Bemorlar topilmadi
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-slate-900">{p.fullName}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">{p.phone}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-extrabold text-[11px]">
                          {p.appointmentsCount} ta
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{p.dateOfBirth || '—'}</td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{p.notes || '—'}</td>
                      <td className="py-3.5 px-5 text-right space-x-2">
                        <button
                          onClick={() => setEditPatient({ ...p })}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-blue-600"
                          title="Tahrirlash"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"
                          title="O‘chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Notes Modal */}
      {editPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Bemor ma’lumotlarini tahrirlash
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-semibold">{editPatient.fullName}</p>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Email manzili
                </label>
                <input
                  type="email"
                  value={editPatient.email || ''}
                  onChange={(e) => setEditPatient({ ...editPatient, email: e.target.value })}
                  placeholder="bemor@mail.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Eslatma va qaydlar
                </label>
                <textarea
                  rows={3}
                  value={editPatient.notes || ''}
                  onChange={(e) => setEditPatient({ ...editPatient, notes: e.target.value })}
                  placeholder="Bemor haqida maxsus eslatma..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditPatient(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSaveNotes}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center">
            <AlertCircle className="w-10 h-10 text-rose-600 mx-auto mb-3" />
            <h3 className="font-bold text-base mb-1">Bemorni o‘chirish</h3>
            <p className="text-xs text-slate-500 mb-6">Bemor yozuvi butunlay o‘chiriladi.</p>
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
