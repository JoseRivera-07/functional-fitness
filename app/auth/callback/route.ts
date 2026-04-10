/**
 * app/auth/callback/route.ts
 * Callback OAuth de Supabase para Google Auth
 *
 * Supabase redirige aquí después de que el usuario se autentica con Google.
 * Este endpoint intercambia el código por una sesión de usuario.
 *
 * Arreglado para Next.js 16: cookies() es async
 */

import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  // Obtener el código del query string
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    // Si no hay código, redirigir a login con error
    return NextResponse.redirect(
      new URL('/login?error=no_code', request.url)
    );
  }

  try {
    // ✅ ARREGLO: await antes de cookies()
    let cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);

    // Intercambiar código por sesión
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(
        new URL(`/login?error=${error.message}`, request.url)
      );
    }

    // Si todo está bien, redirigir a dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(
      new URL('/login?error=server_error', request.url)
    );
  }
}