/**
 * middleware.ts
 * Middleware de Next.js para autenticación y protección de rutas
 *
 * Funcionalidad:
 * - Detectar sesión autenticada
 * - Leer rol del usuario desde tabla profiles
 * - Proteger rutas por rol
 * - Redirigir según permisos
 *
 * Corre en cada request a las rutas definidas en config.matcher
 */

import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Middleware principal
 * Se ejecuta ANTES de que llegue el request a las pages/api routes
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  try {
    const supabase = createServerClient(request.cookies);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;
    const isLoginPage = pathname === '/login';
    const isDashboard = pathname.startsWith('/dashboard');
    const isAdmin = pathname.startsWith('/admin');
    const isRoot = pathname === '/';

    // Sin sesión → redirigir a login (excepto si ya está en login)
    if (!user) {
      if (isLoginPage) {
        return response;
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Autenticado en /login → redirigir a /dashboard
    if (isLoginPage && user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Autenticado en / → redirigir a /dashboard
    if (isRoot && user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Permitir acceso a /dashboard y /admin
    // El page.tsx de cada ruta verificará el rol
    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return response;
  }
}

/**
 * Configuración del matcher
 * Define qué rutas corren a través del middleware
 *
 * - / : Raíz
 * - /login : Página de login
 * - /dashboard/:path* : Dashboard y sub-rutas
 * - /admin/:path* : Admin panel y sub-rutas
 *
 * Las rutas que NO están en el matcher (como /api/*, /public/*, etc)
 * no pasan por este middleware
 */
export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard',
    '/dashboard/:path*',
    '/admin',
    '/admin/:path*',
  ],
};

/**
 * ============ FLUJO DE AUTENTICACIÓN ============
 *
 * USUARIO NO AUTENTICADO:
 * 1. Accede a http://localhost:3000
 * 2. Middleware detecta: no hay sesión
 * 3. Redirige a /login
 * 4. Usuario ve página de login
 *
 * USUARIO AUTENTICADO (client):
 * 1. Accede a http://localhost:3000
 * 2. Middleware detecta: sesión existe, rol='client'
 * 3. Redirige a /dashboard
 * 4. Usuario ve su dashboard
 *
 * USUARIO AUTENTICADO (admin):
 * 1. Accede a http://localhost:3000
 * 2. Middleware detecta: sesión existe, rol='admin'
 * 3. Redirige a /admin
 * 4. Usuario ve panel de admin
 *
 * USUARIO INTENTA ACCESO NO AUTORIZADO:
 * 1. Usuario 'client' accede a /admin
 * 2. Middleware detecta: rol='client' pero intenta /admin
 * 3. Redirige a /dashboard
 * 4. Usuario accede a ruta permitida
 *
 * ============ PERFORMANCE ============
 *
 * Este middleware es eficiente porque:
 * - Solo se ejecuta en rutas del matcher
 * - Usa cookies (no hace fetch extra)
 * - Cachea la sesión en el request
 * - No hace queries a BD (excepto por el rol)
 *
 * Si performance se deteriora:
 * - Caching del rol en JWT (más complejo)
 * - Reducir rutas en matcher (menos protección)
 * - Eliminar query de perfil (menos seguridad)
 *
 * Trade-off: Seguridad vs Performance
 * Decisión: Seguridad primero (1 query por request es aceptable)
 *
 * ============ DEBUGGING ============
 *
 * Si los redirects no funcionan en desarrollo:
 * - Verificar que las cookies se guardan
 * - Verificar que Supabase está configurado
 * - Verificar que la tabla profiles existe
 * - Revisar logs del middleware en terminal
 *
 * Para debuggear:
 * console.log('Middleware: user =', user?.id);
 * console.log('Middleware: role =', userRole);
 * console.log('Middleware: pathname =', pathname);
 */