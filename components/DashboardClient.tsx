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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Navbar */}
        <nav className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
          <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-xs text-white">
                FF
              </div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">Functional Fitness</h1>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Notifications Bell */}
              <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                {isDark ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-2.12-2.12a1 1 0 111.414-1.414l2.12 2.12a1 1 0 11-1.414 1.414zM2.05 6.464A1 1 0 103.464 5.05l-2.12 2.12a1 1 0 01-1.414-1.414l2.12-2.12zM5.414 9.414a1 1 0 10-1.414 1.414L6.12 12.95a1 1 0 101.414-1.414L5.414 9.414zM9.414 5.414a1 1 0 00-1.414 1.414L10.12 8.95a1 1 0 101.414-1.414L9.414 5.414zM17 11a1 1 0 100-2h-2a1 1 0 100 2h2zm-7-4a1 1 0 011 1v2a1 1 0 11-2 0V8a1 1 0 011-1zM9 15a1 1 0 00-1 1v2a1 1 0 102 0v-2a1 1 0 00-1-1zm6-1a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? 'Saliendo...' : 'Cerrar sesión'}
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-6 py-12">
          {/* Greeting */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Hola, {userName} 👋
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              Bienvenido a tu panel de control personal
            </p>
          </div>

          {/* Membership Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition mb-12">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  Tu Membresía
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Estado actual y información de renovación
                </p>
              </div>
              <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold rounded-lg">
                ✓ Activa
              </div>
            </div>

            {/* Membership Details */}
            <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold mb-2">
                  Último Pago
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  15 de Enero 2025
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Hace 2 meses
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold mb-2">
                  Próxima Renovación
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  15 de Febrero 2025
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  En 4 días
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">8</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide mt-1">
                  Meses Activa
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">42</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide mt-1">
                  Visitas Completadas
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">5/5</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide mt-1">
                  Calificación
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
                Renovar Membresía
              </button>
              <button className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                Ver Detalles
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            {/* Contact Support */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-md transition cursor-pointer">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Contactar Soporte</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                ¿Tienes preguntas? Estamos aquí para ayudarte
              </p>
            </div>

            {/* Download App */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-md transition cursor-pointer">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Descargar App</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Accede desde tu teléfono en cualquier momento
              </p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  ¿Sabías que puedes renovar automáticamente?
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Activa la renovación automática de tu membresía para no perder acceso. Próximamente disponible en la aplicación móvil.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}