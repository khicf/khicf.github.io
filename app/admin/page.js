
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import AdminPageClient from './AdminPageClient';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  if (!session || !['ADMIN', 'CORE'].includes(session.user.role)) {
    redirect('/');
  }

  return <AdminPageClient />;
}
