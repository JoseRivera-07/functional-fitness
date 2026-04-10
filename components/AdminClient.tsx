'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface User {
  id: string;
  name: string;
  phone?: string;
  created_at: string | Date;
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
  const [isDark, setIsDark] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

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

  // Calcular estado de membresía
  const getMembershipStatus = (membership: Membership) => {
    if (membership.status === 'pending_activation') return 'pending_activation';
    if (membership.status !== 'active') return 'expired';
    
    if (!membership.next_payment) return 'active';
    
    const nextPaymentDate = new Date(membership.next_payment);
    const today = new Date();
    const daysUntilExpiry = Math.floor((nextPaymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 3) return 'expiring_soon';
    return 'active';
  };

  // Calcular métricas
  const totalUsers = users.length;
  const activeMembers = memberships.filter(m => getMembershipStatus(m) === 'active').length;
  const expiringMembers = memberships.filter(m => getMembershipStatus(m) === 'expiring_soon').length;
  const expiredMembers = memberships.filter(m => getMembershipStatus(m) === 'expired').length;
  const pendingActivation = memberships.filter(m => getMembershipStatus(m) === 'pending_activation').length;

  // Mapear usuarios con membresías
  const usersWithMemberships = users.map(user => {
    const membership = memberships.find(m => m.user_id === user.id);
    return {
      ...user,
      membership: membership || { status: 'none', next_payment: null, last_payment: null }
    };
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'ACTIVA' },
      expiring_soon: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'POR VENCER' },
      pending_activation: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'PENDIENTE' },
      expired: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'VENCIDA' },
      none: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'SIN MEMBRESÍA' },
    };

    const s = statusMap[status] || statusMap.none;
    return <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>{s.label}</span>;
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeRegistered = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const months = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24 * 30));
    if (months === 0) return 'Hace poco';
    if (months === 1) return '1 Mes';
    return `${months} Meses`;
  };

  const selectedUser = selectedUserId ? usersWithMemberships.find(u => u.id === selectedUserId) : null;

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
        {/* Navbar */}
        <nav className="h-16 bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
          <div className="h-full max-w-7xl mx-auto px-8 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-lg shadow-purple-600/30">
                FF
              </div>
              <h1 className="text-lg font-bold text-white">Functional Fitness</h1>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              {/* Dark Mode */}
              <button onClick={toggleDarkMode} className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg transition">
                {isDark ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-2.12-2.12a1 1 0 111.414-1.414l2.12 2.12a1 1 0 11-1.414 1.414zM2.05 6.464A1 1 0 103.464 5.05l-2.12 2.12a1 1 0 01-1.414-1.414l2.12-2.12zM5.414 9.414a1 1 0 10-1.414 1.414L6.12 12.95a1 1 0 101.414-1.414L5.414 9.414zM9.414 5.414a1 1 0 00-1.414 1.414L10.12 8.95a1 1 0 101.414-1.414L9.414 5.414zM17 11a1 1 0 100-2h-2a1 1 0 100 2h2zm-7-4a1 1 0 011 1v2a1 1 0 11-2 0V8a1 1 0 011-1zM9 15a1 1 0 00-1 1v2a1 1 0 102 0v-2a1 1 0 00-1-1zm6-1a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {/* User */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">A</div>
                <span className="text-sm text-slate-300">Administradora</span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 text-sm font-medium text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
              >
                {isLoggingOut ? '...' : 'Salir'}
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-8 py-8">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Resumen del Panel</h1>
            <p className="text-slate-400">Visión operativa de Functional Fitness.</p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {/* Active Balance */}
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-2xl p-6">
              <p className="text-xs text-green-400 uppercase tracking-widest font-semibold mb-2">Balance Activo</p>
              <p className="text-4xl font-bold text-green-400 mb-4">${(activeMembers * 80000).toLocaleString()}</p>
              <p className="text-sm text-green-300 mb-3">{activeMembers} Miembros × $80,000</p>
              <p className="text-xs text-green-300">+12.5% vs mes anterior</p>
            </div>

            {/* Pending Balance */}
            <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 rounded-2xl p-6">
              <p className="text-xs text-red-400 uppercase tracking-widest font-semibold mb-2">Balance Pendiente</p>
              <p className="text-4xl font-bold text-red-400 mb-4">${(expiredMembers * 80000).toLocaleString()}</p>
              <p className="text-sm text-red-300 mb-3">{expiredMembers} Inactivas × $80,000</p>
              <p className="text-xs text-red-400">Requiere seguimiento</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Total Usuarias</p>
              <p className="text-3xl font-bold text-white">{totalUsers}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Activas</p>
              <p className="text-3xl font-bold text-green-400">{activeMembers}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Por Vencer</p>
              <p className="text-3xl font-bold text-yellow-400">{expiringMembers}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Vencidas</p>
              <p className="text-3xl font-bold text-red-400">{expiredMembers}</p>
            </div>
          </div>

          {/* Users Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Registros Activos</h2>
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-slate-700 text-slate-400 rounded-lg hover:bg-slate-900 transition text-sm font-medium">
                  Filtrar
                </button>
                <button className="px-4 py-2 border border-slate-700 text-slate-400 rounded-lg hover:bg-slate-900 transition text-sm font-medium">
                  Ordenar
                </button>
              </div>
            </div>

            {/* Grid of User Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {usersWithMemberships.length === 0 ? (
                <div className="col-span-full text-center py-12 text-slate-400">
                  No hay usuarias registradas
                </div>
              ) : (
                usersWithMemberships.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-6 cursor-pointer hover:border-purple-600 hover:bg-slate-800/50 transition group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white truncate">{user.name}</h3>
                          <p className="text-xs text-slate-500 truncate">ID: {user.id.substring(0, 12)}</p>
                        </div>
                      </div>
                      {getStatusBadge(getMembershipStatus(user.membership || { status: 'none', next_payment: null }))}
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-3 text-sm border-t border-slate-800 pt-4">
                      <div className="flex justify-between text-slate-400">
                        <span>INSCRIPCIÓN</span>
                        <span className="text-white font-medium text-right">{formatDate(user.created_at)}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>TIEMPO REG.</span>
                        <span className="text-white font-medium text-right">{getTimeRegistered(user.created_at)}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>ÚLTIMO PAGO</span>
                        <span className={`font-medium text-right ${user.membership.last_payment ? 'text-purple-400' : 'text-slate-500'}`}>
                          {formatDate(user.membership.last_payment)}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>PRÓXIMO PAGO</span>
                        <span className={`font-medium text-right ${user.membership.next_payment ? 'text-green-400' : 'text-slate-500'}`}>
                          {formatDate(user.membership.next_payment)}
                        </span>
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
                      <button className="text-purple-400 text-sm font-medium group-hover:text-purple-300 transition">
                        Ver detalles →
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
              <button className="px-3 py-2 rounded-lg bg-slate-900 text-slate-400 hover:bg-slate-800 transition disabled:opacity-50">
                ←
              </button>
              <button className="w-10 h-10 rounded-lg bg-purple-600 text-white font-semibold">1</button>
              <button className="w-10 h-10 rounded-lg bg-slate-900 text-slate-400 hover:bg-slate-800">2</button>
              <button className="w-10 h-10 rounded-lg bg-slate-900 text-slate-400 hover:bg-slate-800">3</button>
              <span className="text-slate-500 text-sm">...</span>
              <button className="w-10 h-10 rounded-lg bg-slate-900 text-slate-400 hover:bg-slate-800">12</button>
              <button className="px-3 py-2 rounded-lg bg-slate-900 text-slate-400 hover:bg-slate-800 transition">→</button>
            </div>
          </div>
        </main>

        {/* Modal - User Details */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedUserId(null)}>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl max-h-96 overflow-y-auto" onClick={e => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-8 relative sticky top-0">
                <button
                  onClick={() => setSelectedUserId(null)}
                  className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-lg transition"
                >
                  ✕
                </button>
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center text-3xl font-bold text-white border-4 border-white/30">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white">{selectedUser.name}</h3>
                  <p className="text-sm text-slate-400">ID: {selectedUser.id.substring(0, 12)}</p>
                </div>

                {/* Info Sections */}
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase">Último mes pagado</p>
                      <p className="text-white font-semibold">{formatDate(selectedUser.membership.last_payment)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase">Próxima fecha</p>
                      <p className="text-white font-semibold">{formatDate(selectedUser.membership.next_payment)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                  <div className="bg-slate-800 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase">Estado de pago</p>
                        <p className="text-white font-semibold">
                          {selectedUser && getMembershipStatus(selectedUser.membership || { status: 'pending_activation', next_payment: null }) === 'active' ? 'Al día' : 'Pendiente'}
                        </p>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button className="px-4 py-3 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/20 transition font-semibold text-sm">
                    ACTIVAR
                  </button>
                  <button className="px-4 py-3 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/20 transition font-semibold text-sm">
                    INACTIVAR
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}