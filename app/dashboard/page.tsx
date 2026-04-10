import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import DashboardClient from '@/components/DashboardClient';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);

  // Verificar sesión
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Obtener nombre del usuario
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario';

  return (
    <DashboardClient userName={userName} userId={user.id} />
  );
}