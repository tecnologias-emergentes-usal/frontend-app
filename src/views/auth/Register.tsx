'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { SurveillanceIcon } from '@/components';
import { SignUp } from '@clerk/nextjs';

export function Register() {
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => router.push('/auth/welcome')}
        className="w-fit h-fit p-2 rounded-lg mb-6 hover:bg-gray-100 transition-colors"
      >
        <ChevronLeftIcon width={28} height={28} />
      </button>

      <div className="mb-6 flex justify-center">
        <SurveillanceIcon width={200} height={150} />
      </div>

      <SignUp routing="path" path="/auth/register" signInUrl="/auth/login" />
    </>
  );
}
