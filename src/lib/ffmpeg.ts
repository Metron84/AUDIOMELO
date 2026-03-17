import { FFmpeg } from '@ffmpeg/ffmpeg';

const ffmpegInstance = new FFmpeg();

let loaded = false;

export async function loadFFmpeg(): Promise<FFmpeg> {
  if (loaded) return ffmpegInstance;
  await ffmpegInstance.load({
    coreURL: '/ffmpeg/ffmpeg-core.js',
    wasmURL: '/ffmpeg/ffmpeg-core.wasm',
  });
  loaded = true;
  return ffmpegInstance;
}

export { ffmpegInstance };
