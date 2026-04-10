/**
 * components/admin/MetricsCards.tsx
 * Tarjetas de métricas del panel admin
 *
 * Muestra 4 métricas principales:
 * - Total de usuarias
 * - Membresías activas
 * - Membresías inactivas
 * - Pendientes de activación
 */

interface MetricsCardsProps {
  totalUsers: number;
  activeMembers: number;
  expiredMembers: number;
  pendingActivation: number;
}

export default function MetricsCards({
  totalUsers,
  activeMembers,
  expiredMembers,
  pendingActivation,
}: MetricsCardsProps) {
  const metrics = [
    {
      label: 'Total Usuarias',
      value: totalUsers,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      ),
      color: 'text-purple-400',
    },
    {
      label: 'Membresías Activas',
      value: activeMembers,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm6.18 5.313a1 1 0 10-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      color: 'text-green-400',
    },
    {
      label: 'Membresías Inactivas',
      value: expiredMembers,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      color: 'text-red-400',
    },
    {
      label: 'Pendientes de Activación',
      value: pendingActivation,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v2H4a2 2 0 00-2 2v2h16V7a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v2H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ),
      color: 'text-yellow-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition"
        >
          {/* Icon */}
          <div className={`w-10 h-10 ${metric.color} mb-4 opacity-75`}>
            {metric.icon}
          </div>

          {/* Label */}
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-3">
            {metric.label}
          </p>

          {/* Value */}
          <p className="text-3xl font-bold text-white">
            {metric.value.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}