'use client'
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Welcome() {
  const videoRef = useRef(null);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Video or Black Background */}
      {!isMobile ? (
        <video
          ref={videoRef}
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/video1.webm" type="video/webm" />
        </video>
      ) : (
        <div className="absolute inset-0 bg-black"></div>
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 md:px-12 py-6 md:py-8 z-10">
        <div className="text-white text-lg md:text-2xl font-semibold tracking-wide">
          TRASHTALK.TECH
        </div>
        <div className="flex gap-2 md:gap-4">
          <button 
            onClick={() => router.push('/login')}
            className="cursor-pointer bg-white text-black font-medium px-4 md:px-8 py-2 md:py-3 rounded-md hover:bg-zinc-200 transition-colors text-sm md:text-base"
          >
            Sign In
          </button>
          <button 
            onClick={() => router.push('/signup')}
            className="cursor-pointer bg-white text-black font-medium px-4 md:px-8 py-2 md:py-3 rounded-md hover:bg-zinc-200 transition-colors text-sm md:text-base"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-white text-center px-6">
        <h1 className="text-4xl md:text-7xl font-semibold leading-tight mb-4 md:mb-6 tracking-wide">
          TRASHTALK.TECH
        </h1>
        <p className="text-base md:text-xl font-light opacity-90">
          Know Where It Goes.
        </p>
      </main>
    </div>
  );
}