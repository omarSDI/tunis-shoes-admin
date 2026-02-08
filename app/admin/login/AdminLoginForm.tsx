'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { adminLogin } from '@/app/actions/admin';

export default function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const res = await adminLogin(username, password);
      setMessage(res.message);
      if (res.ok) {
        router.push('/admin/dashboard');
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
          placeholder="Enter username"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
          placeholder="Enter password"
          required
        />
      </div>
      {message && (
        <p className="text-sm text-gray-600 border border-gray-200 bg-gray-50 rounded-md p-3">
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-black px-5 py-3 text-white font-semibold hover:bg-gray-800 disabled:opacity-60"
      >
        {isPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

