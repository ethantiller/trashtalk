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
      <header className="absolute top-0 left-0 right-0 flex justify-between items-center px-[3vw] py-[2.5vh] z-10">
        <div className="text-white font-semibold tracking-wide text-[clamp(1rem,3vw,1.5rem)]">
          TRASHTALKERS.TECH
        </div>
        <div className="flex gap-[1vw]">
          <button 
            onClick={() => router.push('/login')}
            className="cursor-pointer bg-white text-black font-medium rounded-md hover:bg-zinc-200 transition-colors px-[clamp(1rem,2vw,2rem)] py-[clamp(0.5rem,1.2vh,0.75rem)] text-[clamp(0.875rem,1.5vw,1rem)]"
          >
            Sign In
          </button>
          <button 
            onClick={() => router.push('/signup')}
            className="cursor-pointer bg-white text-black font-medium rounded-md hover:bg-zinc-200 transition-colors px-[clamp(1rem,2vw,2rem)] py-[clamp(0.5rem,1.2vh,0.75rem)] text-[clamp(0.875rem,1.5vw,1rem)]"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-white text-center px-[5vw]">
        <h1 className="font-semibold leading-tight tracking-wide text-[clamp(2rem,8vw,5rem)] mb-[clamp(1rem,2vh,1.5rem)]">
          TRASHTALKERS.TECH
        </h1>
        <p className="font-light opacity-90 text-[clamp(1rem,2.5vw,1.25rem)]">
          Know Where It Goes.
        </p>
      </main>
    </div>
  );
}