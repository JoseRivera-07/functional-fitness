import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import AdminClient from '@/components/AdminClient';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);

  // Verificar sesión
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Obtener todas las usuarias
  const { data: users } = await supabase
    .from('profiles')
    .select('id, name, phone, created_at')
    .order('created_at', { ascending: false });

  // Obtener todas las membresías
  const { data: memberships } = await supabase
    .from('memberships')
    .select('user_id, last_payment, next_payment, status, activated_at');

  return (
    <AdminClient 
      users={users || []} 
      memberships={memberships || []} 
    />
  );
}