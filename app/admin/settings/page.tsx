import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE_NAME, isValidAdminToken } from '@/lib/constants';
import SettingsForm from './components/SettingsForm';

export default async function AdminSettingsPage() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE_NAME)?.value;

  if (!isValidAdminToken(token)) {
    redirect('/admin/login');
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001f3f] to-[#001f3f] rounded-2xl p-8 text-white shadow-xl">
        <h1
          className="text-4xl md:text-5xl font-bold mb-2"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Settings
        </h1>
        <p className="text-white/80 text-lg">Manage your admin account and preferences</p>
      </div>

      <SettingsForm />
    </div>
  );
}
