'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface User {
  id: string;
  name: string;
  phone?: string;
  created_at: string;
}

interface Membership {
  user_id: string;
  last_payment?: string;
  next_payment?: string;
  status: string;
  activated_at?: string;
}

interface AdminClientProps {
  users: User[];
  memberships: Membership[];
}

export default function AdminClient({ users, memberships }: AdminClientProps) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      setIsLoggingOut(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Calcular métricas
  const totalUsers = users.length;
  const activeMembers = memberships.filter(m => m.status === 'active').length;
  const expiredMembers = memberships.filter(m => {
    if (m.status !== 'active') return false;
    if (!m.next_payment) return false;
    return new Date(m.next_payment) < new Date();
  }).length;
  const pendingActivation = memberships.filter(m => m.status === 'pending_activation').length;

  // Mapear usuarios con membresías
  const usersWithMemberships = users.map(user => {
    const membership = memberships.find(m => m.user_id === user.id);
    return {
      ...user,
      membership: membership || { status: 'none', next_payment: null }
    };
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-100', label: 'Activa' },
      pending_activation: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-800 dark:text-gray-100', label: 'Pendiente' },
      expired: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-100', label: 'Vencida' },
      none: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-800 dark:text-gray-100', label: 'Sin membresía' },
    };

    const s = statusMap[status] || statusMap.none;
    return <span className={`px-3 py-1 rounded-full text-sm font-medium ${s.bg} ${s.text}`}>{s.label}</span>;
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-slate-950">
        {/* Navbar */}
        <nav className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Functional Fitness - Admin</h1>
            
            <div className="flex items-center gap-4">
              {/* Toggle Dark Mode */}
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Toggle dark mode"
              >
                {isDark ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-2.12-2.12a1 1 0 111.414-1.414l2.12 2.12a1 1 0 11-1.414 1.414zM2.05 6.464A1 1 0 103.464 5.05l-2.12 2.12a1 1 0 01-1.414-1.414l2.12-2.12zM5.414 9.414a1 1 0 10-1.414 1.414L6.12 12.95a1 1 0 101.414-1.414L5.414 9.414zM9.414 5.414a1 1 0 00-1.414 1.414l2.12 2.12a1 1 0 101.414-1.414l-2.12-2.12zM17 11a1 1 0 100-2h-2a1 1 0 100 2h2zm-7-4a1 1 0 011 1v2a1 1 0 11-2 0V8a1 1 0 011-1zM9 15a1 1 0 00-1 1v2a1 1 0 102 0v-2a1 1 0 00-1-1zm6-1a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? 'Saliendo...' : 'Cerrar sesión'}
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Panel de Control
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Gestiona las membresías de tus usuarias
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Usuarios */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Usuarias</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{totalUsers}</p>
            </div>

            {/* Membresías Activas */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <p className="text-green-900 dark:text-green-100 text-sm font-medium">Activas</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{activeMembers}</p>
            </div>

            {/* Membresías Vencidas */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <p className="text-red-900 dark:text-red-100 text-sm font-medium">Vencidas</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">{expiredMembers}</p>
            </div>

            {/* Pendientes */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
              <p className="text-yellow-900 dark:text-yellow-100 text-sm font-medium">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{pendingActivation}</p>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Nombre</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Estado</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Próximo Pago</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {usersWithMemberships.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-600 dark:text-slate-400">
                        No hay usuarias aún
                      </td>
                    </tr>
                  ) : (
                    usersWithMemberships.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{user.name}</td>
                        <td className="px-6 py-4 text-sm">{getStatusBadge(user.membership.status)}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                          {formatDate(user.membership.next_payment)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button className="text-purple-600 dark:text-purple-400 hover:underline disabled:opacity-50" disabled>
                            Expandir
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-blue-900 dark:text-blue-100 text-sm">
              ℹ️ Esta tabla muestra todas las usuarias registradas. La funcionalidad de expandir, editar y notificar se implementará en las siguientes tareas.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}