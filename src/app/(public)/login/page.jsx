'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from '@/app/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { setCookie } from 'cookies-next';
import { updateUserLastLogin } from '@/app/lib/firebaseFunctions/firebaseAuth/firebaseDBAuth';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateUserLastLogin(userCredential.user.uid);

      const user = userCredential.user;
      const token = await user.getIdToken();

      setCookie('firebaseToken', token, {
        maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7, // 30 days if rememberMe, else 7 days
        path: '/',
        secure: true,
        sameSite: 'lax'
      });

      router.push(`/dashboard/${user.uid}`);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to log in');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      setCookie('firebaseToken', token, {
        maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7,
        path: '/',
        secure: true,
        sameSite: 'lax'
      });

      router.push(`/dashboard/${user.uid}`);
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.message || 'Failed to continue with Google');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Trash Talk</h1>
        </div>
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-2">
            Welcome back
          </h2>
          <p className="text-zinc-400 text-center mb-8">
            Log in to your account
          </p>

          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="w-4 h-4 bg-black border-zinc-700 rounded focus:ring-2 focus:ring-zinc-600"
                />
                <label htmlFor="showPassword" className="ml-2 text-sm text-zinc-300">
                  Show password
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 bg-black border-zinc-700 rounded focus:ring-2 focus:ring-zinc-600"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-zinc-300">
                  Remember me
                </label>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="cursor-pointer w-full bg-white text-black font-medium py-3 rounded-md hover:bg-zinc-200 transition-colors"
            >
              Log in
            </button>

            <div className="text-center">
              <a href="#" className="cursor-pointer text-sm text-zinc-400 hover:text-white transition-colors">
                Forgot password?
              </a>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-zinc-900 text-zinc-400">Or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="cursor-pointer mt-6 w-full bg-white text-gray-700 font-medium py-3 rounded-md hover:bg-zinc-200 transition-colors flex items-center justify-center gap-3"
            >
              <Image
                src="/Google.webp"
                alt="Google Logo"
                width={20}
                height={20}
              />
              Continue with Google
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="cursor-pointer text-white hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
