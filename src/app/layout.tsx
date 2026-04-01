import type { Metadata } from 'next';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  title: 'Baladar Gastro Bar | Cocina Local y Saludable en Pereira',
  description:
    'Baladar Gastro Bar - Cocina local y saludable, laboratorio de experiencias y buena música. Pizzas artesanales, cócteles, café de especialidad en Pereira, Colombia.',
  keywords: [
    'restaurante pereira',
    'gastro bar pereira',
    'pizzas artesanales',
    'cocina local',
    'baladar',
    'comida saludable pereira',
  ],
  icons: {
    icon: [
      { url: `${basePath}/favicon.ico`, sizes: '32x32' },
      { url: `${basePath}/icon-192.png`, sizes: '192x192', type: 'image/png' },
    ],
    apple: `${basePath}/apple-touch-icon.png`,
  },
  openGraph: {
    title: 'Baladar Gastro Bar',
    description: 'Cocina local y saludable, laboratorio de experiencias y buena música',
    type: 'website',
    images: [`${basePath}/logo-company.webp`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
