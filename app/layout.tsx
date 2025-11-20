import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Agentic Media Studio',
  description:
    'AI-native pipeline that turns scripts into narrated video stories and schedules posts automatically.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
