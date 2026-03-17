'use client';

type Status = 'queued' | 'converting' | 'done' | 'error';

interface FileQueueItemProps {
  name: string;
  outputFormat: 'wav' | 'mp3';
  status: Status;
  progress?: number;
  outputBlob?: Blob | null;
  outputName?: string;
  errorMessage?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileQueueItem({
  name,
  outputFormat,
  status,
  progress = 0,
  outputBlob,
  outputName,
  errorMessage,
}: FileQueueItemProps) {
  const handleDownload = () => {
    if (!outputBlob || !outputName) return;
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = outputName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ext = name.includes('.')
    ? name.split('.').pop()?.toLowerCase()
    : 'audio';

  return (
    <div className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-3">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-neutral-900">{name}</p>
        <p className="text-sm text-neutral-500">
          {ext} → {outputFormat.toUpperCase()}
          {status === 'done' &&
            outputBlob &&
            ` · ${formatSize(outputBlob.size)}`}
        </p>
        {status === 'converting' && (
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        )}
        {status === 'error' && errorMessage && (
          <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
        )}
      </div>
      <div className="shrink-0">
        {status === 'queued' && (
          <span className="text-sm text-neutral-400">Queued</span>
        )}
        {status === 'converting' && (
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        )}
        {status === 'done' && (
          <button
            type="button"
            onClick={handleDownload}
            className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
          >
            Download
          </button>
        )}
        {status === 'error' && (
          <span className="text-sm text-red-600">Error</span>
        )}
      </div>
    </div>
  );
}
