import type { ReactNode } from "react";
import Image from "next/image";
import { BubbleBackground } from "@/components/animate-ui/components/backgrounds/bubble";
import { FlipWords } from "@/components/ui/flip-words";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-[100dvh] grid-cols-1 md:grid-cols-12">
      {/* Left: Auth form (full-height card) */}

      <div className="hidden md:flex md:col-span-7 p-5 h-[100dvh]">
        {/* Right: Brand panel with bubble background applied only here */}
        <BubbleBackground
          interactive
          className="relative w-full h-full rounded-[2rem]"
          colors={{
            first: '46,125,50',   // deep green #2E7D32
            second: '255,152,0',  // orange  #FF9800
            third: '56,142,60',   // green   #388E3C
            fourth: '255,193,7',  // amber   #FFC107
            fifth: '129,199,132', // light green #81C784
            sixth: '255,183,77',  // soft orange #FFB74D
          }}
        >
          <div className="relative z-10 flex h-full w-full flex-col justify-between p-8 sm:p-10 lg:p-14 text-white">
            {/* Top: Logo */}
            <div className="flex items-start">
              <Image
                src="/images/logo.png"
                alt="Seguridad USAL"
                width={180}
                height={20}
                priority
                className="drop-shadow-md h-auto w-auto"
              />
            </div>

            {/* Bottom: Copy */}
            <div>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight drop-shadow-md">
                Seguridad USAL
              </h1>
              <div className="mt-6 text-2xl sm:text-3xl font-medium leading-tight">
                <span className="text-white/80 text-2xl">
                  Monitoreo con IA de
                </span>
                <FlipWords
                  className="text-white text-2xl"
                  words={[
                    "estacionamientos",
                    "cámaras de seguridad",
                    "accesos y visitas",
                    "perímetros y anomalías",
                    "eventos en tiempo real",
                  ]}
                />
              </div>
            </div>
          </div>
        </BubbleBackground>
      </div>

      <div className="flex h-[100dvh] items-center justify-center bg-background p-6 md:p-10 md:col-span-5">
        {children}
      </div>
    </div>
  );
}
