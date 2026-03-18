import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AudioMelo — Local Audio Converter',
  description:
    'Convert audio files locally in your browser. No cloud, no uploads.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
