'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { adminLogout } from '@/app/actions/admin';

export default function AdminLogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await adminLogout();
          router.push('/');
          router.refresh();
        })
      }
      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:text-black disabled:opacity-60"
    >
      {isPending ? 'Signing out…' : 'Sign out'}
    </button>
  );
}

