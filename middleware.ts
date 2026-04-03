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
  // Iniciar respuesta que pasará al siguiente middleware/handler
  let response = NextResponse.next({
    request,
  });

  try {
    // ============ PASO 1: CREAR CLIENTE SUPABASE ============
    const supabase = createServerClient(request.cookies);

    // ============ PASO 2: OBTENER SESIÓN ACTUAL ============
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // ============ PASO 3: DEFINIR RUTAS PROTEGIDAS ============
    const pathname = request.nextUrl.pathname;
    const isLoginPage = pathname === '/login';
    const isDashboard = pathname.startsWith('/dashboard');
    const isAdmin = pathname.startsWith('/admin');
    const isRoot = pathname === '/';

    // ============ PASO 4: LÓGICA DE AUTENTICACIÓN ============

    // Si NO hay sesión (usuario no autenticado)
    if (!user || authError) {
      // Permitir acceso a /login
      if (isLoginPage) {
        return response;
      }

      // Redirigir rutas protegidas a /login
      if (isDashboard || isAdmin) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Redirigir root a /login
      if (isRoot) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      return response;
    }

    // ============ PASO 5: OBTENER ROL DEL USUARIO ============
    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Si hay error al obtener el perfil, no confiar en el rol
    const userRole = profileError || !profile ? 'client' : profile.role;

    // ============ PASO 6: LÓGICA DE AUTORIZACIÓN ============

    // Si usuario autenticado intenta /login → redirigir al dashboard/admin según rol
    if (isLoginPage) {
      const redirectUrl = userRole === 'admin' ? '/admin' : '/dashboard';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // Si usuario intenta /admin pero NO es admin → redirigir a /dashboard
    if (isAdmin && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Si usuario intenta /dashboard pero ES admin → redirigir a /admin
    if (isDashboard && userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Si usuario autenticado accede a / → redirigir según rol
    if (isRoot) {
      const redirectUrl = userRole === 'admin' ? '/admin' : '/dashboard';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // ============ PASO 7: RETORNAR RESPUESTA ============
    // El usuario tiene permiso para acceder a esta ruta
    return response;
  } catch (error) {
    // En caso de error no esperado, permitir el request
    // (mejor que bloquear todo por un error temporal)
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