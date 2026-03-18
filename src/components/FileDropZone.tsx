'use client';

import { useCallback, useState } from 'react';

const ACCEPT = 'audio/*';
const FORMATS = 'MP3, WAV, OGG, FLAC, AAC, M4A, WMA, Opus, AIFF, WebM';

interface FileDropZoneProps {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
  loading?: boolean;
}

export function FileDropZone({ onFiles, disabled, loading }: FileDropZoneProps) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (disabled || loading) return;
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('audio/')
      );
      if (files.length) onFiles(files);
    },
    [onFiles, disabled, loading]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files?.length) onFiles(Array.from(files));
      e.target.value = '';
    },
    [onFiles]
  );

  return (
    <label
      className={`block rounded-xl border-2 border-dashed p-8 text-center transition ${
        disabled || loading
          ? 'cursor-not-allowed border-neutral-200 bg-neutral-50 text-neutral-400'
          : dragging
            ? 'border-blue-500 bg-blue-50'
            : 'cursor-pointer border-neutral-300 bg-neutral-50/50 hover:border-neutral-400'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        accept={ACCEPT}
        multiple
        className="sr-only"
        disabled={disabled || loading}
        onChange={handleChange}
      />
      {loading ? (
        <p className="text-neutral-600">Loading FFmpeg…</p>
      ) : (
        <>
          <p className="font-medium text-neutral-700">
            Drop audio files or click to browse
          </p>
          <p className="mt-2 text-sm text-neutral-500">{FORMATS}</p>
        </>
      )}
    </label>
  );
}
