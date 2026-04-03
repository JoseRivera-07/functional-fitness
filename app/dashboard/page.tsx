import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import DashboardClient from '@/components/DashboardClient';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  // Verificar sesión
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Verificar rol
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, name')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'client') {
    redirect('/login');
  }

  return (
    <DashboardClient userName={profile.name} userId={user.id} />
  );
}