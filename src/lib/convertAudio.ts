import { fetchFile } from '@ffmpeg/util';
import { loadFFmpeg } from './ffmpeg';

function getExtension(name: string): string {
  const i = name.lastIndexOf('.');
  return i >= 0 ? name.slice(i + 1).toLowerCase() : '';
}

export type OutputFormat = 'wav' | 'mp3';

export async function convertAudio(
  file: File,
  outputFormat: OutputFormat,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ffmpeg = await loadFFmpeg();

  const ext = getExtension(file.name) || 'bin';
  const inputName = `input.${ext}`;
  const outputName = outputFormat === 'mp3' ? 'output.mp3' : 'output.wav';

  const off = onProgress
    ? (e: { progress: number }) => onProgress(e.progress)
    : () => {};
  ffmpeg.on('progress', off);

  try {
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    if (outputFormat === 'mp3') {
      await ffmpeg.exec(['-i', inputName, '-q:a', '2', outputName]);
    } else {
      await ffmpeg.exec(['-i', inputName, '-acodec', 'pcm_s16le', outputName]);
    }

    const data = await ffmpeg.readFile(outputName);
    const uint8: Uint8Array =
      data instanceof Uint8Array ? data : new Uint8Array(data as unknown as ArrayBuffer);
    const mime = outputFormat === 'mp3' ? 'audio/mpeg' : 'audio/wav';
    const copy = new Uint8Array(uint8.length);
    copy.set(uint8);
    return new Blob([copy], { type: mime });
  } finally {
    ffmpeg.off('progress', off);
    try {
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch {
      // ignore cleanup errors
    }
  }
}
