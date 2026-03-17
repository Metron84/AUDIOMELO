import { AudioConverterClient } from '@/components/AudioConverterClient';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-100 py-8">
      <AudioConverterClient />
      <p className="mx-auto mt-6 max-w-2xl px-6 text-center text-sm text-neutral-500">
        All conversion runs locally in your browser. No files are uploaded.
      </p>
    </main>
  );
}
