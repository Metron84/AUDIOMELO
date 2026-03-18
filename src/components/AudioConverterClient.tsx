'use client';

import dynamic from 'next/dynamic';

const AudioConverter = dynamic(
  () => import('./AudioConverter').then((m) => m.AudioConverter),
  { ssr: false }
);

export function AudioConverterClient() {
  return <AudioConverter />;
}
