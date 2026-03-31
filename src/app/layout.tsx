import type { Metadata } from 'next';

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
  openGraph: {
    title: 'Baladar Gastro Bar',
    description: 'Cocina local y saludable, laboratorio de experiencias y buena música',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
