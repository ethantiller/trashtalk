'use client';

import { useState } from 'react';
import Link from 'next/link';
import { auth } from '@/app/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(   '');
    setSuccess(false);
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setEmail('');
    } catch (err) {
      console.error('Password reset error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">TrashTalkers.tech</h1>
        </div>
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-2">
            Forgot password?
          </h2>
          <p className="text-zinc-400 text-center mb-8">
            {success 
              ? "Check your email for reset instructions"
              : "Enter your email and we'll send you a reset link"
            }
          </p>

          {success ? (
            <div className="space-y-6">
              <div className="bg-green-900/20 border border-green-800 rounded-md p-4">
                <p className="text-green-400 text-sm text-center">
                  Password reset email sent! Check your inbox and follow the instructions to reset your password.
                </p>
              </div>
              
              <Link 
                href="/login"
                className="block w-full bg-white text-black font-medium py-3 rounded-md hover:bg-zinc-200 transition-colors text-center"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-md p-3">
                  <p className="text-red-400 text-sm text-center">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-medium py-3 rounded-md hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send reset link'}
              </button>

              <div className="text-center">
                <Link 
                  href="/login" 
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}