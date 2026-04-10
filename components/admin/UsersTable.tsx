/**
 * components/admin/UsersTable.tsx
 * Tabla reutilizable de usuarias para el panel admin
 *
 * Muestra:
 * - Nombre de la usuaria
 * - Estado de membresía (con badge de color)
 * - Próximo pago (formato DD de Mes)
 * - Botón de acciones
 */

interface UserWithMembership {
  id: string;
  name: string;
  phone?: string;
  membership?: {
    status: string;
    next_payment?: string;
  };
}

interface UsersTableProps {
  users: UserWithMembership[];
  onUserSelect?: (userId: string) => void;
  isLoading?: boolean;
}

export default function UsersTable({
  users,
  onUserSelect,
  isLoading = false,
}: UsersTableProps) {
  const getStatusBadge = (status?: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'ACTIVA' },
      expiring_soon: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'POR VENCER' },
      pending_activation: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'PENDIENTE' },
      expired: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'VENCIDA' },
      none: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'SIN MEMBRESÍA' },
    };

    const s = statusMap[status || 'none'] || statusMap.none;
    return <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>{s.label}</span>;
  };

  const formatDateSpanish = (date?: string) => {
    if (!date) return '-';
    
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    const month = months[dateObj.getMonth()];
    return `${day} de ${month}`;
  };

  if (isLoading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-8 text-center text-slate-400">Cargando usuarias...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Próximo Pago
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-slate-800">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                  No hay usuarias registradas
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => onUserSelect?.(user.id)}
                  className="hover:bg-slate-800/50 transition cursor-pointer"
                >
                  {/* Nombre */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {user.phone || 'Sin teléfono'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4">
                    {getStatusBadge(user.membership?.status)}
                  </td>

                  {/* Próximo Pago */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-300">
                      {formatDateSpanish(user.membership?.next_payment)}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUserSelect?.(user.id);
                      }}
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium transition"
                    >
                      Ver →
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}