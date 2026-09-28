import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  UserCheck,
  Activity,
  Flame,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { DashboardStats, Appointment, AppointmentStatus } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';

interface AdminDashboardProps {
  onNavigate: (route: string, param?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { getAuthHeaders } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();

      const [statsRes, aptsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/appointments', { headers }),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (aptsRes.ok) {
        const apts = await aptsRes.json();
        setRecentAppointments(apts.slice(0, 6));
      }
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error('Holatni o‘zgartirishda xatolik');

      showToast('success', 'Qabul holati yangilandi');
      fetchDashboardData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

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

  if (loading && !stats) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Dashboard statistikasi yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Klinika Umumiy Ko‘rsatkichlari
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real vaqt rejimidagi qabullar, bemorlar va statistik hisobotlar
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Yangilash</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 block">Bugungi qabullar</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {stats?.todayAppointmentsCount || 0}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
            <AlertCircle className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 block">Yangi arizalar</span>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {stats?.newAppointmentRequests || 0}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-3">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 block">Jami bemorlar</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {stats?.totalPatientsCount || 0}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
            <UserCheck className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 block">Faol shifokorlar</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {stats?.activeDoctorsCount || 0}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 block">Faol xizmatlar</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {stats?.activeServicesCount || 0}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
            <Flame className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 block">Faol aksiyalar</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {stats?.activePromotionsCount || 0}
          </p>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Appointments by Date (Bar chart) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Oxirgi 7 kundagi qabullar dinamikasi
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Kunlar kesimidagi bemorlar oqimi
          </p>

          {stats?.appointmentsByDate && stats.appointmentsByDate.length > 0 ? (
            <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-slate-100">
              {stats.appointmentsByDate.map((item, idx) => {
                const maxCount = Math.max(...stats.appointmentsByDate.map((d) => d.count), 1);
                const heightPercent = Math.max(Math.round((item.count / maxCount) * 100), 12);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.count}
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[36px] bg-gradient-to-t from-blue-600 to-teal-400 rounded-t-lg transition-all group-hover:brightness-110 shadow-xs"
                    />
                    <span className="text-[10px] text-slate-500 font-semibold truncate w-full text-center">
                      {item.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-xs text-slate-400">
              Yetarli ma’lumot yo‘q
            </div>
          )}
        </div>

        {/* Appointments by Specialty & Status Breakdown */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Mutaxassisliklar bo‘yicha taqsimot
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Qabulga arizalar qaysi sohalarga ko‘proq
            </p>

            <div className="space-y-3">
              {stats?.appointmentsBySpecialty?.slice(0, 4).map((spec, idx) => {
                const total = stats.totalAppointmentsCount || 1;
                const pct = Math.round((spec.count / total) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">{spec.specialty}</span>
                      <span className="text-slate-900 font-bold">{spec.count} ta ({pct}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-blue-600 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Breakdown Summary */}
          <div className="pt-6 border-t border-slate-100 grid grid-cols-4 gap-2 text-center">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-900">
              <span className="text-[10px] block font-semibold text-blue-600">Yangi</span>
              <span className="text-sm font-black">{stats?.appointmentsByStatus?.NEW || 0}</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-900">
              <span className="text-[10px] block font-semibold text-emerald-600">Tasdiq</span>
              <span className="text-sm font-black">{stats?.appointmentsByStatus?.CONFIRMED || 0}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-900">
              <span className="text-[10px] block font-semibold text-slate-600">Yakun</span>
              <span className="text-sm font-black">{stats?.appointmentsByStatus?.COMPLETED || 0}</span>
            </div>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-900">
              <span className="text-[10px] block font-semibold text-rose-600">Bekor</span>
              <span className="text-sm font-black">{stats?.appointmentsByStatus?.CANCELLED || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              So‘nggi qabul arizalari
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Eng so‘nggi kelib tushgan murojaatlar va tezkor holat boshqaruvi
            </p>
          </div>

          <button
            onClick={() => onNavigate('admin-appointments')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Barcha qabullar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-5">Bemor</th>
                <th className="py-3 px-4">Telefon</th>
                <th className="py-3 px-4">Shifokor</th>
                <th className="py-3 px-4">Sana & Vaqt</th>
                <th className="py-3 px-4">Holat</th>
                <th className="py-3 px-5 text-right">Tezkor amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {recentAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Arizalar mavjud emas
                  </td>
                </tr>
              ) : (
                recentAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-slate-900">{apt.patientName}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">{apt.phone}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{apt.doctorName}</p>
                      <p className="text-[10px] text-slate-400">{apt.specialty}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900">{apt.date}</p>
                      <p className="text-[10px] text-slate-500">{apt.time}</p>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(apt.status)}</td>
                    <td className="py-3.5 px-5 text-right space-x-1.5 whitespace-nowrap">
                      {apt.status === 'NEW' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[10px] font-bold"
                          title="Tasdiqlash"
                        >
                          Tasdiqlash
                        </button>
                      )}
                      {apt.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-[10px] font-bold"
                          title="Yakunlash"
                        >
                          Yakunlash
                        </button>
                      )}
                      {apt.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'CANCELLED')}
                          className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-[10px] font-bold"
                          title="Bekor qilish"
                        >
                          Bekor
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
