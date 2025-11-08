'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setError('');
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-8">
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Create your account
          </h1>
          <p className="text-zinc-400 text-center mb-8">
            Sign up to get started
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
                required
              />
            </div>

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

            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="w-4 h-4 bg-black border-zinc-700 rounded focus:ring-2 focus:ring-zinc-600"
              />
              <label htmlFor="showPassword" className="ml-2 text-sm text-zinc-300">
                Show Password
              </label>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-white text-black font-medium py-3 rounded-md hover:bg-zinc-200 transition-colors"
            >
              Continue
            </button>
          </div>

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
              className="mt-6 w-full bg-white text-gray-700 font-medium py-3 rounded-md hover:bg-zinc-200 transition-colors flex items-center justify-center gap-3"
            >
              <Image
                src="/google-icon.png"
                alt="Google Logo"
                width={20}
                height={20}
              />
              Continue with Google
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{' '}
            <Link href="/login" className="text-white hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}