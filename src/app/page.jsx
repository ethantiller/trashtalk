'use client'
import { useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Welcome() {
  const videoRef = useRef(null);
  const router = useRouter();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videos/video1.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 flex justify-between items-center px-12 py-8 z-10">
        <div className="text-white text-2xl font-semibold tracking-wide">
          TRASHTALKERS.TECH
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => router.push('/login')}
            className="cursor-pointer bg-white text-black font-medium px-8 py-3 rounded-md hover:bg-zinc-200 transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={() => router.push('/signup')}
            className="cursor-pointer bg-white text-black font-medium px-8 py-3 rounded-md hover:bg-zinc-200 transition-colors"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-white text-center">
        <h1 className="text-7xl font-semibold leading-tight mb-6 tracking-wide">
          TRASHTALKERS.TECH
        </h1>
        <p className="text-xl font-light opacity-90">
          Know Where It Goes.
        </p>
      </main>
    </div>
  );
}