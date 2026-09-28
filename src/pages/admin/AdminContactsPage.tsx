import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Trash2, CheckCircle2, Clock, Archive, Loader2 } from 'lucide-react';
import { ContactMessage } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';

export const AdminContactsPage: React.FC = () => {
  const { getAuthHeaders } = useAuth();
  const { showToast } = useToast();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/contacts', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setMessages(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'NEW' | 'READ' | 'ARCHIVED') => {
    try {
      const res = await fetch(`/api/admin/contacts/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Holatni o‘zgartirishda xatolik');
      showToast('success', 'Xabar holati yangilandi');
      fetchContacts();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('O‘chirishda xatolik');
      showToast('success', 'Xabar o‘chirildi');
      fetchContacts();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const filtered = messages.filter((m) => {
    if (filterStatus !== 'all' && m.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Murojaatlar va Xabarlar
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sayt kontakt shakli orqali bemorlardan kelib tushgan savol va murojaatlar
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'NEW', 'READ', 'ARCHIVED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === st
                  ? 'bg-[#0B5ED7] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {st === 'all' && 'Barchasi'}
              {st === 'NEW' && 'Yangi'}
              {st === 'READ' && 'O‘qilgan'}
              {st === 'ARCHIVED' && 'Arxiv'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Xabarlar yuklanmoqda...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            Xabarlar mavjud emas
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((m) => (
              <div key={m.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-slate-900">{m.name}</span>
                    <span className="font-mono text-xs text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full font-bold">
                      {m.phone}
                    </span>
                    {m.email && <span className="text-xs text-slate-400">{m.email}</span>}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {new Date(m.createdAt).toLocaleString()}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.status === 'NEW'
                          ? 'bg-amber-100 text-amber-800'
                          : m.status === 'READ'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {m.status === 'NEW' ? 'Yangi' : m.status === 'READ' ? 'O‘qilgan' : 'Arxiv'}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4 whitespace-pre-wrap bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {m.message}
                </p>

                <div className="flex items-center justify-end gap-2 text-xs">
                  {m.status === 'NEW' && (
                    <button
                      onClick={() => handleUpdateStatus(m.id, 'READ')}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg"
                    >
                      O‘qildi deb belgilash
                    </button>
                  )}
                  {m.status !== 'ARCHIVED' && (
                    <button
                      onClick={() => handleUpdateStatus(m.id, 'ARCHIVED')}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                    >
                      Arxivlash
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                    title="O‘chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
