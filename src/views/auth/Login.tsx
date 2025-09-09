'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { SurveillanceIcon } from '@/components';
import { SignIn } from '@clerk/nextjs';

export function Login() {
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => router.push('/welcome')}
        className="w-fit h-fit p-2 rounded-lg mb-6 hover:bg-gray-100 transition-colors"
      >
        <ChevronLeftIcon width={28} height={28} />
      </button>

      <div className="mb-6 flex justify-center">
        <SurveillanceIcon width={200} height={150} />
      </div>

      <SignIn routing="path" path="/login" signUpUrl="/register" />
    </>
  );
}
