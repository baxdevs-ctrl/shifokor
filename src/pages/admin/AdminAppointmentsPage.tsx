import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Edit,
  Eye,
  Plus,
  Loader2,
  CalendarDays,
  List,
  AlertCircle,
} from 'lucide-react';
import { Appointment, AppointmentStatus, Doctor } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';

export const AdminAppointmentsPage: React.FC = () => {
  const { getAuthHeaders } = useAuth();
  const { doctors, services } = useData();
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');

  // Filters & search
  const [search, setSearch] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState('');

  // Selected appointment for details or status change
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<AppointmentStatus>('CONFIRMED');
  const [statusNotes, setStatusNotes] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/appointments', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async () => {
    if (!selectedApt) return;
    try {
      const res = await fetch(`/api/admin/appointments/${selectedApt.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          status: targetStatus,
          notes: statusNotes.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error('Holatni o‘zgartirishda xatolik');

      showToast('success', 'Qabul holati yangilandi');
      setStatusModalOpen(false);
      setSelectedApt(null);
      setStatusNotes('');
      fetchAppointments();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error('O‘chirishda xatolik');

      showToast('success', 'Qabul arizasi o‘chirildi');
      setDeleteConfirmId(null);
      fetchAppointments();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  // Filter logic
  const filteredAppointments = appointments.filter((apt) => {
    if (filterDoctor !== 'all' && apt.doctorId !== filterDoctor) return false;
    if (filterStatus !== 'all' && apt.status !== filterStatus) return false;
    if (filterDate && apt.date !== filterDate) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = apt.patientName.toLowerCase().includes(q);
      const matchPhone = apt.phone.includes(q);
      const matchDoc = apt.doctorName.toLowerCase().includes(q);
      return matchName || matchPhone || matchDoc;
    }
    return true;
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800">
            YANGI
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
            TASDIQLANGAN
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700">
            YAKUNLANGAN
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800">
            BEKOR QILINGAN
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Qabullarni Boshqarish
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Barcha onlayn arizalar, vaqtlar va shifokorlar bandligi
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table' ? 'bg-[#0B5ED7] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Jadval</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'calendar' ? 'bg-[#0B5ED7] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Kalendar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Bemor ismi yoki telefon raqami..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900"
          />
        </div>

        {/* Doctor filter */}
        <select
          value={filterDoctor}
          onChange={(e) => setFilterDoctor(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none"
        >
          <option value="all">Barcha shifokorlar</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none"
        >
          <option value="all">Barcha holatlar</option>
          <option value="NEW">Yangi</option>
          <option value="CONFIRMED">Tasdiqlangan</option>
          <option value="COMPLETED">Yakunlangan</option>
          <option value="CANCELLED">Bekor qilingan</option>
        </select>

        {/* Date filter */}
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none"
        />

        {(search || filterDoctor !== 'all' || filterStatus !== 'all' || filterDate) && (
          <button
            onClick={() => {
              setSearch('');
              setFilterDoctor('all');
              setFilterStatus('all');
              setFilterDate('');
            }}
            className="text-xs text-rose-600 hover:underline font-semibold px-2 py-1"
          >
            Tozalash
          </button>
        )}
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Qabullar ro‘yxati yuklanmoqda...</p>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW (Responsive cards on mobile) */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-5">Bemor</th>
                  <th className="py-3.5 px-4">Telefon</th>
                  <th className="py-3.5 px-4">Shifokor</th>
                  <th className="py-3.5 px-4">Xizmat</th>
                  <th className="py-3.5 px-4">Sana & Vaqt</th>
                  <th className="py-3.5 px-4">Holat</th>
                  <th className="py-3.5 px-5 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Qabul arizalari topilmadi
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5">
                        <p className="font-bold text-slate-900">{apt.patientName}</p>
                        {apt.comment && (
                          <p className="text-[11px] text-slate-400 truncate max-w-xs" title={apt.comment}>
                            {apt.comment}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">{apt.phone}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{apt.doctorName}</p>
                        <p className="text-[10px] text-slate-400">{apt.specialty}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{apt.serviceName || '—'}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900">{apt.date}</p>
                        <p className="text-[10px] text-slate-500">{apt.time}</p>
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(apt.status)}</td>
                      <td className="py-3.5 px-5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedApt(apt);
                            setTargetStatus(apt.status);
                            setStatusNotes(apt.notes || '');
                            setStatusModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-blue-600 transition-colors"
                          title="Holatni o'zgartirish"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(apt.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
                          title="O'chirish"
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

          {/* Mobile Cards View */}
          <div className="md:hidden divide-y divide-slate-100 p-4 space-y-3">
            {filteredAppointments.length === 0 ? (
              <p className="py-8 text-center text-slate-400 text-xs">Qabul arizalari topilmadi</p>
            ) : (
              filteredAppointments.map((apt) => (
                <div key={apt.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm text-slate-900">{apt.patientName}</p>
                      <p className="text-xs font-mono text-slate-500">{apt.phone}</p>
                    </div>
                    {getStatusBadge(apt.status)}
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p>
                      <span className="font-semibold">Shifokor:</span> {apt.doctorName}
                    </p>
                    <p>
                      <span className="font-semibold">Sana & Vaqt:</span> {apt.date} — {apt.time}
                    </p>
                    {apt.comment && (
                      <p className="text-slate-500 italic">"{apt.comment}"</p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedApt(apt);
                        setTargetStatus(apt.status);
                        setStatusNotes(apt.notes || '');
                        setStatusModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold"
                    >
                      Holatni boshqarish
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(apt.id)}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* CALENDAR VIEW */
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Qabullar Kalendar Rejasi
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Group appointments by date */}
            {Array.from(new Set(filteredAppointments.map((a) => a.date)))
              .sort()
              .map((d) => {
                const dayApts = filteredAppointments.filter((a) => a.date === d);
                return (
                  <div key={d} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="font-extrabold text-sm text-slate-900">{d}</span>
                      <span className="text-[11px] font-bold text-blue-600 px-2 py-0.5 rounded-full bg-blue-100">
                        {dayApts.length} ta qabul
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {dayApts.map((a) => (
                        <div
                          key={a.id}
                          onClick={() => {
                            setSelectedApt(a);
                            setTargetStatus(a.status);
                            setStatusNotes(a.notes || '');
                            setStatusModalOpen(true);
                          }}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer hover:shadow-xs transition-all ${
                            a.status === 'NEW'
                              ? 'bg-blue-50 border-blue-200 text-blue-900'
                              : a.status === 'CONFIRMED'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                              : a.status === 'COMPLETED'
                              ? 'bg-slate-100 border-slate-200 text-slate-700'
                              : 'bg-rose-50 border-rose-200 text-rose-900'
                          }`}
                        >
                          <div className="flex justify-between font-bold text-[11px]">
                            <span>{a.time}</span>
                            <span className="text-[9px] uppercase">{a.status}</span>
                          </div>
                          <p className="font-semibold truncate">{a.patientName}</p>
                          <p className="text-[10px] opacity-75 truncate">{a.doctorName}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Status Changer Modal */}
      {statusModalOpen && selectedApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Qabul holatini o‘zgartirish
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Bemor: <span className="font-bold text-slate-900">{selectedApt.patientName}</span> ({selectedApt.phone})
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Yangi holat
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['NEW', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as AppointmentStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setTargetStatus(st)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        targetStatus === st
                          ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {st === 'NEW' && 'Yangi'}
                      {st === 'CONFIRMED' && 'Tasdiqlangan'}
                      {st === 'COMPLETED' && 'Yakunlangan'}
                      {st === 'CANCELLED' && 'Bekor qilingan'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Administrator izohi
                </label>
                <textarea
                  rows={2}
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Qabul bo‘yicha eslatma..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStatusModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleStatusUpdate}
                className="flex-1 py-2.5 rounded-xl bg-[#0B5ED7] hover:bg-blue-700 text-white text-xs font-bold shadow-md"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Qabul arizasini o‘chirasizmi?
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Bu amal qaytarilmaydi. Ushbu qabul arizasi tizimdan butunlay o‘chiriladi.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
              >
                Ha, o‘chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
