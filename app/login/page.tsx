'use client';

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // Funcionalidad agregada en próximas tareas
    console.log('Google OAuth será implementado después');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-slate-950">
      {/* Panel Púrpura Izquierdo - Desktop & Tablet */}
      <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-purple-600 to-purple-700 text-white flex-col items-center justify-center p-8 lg:p-12">
        <div className="max-w-sm text-center space-y-6">
          {/* Logo */}
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-lg mb-6 backdrop-blur-sm">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white">Functional Fitness</h1>
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <p className="text-xl text-purple-100">Gestión de membresías digital</p>
            <p className="text-sm text-purple-200 leading-relaxed">
              Control en tiempo real del estado de pago, notificaciones automáticas y gestión completa de tu gimnasio.
            </p>
          </div>

          {/* Features List */}
          <div className="pt-6 space-y-3 text-sm text-purple-100">
            <div className="flex items-center gap-3">
              <span className="inline-block w-1.5 h-1.5 bg-purple-300 rounded-full"></span>
              <span>Dashboard en tiempo real</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block w-1.5 h-1.5 bg-purple-300 rounded-full"></span>
              <span>Notificaciones automáticas</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block w-1.5 h-1.5 bg-purple-300 rounded-full"></span>
              <span>Gestión de pagos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel Formulario - Mobile Header & Right Panel */}
      <div className="w-full md:w-3/5 flex flex-col items-center justify-center p-6 md:p-8 lg:p-12 bg-white dark:bg-slate-950">
        {/* Mobile Header */}
        <div className="md:hidden w-full mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg mb-4">
            <svg
              className="w-8 h-8 text-purple-600 dark:text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Functional Fitness</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Gestión de membresías</p>
        </div>

        {/* Login Form Container */}
        <div className="w-full max-w-sm space-y-8">
          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Inicia sesión
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              Accede a tu panel de control
            </p>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 md:py-4 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold text-base md:text-lg transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 active:scale-95 shadow-sm hover:shadow-md"
          >
            {/* Google Icon */}
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="currentColor"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="currentColor"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="currentColor"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="currentColor"
              />
            </svg>
            Continuar con Google
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white dark:bg-slate-950 text-sm text-slate-600 dark:text-slate-400 font-medium">
                O continúa con email
              </span>
            </div>
          </div>

          {/* Email Input Placeholder */}
          <div className="space-y-2">
            <input
              type="email"
              placeholder="tu@email.com"
              disabled
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-500 placeholder-slate-400 dark:placeholder-slate-500 font-medium transition-all disabled:cursor-not-allowed"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              ℹ️ Funcionalidad próximamente
            </p>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3 text-center text-xs text-slate-600 dark:text-slate-400">
            <p>
              Al usar este servicio, aceptas nuestros{' '}
              <button className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
                Términos de Servicio
              </button>
            </p>
            <p className="text-slate-500 dark:text-slate-500">
              ¿Necesitas ayuda? Contacta a{' '}
              <span className="font-medium text-slate-700 dark:text-slate-300">soporte@functionalfitness.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}