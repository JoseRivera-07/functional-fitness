/**
 * lib/supabase/server.ts
 * Cliente Supabase para servidor (Server Components y API Routes)
 *
 * USO:
 * - Server Components (sin 'use client')
 * - API Routes (/app/api/*)
 * - Cron jobs
 * - Operaciones administrativas
 *
 * DOS CLIENTES DISPONIBLES:
 * 1. createServerClient(cookies) - Con permisos del usuario actual
 * 2. createServiceRoleClient() - Con permisos de admin (sin RLS)
 */

import { createServerClient as createServerClientSSR } from '@supabase/ssr';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import type { CookieOptions } from '@supabase/ssr';

/**
 * Crear cliente Supabase en el servidor con la sesión del usuario actual
 *
 * @param cookies - Objeto de cookies del request (Next.js)
 * @returns Cliente Supabase con permisos del usuario actual
 *
 * Uso en Server Component:
 * ```typescript
 * import { createServerClient } from '@/lib/supabase/server';
 * import { cookies } from 'next/headers';
 *
 * export default async function MyServerComponent() {
 *   const cookieStore = cookies();
 *   const supabase = createServerClient(cookieStore);
 *   const { data: { user } } = await supabase.auth.getUser();
 *   return <div>{user?.email}</div>;
 * }
 * ```
 *
 * Uso en API Route:
 * ```typescript
 * import { createServerClient } from '@/lib/supabase/server';
 *
 * export async function POST(request: NextRequest) {
 *   const supabase = createServerClient(request.cookies);
 *   const { data: { user } } = await supabase.auth.getUser();
 *   // Solo el usuario actual puede operar
 * }
 * ```
 */
export function createServerClient(
  cookies: Parameters<typeof createServerClientSSR>[1]
) {
  return createServerClientSSR<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * Leer cookies del request
         * Supabase usa esto para obtener el token de sesión
         */
        getAll() {
          return cookies.getAll();
        },
        /**
         * Guardar cookies (cuando se refresca el token)
         * El middleware de Supabase actualiza automáticamente la sesión
         */
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookies.set(name, value, options as CookieOptions);
            });
          } catch (error) {
            console.error('Error setting cookies:', error);
            // En algunos contextos las cookies no pueden modificarse
            // pero esto no debe fallar la autenticación
          }
        },
      },
      auth: {
        persistSession: false, // No persistir en servidor
        autoRefreshToken: true, // Refrescar tokens automáticamente
        detectSessionInUrl: false, // No necesario en servidor
      },
    }
  );
}

/**
 * Crear cliente Supabase en el servidor CON PERMISOS DE ADMIN
 * Usa SUPABASE_SERVICE_ROLE_KEY para bypassear Row Level Security
 *
 * ⚠️ CUIDADO: Este cliente NUNCA debe exponerse al navegador
 *
 * @returns Cliente Supabase con permisos de admin (sin restricción RLS)
 *
 * Uso en API Route (operación administrativa):
 * ```typescript
 * import { createServiceRoleClient } from '@/lib/supabase/server';
 *
 * export async function POST(request: NextRequest) {
 *   const supabase = createServiceRoleClient();
 *   // Crear/actualizar/eliminar datos sin restricción RLS
 *   await supabase
 *     .from('profiles')
 *     .update({ role: 'admin' })
 *     .eq('id', userId);
 * }
 * ```
 *
 * Uso en Cron Job:
 * ```typescript
 * import { createServiceRoleClient } from '@/lib/supabase/server';
 *
 * export async function GET(request: NextRequest) {
 *   const supabase = createServiceRoleClient();
 *   // Acceder a TODOS los datos, sin restricción
 *   const { data: allMembers } = await supabase
 *     .from('memberships')
 *     .select('*');
 * }
 * ```
 */
let serviceRoleClient: ReturnType<typeof createServiceClient<Database>> | null =
  null;

export function createServiceRoleClient() {
  // Retornar instancia existente si ya fue creada
  if (serviceRoleClient) {
    return serviceRoleClient;
  }

  // Validar que la key de servicio esté configurada
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY no está configurada en .env.local'
    );
  }

  // Crear cliente con permisos de admin
  serviceRoleClient = createServiceClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        persistSession: false, // No necesaria en servidor
        autoRefreshToken: false, // No necesaria con service role
      },
    }
  );

  return serviceRoleClient;
}

/**
 * ============ CUÁNDO USAR CADA FUNCIÓN ============
 *
 * USA createServerClient(cookies):
 * ✅ Server Components
 * ✅ API Routes normales (que necesitan el usuario autenticado)
 * ✅ Middleware
 * ✅ Obtener datos del usuario actual
 * ✅ Cambiar datos del usuario actual
 * ✅ Respeta Row Level Security (RLS)
 *
 * Ejemplo:
 * ```typescript
 * const supabase = createServerClient(cookies);
 * const { data: { user } } = await supabase.auth.getUser();
 * // Solo puedo ver/cambiar datos míos (RLS protege)
 * ```
 *
 * USA createServiceRoleClient():
 * ✅ Cron jobs (notificaciones automáticas)
 * ✅ Operaciones administrativas
 * ✅ Migraciones de datos
 * ✅ Cambios que afectan a múltiples usuarios
 * ✅ Operaciones que requieren bypassear RLS
 * ❌ NUNCA pasar al navegador (componentes 'use client')
 * ❌ NUNCA confiar en ella para proteger datos
 *
 * Ejemplo:
 * ```typescript
 * const supabase = createServiceRoleClient();
 * await supabase.from('profiles').update({...}); // Sin restricción
 * // Puedo ver/cambiar datos de CUALQUIER usuario
 * ```
 *
 * ============ SEGURIDAD ============
 *
 * SUPABASE_SERVICE_ROLE_KEY es PRIVADA:
 * - Solo en variables de entorno del servidor
 * - Nunca en .env.local público
 * - Nunca en código que se envíe al navegador
 * - Bypassa completamente Row Level Security
 *
 * Si la expones:
 * - Cualquiera puede cambiar datos de otros usuarios
 * - Puede eliminar toda la base de datos
 * - Es como dejar las llaves del servidor en la calle
 *
 * Protección:
 * - Solo usar en endpoints privados
 * - Validar siempre quién está llamando
 * - Loguear todas las operaciones
 * - Revisar permisos del Cron Secret
 *
 * ============ FLOW: LEER SESIÓN DEL USUARIO ============
 *
 * 1. Request llega a API Route
 * 2. Extraer cookies: const supabase = createServerClient(request.cookies)
 * 3. Leer sesión: const { data: { user } } = await supabase.auth.getUser()
 * 4. Si user es null → no autenticado → retornar 401
 * 5. Si user existe → autenticado → procesar
 *
 * Las cookies contienen el token JWT de sesión.
 * Supabase las decodifica automáticamente.
 */