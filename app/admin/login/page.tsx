import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE_NAME, isValidAdminToken } from '@/lib/constants';
import AdminLoginForm from './AdminLoginForm';

export default async function AdminLoginPage() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE_NAME)?.value;

  // If already authenticated, redirect to dashboard
  if (isValidAdminToken(token)) {
    redirect('/admin/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#001f3f] to-[#003366]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border-2 border-[#d4af37]/20 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#001f3f]" style={{ fontFamily: 'Playfair Display, serif' }}>
              TunisShoes
            </h1>
            <p className="mt-2 text-[#d4af37] uppercase tracking-widest text-sm font-semibold">
              Admin Portal
            </p>
          </div>
          <AdminLoginForm />
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex justify-center">
              <p className="text-xs text-gray-400">
                Secure Access • Luxury E-commerce
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
