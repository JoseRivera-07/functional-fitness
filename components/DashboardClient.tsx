'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface DashboardClientProps {
  userName: string;
  userId: string;
}

export default function DashboardClient({ userName, userId }: DashboardClientProps) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
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

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-950 text-slate-50 flex">
        {/* Sidebar */}
        <aside className="w-64 fixed left-0 top-0 h-screen bg-slate-950 border-r border-slate-800 flex flex-col p-6 space-y-8 z-40">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-lg shadow-purple-600/30">
              FF
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">
                Functional
                <br />
                Fitness
              </h2>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <div className="px-4 py-3 rounded-lg bg-purple-600 bg-opacity-20 border border-purple-600 border-opacity-30 text-white flex items-center gap-3 cursor-pointer hover:bg-opacity-30 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
              </svg>
              <span className="text-sm font-medium">Panel</span>
            </div>

            <div className="px-4 py-3 rounded-lg text-slate-400 flex items-center gap-3 cursor-pointer hover:bg-slate-900 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
              <span className="text-sm font-medium">Usuarias</span>
            </div>

            <div className="px-4 py-3 rounded-lg text-slate-400 flex items-center gap-3 cursor-pointer hover:bg-slate-900 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
              <span className="text-sm font-medium">Configuración</span>
            </div>
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full px-4 py-3 rounded-lg bg-purple-600 text-white font-semibold transition hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? 'Saliendo...' : 'Cerrar sesión'}
          </button>
        </aside>

        {/* Main Content */}
        <div className="ml-64 w-full">
          {/* Top Header */}
          <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-30">
            <div className="px-8 py-4 flex items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Buscar miembros..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 placeholder-slate-600 focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-4 ml-8">
                {/* Notifications */}
                <button className="p-2 hover:bg-slate-900 rounded-lg transition">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>

                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 hover:bg-slate-900 rounded-lg transition"
                >
                  {isDark ? (
                    <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-2.12-2.12a1 1 0 111.414-1.414l2.12 2.12a1 1 0 11-1.414 1.414zM2.05 6.464A1 1 0 103.464 5.05l-2.12 2.12a1 1 0 01-1.414-1.414l2.12-2.12zM5.414 9.414a1 1 0 10-1.414 1.414L6.12 12.95a1 1 0 101.414-1.414L5.414 9.414zM9.414 5.414a1 1 0 00-1.414 1.414L10.12 8.95a1 1 0 101.414-1.414L9.414 5.414zM17 11a1 1 0 100-2h-2a1 1 0 100 2h2zm-7-4a1 1 0 011 1v2a1 1 0 11-2 0V8a1 1 0 011-1zM9 15a1 1 0 00-1 1v2a1 1 0 102 0v-2a1 1 0 00-1-1zm6-1a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>

                {/* User Avatar */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-semibold text-white">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-slate-300">{userName}</span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-8">
            {/* Greeting */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Hola, {userName} 👋</h1>
              <p className="text-slate-400">Bienvenido a tu panel de control</p>
            </div>

            {/* Membership Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 max-w-2xl">
              <h2 className="text-xl font-bold text-white mb-2">Tu Membresía</h2>
              <p className="text-slate-400 text-sm mb-6">Estado actual y próxima renovación</p>

              <div className="space-y-4">
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-slate-300">Activa</span>
                </div>

                {/* Info Rows */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-700">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Último Pago</p>
                    <p className="text-lg font-semibold text-white">15 de Enero 2025</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Próxima Renovación</p>
                    <p className="text-lg font-semibold text-white">15 de Febrero 2025</p>
                  </div>
                </div>
              </div>

              {/* Renew Button */}
              <button className="w-full mt-8 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
                Renovar Membresía
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-8 p-6 bg-blue-950 border border-blue-900 rounded-lg">
              <p className="text-blue-200 text-sm">
                ℹ️ Esta es una vista preliminar de tu membresía. Próximamente añadiremos más detalles, historial de pagos y opciones de renovación automática.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}