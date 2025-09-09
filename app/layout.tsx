import type { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { esES } from '@clerk/localizations';
import '@/app.css';
import { validateEnv } from '@/lib/env';
import { RouteGuard } from '@/components/RouteGuard';
import { NotificationProvider } from '@/context/NotificationContext';
import { PredictionsNotificationProvider } from '@/context/PredictionsNotificationContext';
import { BarrierProvider } from '@/context/BarrierContext';

validateEnv();

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) {
  throw new Error('Missing Clerk Publishable Key');
}

const getCSSVariable = (variable: string) => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim();
  }
  return '';
};

const customLocalization = {
  locale: 'es-ES',
  applicationName: 'HorusAlert',
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

const clerkAppearance = {
  elements: {
    card: '!shadow-none !bg-transparent p-1',
    rootBox: '!bg-transparent !shadow-none !w-full',
    cardBox: '!shadow-none !bg-transparent !w-full',
    footer: '!bg-transparent !shadow-none !w-full',
    footerAction: '!bg-gray-50 !rounded-lg !p-4',
    formContainer: '!shadow-none !w-full',
    form: '!w-full',
    formFieldInput: '!py-2.5 !px-3 !text-sm !w-full',
    formButtonPrimary: '!py-2.5 !px-4 !text-sm !font-medium !w-full',
    socialButtonsBlockButton: '!py-2.5 !px-4 !text-sm !w-full',
    formFieldLabel: '!text-sm !font-medium',
    footerActionText: '!text-sm',
    footerActionLink: '!text-sm !font-semibold',
    headerTitle: '!text-2xl !font-bold !text-left',
    headerSubtitle: '!text-base !text-gray-600 !text-left',
    header: '!text-left',
  },
  layout: {
    socialButtonsPlacement: 'top' as const,
    socialButtonsVariant: 'blockButton' as const,
    showOptionalFields: false,
    logoPlacement: 'none' as const,
  },
  variables: {
    colorPrimary: getCSSVariable('--primary') || '#388E3C',
    colorDanger: getCSSVariable('--destructive') || '#FF9800',
    colorSuccess: getCSSVariable('--primary') || '#388E3C',
    colorNeutral: getCSSVariable('--secondary') || '#616161',
    colorText: getCSSVariable('--foreground') || '#212121',
    colorTextSecondary: getCSSVariable('--muted-foreground') || '#616161',
    colorInputBackground: getCSSVariable('--input') || '#F4F4F4',
    colorInputText: getCSSVariable('--foreground') || '#212121',
    borderRadius: getCSSVariable('--radius') || '0.5rem',
    fontFamily: 'inherit',
    spacingUnit: '1rem',
  },
};

const localization = {
  ...esES,
  ...customLocalization,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={clerkAppearance}
      localization={localization}
      signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
      signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
      signInFallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL}
      signUpFallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL}
    >
      <html lang="en">
        <body>
          <NotificationProvider>
            <PredictionsNotificationProvider>
              <BarrierProvider>
                <RouteGuard>{children}</RouteGuard>
              </BarrierProvider>
            </PredictionsNotificationProvider>
          </NotificationProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
