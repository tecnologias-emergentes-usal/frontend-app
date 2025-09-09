'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'konsta/react';
import { SurveillanceIcon } from '@/components';

export function Welcome() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className="mb-6 flex justify-center">
        <SurveillanceIcon width={300} height={220} />
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-left">USAL Alert</h1>
        <p className="text-secondary text-lg text-left">Todo lo que necesitas está en un solo lugar</p>
      </div>

      <div className="mb-8">
        <p className="text-secondary text-left">
          Encuentra tu sistema de vigilancia inteligente con USAL Alert. La plataforma más avanzada de seguridad ha llegado a tu dispositivo móvil.
        </p>
      </div>

      <div className="space-y-4">
        <Button
          large
          onClick={() => router.push('/login')}
          className="w-full text-white"
        >
          Iniciar Sesión
        </Button>
        <Button
          large
          outline
          onClick={() => router.push('/register')}
          className="w-full text-secondary border-secondary"
        >
          Registrarse
        </Button>
      </div>
    </>
  );
}
