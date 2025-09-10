import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from '@clerk/localizations';
import '@/app.css';
import { ThemeProvider } from '@/components/theme-provider';
import { validateEnv } from '@/lib/env';
import { Inter, EB_Garamond, Fira_Code } from 'next/font/google';

validateEnv();

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) {
  throw new Error('Missing Clerk Publishable Key');
}

// Load Google Fonts via next/font and expose CSS variables
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  weight: ['400', '600', '700'],
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '600', '700'],
});

const customLocalization = {
  locale: 'es-ES',
  applicationName: 'USAL Alertas',
  signIn: {
    start: {
      title: 'Iniciar sesión',
      subtitle: 'Bienvenido de vuelta a {{applicationName}}',
      actionText: '¿No tienes cuenta?',
      actionLink: 'Regístrate',
    },
    emailCode: {
      title: 'Verifica tu email',
      subtitle: 'para acceder a {{applicationName}}',
    },
    password: {
      title: 'Ingresa tu contraseña',
      subtitle: 'para acceder a {{applicationName}}',
    },
    forgotPasswordText: '¿Olvidaste tu contraseña?',
    alternativeMethods: {
      title: 'O continúa con',
    },
  },
  signUp: {
    start: {
      title: 'Crear cuenta',
      subtitle: 'para acceder a {{applicationName}}',
      actionText: '¿Ya tienes cuenta?',
      actionLink: 'Inicia sesión',
    },
    emailCode: {
      title: 'Verifica tu email',
      subtitle: 'para acceder a {{applicationName}}',
    },
  },
  formFieldLabel__emailAddress: 'Correo electrónico',
  formFieldLabel__password: 'Contraseña',
  formFieldLabel__currentPassword: 'Contraseña actual',
  formFieldLabel__newPassword: 'Nueva contraseña',
  formFieldLabel__confirmPassword: 'Confirmar contraseña',
  formFieldLabel__firstName: 'Nombre',
  formFieldLabel__lastName: 'Apellido',
  formFieldLabel__phoneNumber: 'Número de teléfono',
  formButtonPrimary: 'Continuar',
  socialButtonsBlockButton__google: 'Continuar con Google',
  socialButtonsBlockButton__facebook: 'Continuar con Facebook',
  socialButtonsBlockButton__github: 'Continuar con GitHub',
  footerActionLink__signIn: 'Inicia sesión',
  footerActionLink__signUp: 'Regístrate',
  dividerText: 'o',
};

// Theme-aware Clerk appearance using CSS variables
const clerkAppearance = {
  elements: {
    card: 'shadow-none! bg-transparent! p-1',
    rootBox: 'bg-transparent! shadow-none! w-full!',
    cardBox: 'shadow-none! bg-transparent! w-full!',
    footer: 'bg-none! shadow-none! w-full!',
    footerAction: 'bg-none! rounded-lg! p-4!',
    formContainer: 'shadow-none! w-full!',
    form: 'w-full!',
    formFieldInput: 'py-2.5! px-3! text-sm! w-full!',
    formButtonPrimary: 'py-2.5! px-4! text-sm! font-medium! w-full!',
    socialButtonsBlockButton: 'py-2.5! px-4! text-sm! w-full!',
    formFieldLabel: 'text-sm! font-medium!',
    footerActionText: 'text-sm! text-muted-foreground!',
    footerActionLink: 'text-sm! font-semibold! text-primary!',
    headerTitle: 'text-2xl! font-bold! text-left! text-foreground!',
    headerSubtitle: 'text-base! text-muted-foreground! text-left!',
    header: 'text-left!',

  },
  layout: {
    socialButtonsPlacement: 'top' as const,
    socialButtonsVariant: 'blockButton' as const,
    showOptionalFields: false,
    logoPlacement: 'none' as const,
    unsafe_disableDevelopmentModeWarnings: true,
  },
  variables: {
    colorPrimary: 'var(--primary)',
    colorDanger: 'var(--destructive)',
    colorSuccess: 'var(--primary)',
    colorText: 'var(--foreground)',
    colorTextSecondary: 'var(--muted-foreground)',
    colorInputBackground: 'var(--input)',
    colorInputText: 'var(--foreground)',
    borderRadius: 'var(--radius)',
    fontFamily: 'inherit',
    spacingUnit: '1rem',
  },
} as const;

const localization = {
  ...esES,
  ...customLocalization,
};

export const metadata: Metadata = {
  title: {
    default: 'USAL Alertas',
    template: '%s | USAL Alertas',
  },
  applicationName: 'USAL Alertas',
  description: 'Monitoreo inteligente de seguridad para USAL',
  icons: {
    icon: '/images/icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} ${ebGaramond.variable} ${firaCode.variable}`}
    >
      <body className="font-sans">
        <ClerkProvider
          appearance={clerkAppearance}
          localization={localization}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
