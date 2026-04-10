/**
 * components/admin/UserDrawer.tsx
 * Drawer lateral para mostrar detalles de una usuaria
 *
 * Características:
 * - Se abre desde la derecha
 * - Overlay semi-transparente
 * - Muestra información completa de la usuaria
 * - Botones de acción (Activar, Notificar, etc)
 */

import { useEffect } from 'react';

interface UserDrawerProps {
  userId?: string;
  userName?: string;
  phone?: string;
  birthdate?: string;
  registeredAt?: string;
  lastPayment?: string;
  nextPayment?: string;
  membershipStatus?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDrawer({
  userId,
  userName = 'Usuario',
  phone,
  birthdate,
  registeredAt,
  lastPayment,
  nextPayment,
  membershipStatus = 'active',
  isOpen,
  onClose,
}: UserDrawerProps) {
  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMembershipStatusColor = (status?: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      active: { bg: 'bg-green-500/20', text: 'text-green-400' },
      expiring_soon: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
      pending_activation: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
      expired: { bg: 'bg-red-500/20', text: 'text-red-400' },
    };

    return colors[status || 'active'] || colors.active;
  };

  const statusColor = getMembershipStatusColor(membershipStatus);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 z-50 shadow-2xl overflow-y-auto transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-8 border-b border-slate-800">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{userName}</h2>
              <p className="text-sm text-purple-100">
                {userId ? `ID: ${userId.substring(0, 12)}` : 'Usuario'}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 text-white hover:bg-white/20 rounded-lg transition ml-4"
              aria-label="Cerrar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Información Personal */}
          <section>
            <h3 className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-4">
              Información Personal
            </h3>

            <div className="space-y-4">
              {/* Nombre */}
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Nombre</p>
                <p className="text-white font-medium">{userName}</p>
              </div>

              {/* Teléfono */}
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Teléfono</p>
                <p className="text-white font-medium">{phone || '-'}</p>
              </div>

              {/* Fecha de Nacimiento */}
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Fecha de Nacimiento</p>
                <p className="text-white font-medium">{birthdate ? formatDate(birthdate) : '-'}</p>
              </div>

              {/* Fecha de Registro */}
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Miembro desde</p>
                <p className="text-white font-medium">{registeredAt ? formatDate(registeredAt) : '-'}</p>
              </div>
            </div>
          </section>

          {/* Información de Membresía */}
          <section>
            <h3 className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-4">
              Membresía
            </h3>

            <div className="space-y-4">
              {/* Estado */}
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Estado</p>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusColor.bg} ${statusColor.text}`}>
                  {membershipStatus === 'active' ? 'Activa' : 
                   membershipStatus === 'pending_activation' ? 'Pendiente' :
                   membershipStatus === 'expiring_soon' ? 'Por Vencer' : 'Vencida'}
                </div>
              </div>

              {/* Último Pago */}
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Último Pago</p>
                <p className="text-white font-medium">{lastPayment ? formatDate(lastPayment) : '-'}</p>
              </div>

              {/* Próximo Pago */}
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Próximo Pago</p>
                <p className={`font-medium ${nextPayment ? 'text-green-400' : 'text-slate-500'}`}>
                  {nextPayment ? formatDate(nextPayment) : '-'}
                </p>
              </div>
            </div>
          </section>

          {/* Acciones */}
          <section>
            <h3 className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-4">
              Acciones
            </h3>

            <div className="space-y-3">
              {/* Botón Activar */}
              <button
                className="w-full px-4 py-3 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/20 transition font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={membershipStatus === 'active'}
              >
                ✓ Activar Membresía
              </button>

              {/* Botón Notificar */}
              <button
                className="w-full px-4 py-3 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/20 transition font-semibold text-sm"
              >
                📱 Notificar por WhatsApp
              </button>

              {/* Botón Inactivar */}
              <button
                className="w-full px-4 py-3 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/20 transition font-semibold text-sm"
              >
                ✕ Inactivar Membresía
              </button>
            </div>
          </section>

          {/* Info Box */}
          <div className="bg-blue-950 border border-blue-800 rounded-lg p-4">
            <p className="text-blue-200 text-xs">
              💡 Los cambios aquí se sincronizarán automáticamente. Se enviará una notificación a la usuaria cuando corresponda.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}