"use client";
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();

    return (
        <div>
            <button onClick={() => router.push('/login')}>Go to Login</button>
            <button onClick={() => router.push('/signup')}>Go to Signup</button>
        </div>
    );
}
