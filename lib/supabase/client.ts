/**
 * lib/supabase/client.ts
 * Cliente Supabase para navegador (React Components)
 *
 * USO:
 * - Componentes con 'use client'
 * - Interacciones del usuario en tiempo real
 * - Llamadas a Supabase desde el navegador
 *
 * ⚠️ IMPORTANTE:
 * - Las variables NEXT_PUBLIC_* son públicas (visibles en el navegador)
 * - Esto está bien: Supabase está diseñado para esto
 * - Las credenciales anónimas no permiten cambiar datos sin RLS
 * - Para operaciones sensibles, usar lib/supabase/server.ts
 */

'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Crear y retornar cliente Supabase singleton para el navegador
 * 
 * @returns Cliente Supabase configurado
 * 
 * Ejemplo de uso:
 * ```typescript
 * 'use client';
 * import { createClient } from '@/lib/supabase/client';
 * 
 * export default function MyComponent() {
 *   const supabase = createClient();
 *   const { data: { user } } = await supabase.auth.getUser();
 *   return <div>{user?.email}</div>;
 * }
 * ```
 */
export function createClient() {
  // Retornar instancia existente si ya fue creada
  if (supabaseClient) {
    return supabaseClient;
  }

  // Validar que las variables de entorno estén configuradas
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Falta configurar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local'
    );
  }

  // Crear cliente Supabase browser
  supabaseClient = createBrowserClient<Database>(url, key, {
    auth: {
      // Configuración de autenticación
      persistSession: true, // Mantener sesión entre reloads
      autoRefreshToken: true, // Refrescar token automáticamente
      detectSessionInUrl: true, // Detectar sesión en URL (para OAuth)
    },
  });

  return supabaseClient;
}

/**
 * Re-exportar tipos de autenticación de Supabase
 * Uso: import type { User } from '@/lib/supabase/client';
 */
export type { User } from '@supabase/supabase-js';

/**
 * ============ CUÁNDO USAR ESTE ARCHIVO vs server.ts ============
 *
 * USA ESTE ARCHIVO (client.ts):
 * ✅ Componentes con 'use client'
 * ✅ Llamadas desde el navegador del usuario
 * ✅ Operaciones que requieren autenticación del usuario actual
 * ✅ Leer datos públicos (con RLS)
 * ✅ Cambiar datos del usuario actual
 * Ejemplo: Obtener la sesión, actualizar perfil, ver membresía propia
 *
 * USA lib/supabase/server.ts EN SU LUGAR:
 * ✅ Server Components (sin 'use client')
 * ✅ API Routes
 * ✅ Cron jobs
 * ✅ Operaciones que requieren SUPABASE_SERVICE_ROLE_KEY
 * ✅ Cambios administrativos (sin restricción RLS)
 * ✅ Lógica sensible que no debe exponerse al navegador
 * Ejemplo: Crear perfiles, notificaciones automáticas, reportes
 *
 * ============ SEGURIDAD ============
 *
 * Las credenciales NEXT_PUBLIC_SUPABASE_ANON_KEY son PÚBLICAS:
 * - Están visibles en el navegador (en bundle.js)
 * - Cualquiera puede copiarlas
 * - ¡Eso está bien!
 *
 * Supabase protege con Row Level Security (RLS):
 * - Incluso con la key anónima, no puedo cambiar datos ajenos
 * - Cada usuario solo ve/modifica sus propios datos
 * - Las políticas RLS se definen en Supabase
 *
 * La SUPABASE_SERVICE_ROLE_KEY es PRIVADA:
 * - Nunca exponerla al navegador
 * - Solo en servidor (Node.js)
 * - Permite bypassear RLS
 */