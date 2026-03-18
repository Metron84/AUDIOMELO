'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { loadFFmpeg } from '@/lib/ffmpeg';
import { convertAudio } from '@/lib/convertAudio';
import { AudioConverterIcon } from './AudioConverterIcon';
import { FileDropZone } from './FileDropZone';
import { FileQueueItem } from './FileQueueItem';
import { FormatSelector } from './FormatSelector';

type FileStatus = 'queued' | 'converting' | 'done' | 'error';

interface QueueEntry {
  id: string;
  file: File;
  status: FileStatus;
  progress: number;
  outputBlob: Blob | null;
  outputName: string | null;
  errorMessage: string | null;
}

function outputFileName(name: string, outputFormat: 'wav' | 'mp3'): string {
  const base = name.replace(/\.[^/.]+$/, '') || name;
  return `${base}.${outputFormat}`;
}

export function AudioConverter() {
  const [files, setFiles] = useState<QueueEntry[]>([]);
  const [outputFormat, setOutputFormat] = useState<'wav' | 'mp3'>('mp3');
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const processingRef = useRef(false);

  useEffect(() => {
    loadFFmpeg()
      .then(() => setFfmpegLoaded(true))
      .catch((err) =>
        setLoadError(err?.message ?? 'Failed to load FFmpeg')
      );
  }, []);

  const addFiles = useCallback((newFiles: File[]) => {
    const valid = newFiles.filter((f) => f.type.startsWith('audio/'));
    if (valid.length === 0) return;
    setFiles((prev) => [
      ...prev,
      ...valid.map((f) => ({
        id: `${f.name}-${Date.now()}-${Math.random()}`,
        file: f,
        status: 'queued' as FileStatus,
        progress: 0,
        outputBlob: null as Blob | null,
        outputName: null as string | null,
        errorMessage: null as string | null,
      })),
    ]);
  }, []);

  const processNext = useCallback(async () => {
    if (processingRef.current) return;
    const next = files.find((e) => e.status === 'queued');
    if (!next) return;

    processingRef.current = true;
    setFiles((prev) =>
      prev.map((e) =>
        e.id === next.id
          ? { ...e, status: 'converting' as FileStatus, progress: 0 }
          : e
      )
    );

    const onProgress = (progress: number) => {
      setFiles((prev) =>
        prev.map((e) => (e.id === next.id ? { ...e, progress } : e))
      );
    };

    try {
      const blob = await convertAudio(next.file, outputFormat, onProgress);
      const outputName = outputFileName(next.file.name, outputFormat);
      setFiles((prev) =>
        prev.map((e) =>
          e.id === next.id
            ? {
                ...e,
                status: 'done' as FileStatus,
                outputBlob: blob,
                outputName,
              }
            : e
        )
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Conversion failed';
      setFiles((prev) =>
        prev.map((e) =>
          e.id === next.id
            ? { ...e, status: 'error' as FileStatus, errorMessage: msg }
            : e
        )
      );
    } finally {
      processingRef.current = false;
      setFiles((prev) => {
        const hasMore = prev.some((e) => e.status === 'queued');
        if (hasMore) setTimeout(processNext, 0);
        return prev;
      });
    }
  }, [files, outputFormat]);

  useEffect(() => {
    if (!ffmpegLoaded || files.length === 0) return;
    const hasQueued = files.some((e) => e.status === 'queued');
    const isConverting = files.some((e) => e.status === 'converting');
    if (hasQueued && !isConverting && !processingRef.current) {
      processNext();
    }
  }, [ffmpegLoaded, files, outputFormat, processNext]);

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-neutral-900">
        <AudioConverterIcon className="h-8 w-8 shrink-0 text-blue-600" />
        Audio Converter
      </h1>

      {loadError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          {loadError}
        </div>
      )}

      <FormatSelector value={outputFormat} onChange={setOutputFormat} />
      <FileDropZone
        onFiles={addFiles}
        disabled={!ffmpegLoaded}
        loading={!ffmpegLoaded && !loadError}
      />

      <ul className="space-y-2">
        {files.map((entry) => (
          <li key={entry.id}>
            <FileQueueItem
              name={entry.file.name}
              outputFormat={outputFormat}
              status={entry.status}
              progress={entry.progress}
              outputBlob={entry.outputBlob}
              outputName={entry.outputName ?? undefined}
              errorMessage={entry.errorMessage ?? undefined}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
