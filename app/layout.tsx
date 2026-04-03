import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Functional Fitness - Gestión de Membresías',
  description: 'Plataforma digital de gestión de membresías para gimnasios. Control en tiempo real del estado de pago y notificaciones automáticas.',
  keywords: 'gimnasio, membresías, gestión, fitness',
  authors: [{ name: 'Functional Fitness' }],
  openGraph: {
    title: 'Functional Fitness',
    description: 'Gestión de membresías digital para gimnasios',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors`}
      >
        {children}
      </body>
    </html>
  );
}