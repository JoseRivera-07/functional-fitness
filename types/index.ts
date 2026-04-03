/**
 * types/index.ts
 * Tipos TypeScript centralizados para Functional Fitness
 * Utilizados en componentes, funciones y API routes
 */

// ============ USUARIO AUTENTICADO ============
/**
 * Usuario autenticado en la sesión Supabase
 * Información mínima del usuario de auth.users
 */
export interface User {
  id: string; // UUID
  email: string;
  user_metadata?: {
    full_name?: string;
    picture?: string;
    provider?: string;
  };
  created_at?: string; // ISO 8601 timestamp
  last_sign_in_at?: string;
}

// ============ PERFIL DE USUARIA ============
/**
 * Perfil extendido de una usuaria del gimnasio
 * Datos de negocio asociados a un usuario de auth
 * Tabla Supabase: profiles
 */
export interface Profile {
  id: string; // UUID - FK a auth.users(id)
  name: string; // Nombre completo
  phone?: string; // Número WhatsApp (formato: +573001234567)
  birthdate?: Date | string; // Fecha de nacimiento
  role: 'client' | 'admin'; // Rol de la usuaria
  created_at: Date | string; // Fecha de registro
  updated_at?: Date | string;
}

// ============ MEMBRESÍA ============
/**
 * Estado de la membresía de una usuaria en el gimnasio
 * Tabla Supabase: memberships
 */
export interface Membership {
  id: string; // UUID
  user_id: string; // FK a profiles(id)
  last_payment?: Date | string; // Última fecha de pago
  next_payment?: Date | string; // Próxima fecha de pago (editable por admin)
  status: 'pending_activation' | 'active'; // Estado en BD (solo 2 valores)
  activated_at?: Date | string; // Cuándo se activó la membresía
  updated_at: Date | string; // Última actualización
}

/**
 * Estado computado de membresía (calculado en runtime)
 * Ampliación del campo `status` que incluye:
 * - pending_activation: Registrada pero no pagada aún
 * - active: Vigente (last_payment es reciente)
 * - expiring_soon: Vigente pero vence en ≤ 3 días
 * - expired: Ya pasó next_payment (mora)
 *
 * IMPORTANTE: expiring_soon y expired se calculan comparando
 * next_payment con la fecha actual en cada consulta.
 * El campo status en BD solo contiene 'pending_activation' o 'active'.
 */
export type ComputedMembershipStatus =
  | 'pending_activation'
  | 'active'
  | 'expiring_soon'
  | 'expired';

/**
 * Utilidad: Obtener el estado computado a partir de una membresía
 * Uso: getMembershipStatus(membership) → ComputedMembershipStatus
 * Se implementa en lib/membership-utils.ts
 */

// ============ NOTIFICACIONES ============
/**
 * Registro de notificaciones enviadas
 * Usado para evitar duplicados y auditoría
 * Tabla Supabase: notification_logs
 */
export interface NotificationLog {
  id: string; // UUID
  user_id: string; // FK a profiles(id)
  sent_at: Date | string; // Cuándo se envió (timestamp)
  type: 'auto' | 'manual'; // Cómo se disparó
  // - 'auto': Enviada por cron job automático
  // - 'manual': Administrador hizo clic en botón
  status: 'sent' | 'failed'; // Resultado del envío
  message_sid?: string; // ID único de Twilio (si fue exitoso)
  error_message?: string; // Mensaje de error (si falló)
}

// ============ PAYLOADS DE API ============
/**
 * Payload esperado en POST /api/notify
 * Enviar notificación manual a una usuaria
 */
export interface NotifyPayload {
  user_id: string;
}

/**
 * Respuesta de POST /api/notify
 */
export interface NotifyResponse {
  success?: boolean;
  warning?: string;
  alreadySent?: boolean;
  error?: string;
  message_id?: string; // message_sid de Twilio
  user?: string; // Nombre de la usuaria
  phone?: string;
}

/**
 * Respuesta de GET /api/cron
 * Resumen del job de notificaciones automáticas
 */
export interface CronResponse {
  success: boolean;
  timestamp: string; // ISO 8601
  totalFound: number; // Membresías próximas a vencer encontradas
  notified: number; // Notificaciones enviadas exitosamente
  failed: number; // Notificaciones que fallaron
  errors?: string[]; // Detalle de errores (si los hay)
}

// ============ COMPONENTES Y UI ============
/**
 * Props para componentes del dashboard
 */
export interface DashboardProps {
  userName: string;
  userId: string;
}

/**
 * Props para componentes del admin
 */
export interface AdminProps {
  users: Profile[];
  memberships: Membership[];
}

/**
 * Props para el drawer (panel lateral) de detalle de usuaria
 */
export interface UserDrawerProps {
  userId: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Props para tabla de usuarias
 */
export interface UsersTableProps {
  users: (Profile & { membership?: Membership })[];
  onUserSelect?: (userId: string) => void;
}

/**
 * Props para cards de métricas
 */
export interface MetricsCardsProps {
  totalUsers: number;
  activeMembers: number;
  expiredMembers: number;
  pendingActivation: number;
}

// ============ HELPER TYPES ============
/**
 * Tipo para manejo de errores estandarizado
 */
export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
}

/**
 * Tipo para respuesta estandarizada
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
}

/**
 * Tipo para estados de carga
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';