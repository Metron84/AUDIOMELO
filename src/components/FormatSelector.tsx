'use client';

type Format = 'wav' | 'mp3';

interface FormatSelectorProps {
  value: Format;
  onChange: (format: Format) => void;
}

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => onChange('wav')}
        className={`flex-1 rounded-lg border-2 px-4 py-3 text-left transition ${
          value === 'wav'
            ? 'border-blue-600 bg-blue-50 text-blue-900'
            : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
        }`}
      >
        <span className="font-semibold">WAV</span>
        <p className="mt-1 text-sm opacity-80">Lossless, larger file size</p>
      </button>
      <button
        type="button"
        onClick={() => onChange('mp3')}
        className={`flex-1 rounded-lg border-2 px-4 py-3 text-left transition ${
          value === 'mp3'
            ? 'border-blue-600 bg-blue-50 text-blue-900'
            : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
        }`}
      >
        <span className="font-semibold">MP3</span>
        <p className="mt-1 text-sm opacity-80">Compressed, universal</p>
      </button>
    </div>
  );
}
