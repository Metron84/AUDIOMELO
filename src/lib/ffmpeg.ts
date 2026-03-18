import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

const ffmpegInstance = new FFmpeg();

let loaded = false;

const CORE_VERSION = '0.12.6';
const CORE_URL = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd`;

export async function loadFFmpeg(): Promise<FFmpeg> {
  if (loaded) return ffmpegInstance;
  const coreURL = await toBlobURL(`${CORE_URL}/ffmpeg-core.js`, 'text/javascript');
  const wasmURL = await toBlobURL(`${CORE_URL}/ffmpeg-core.wasm`, 'application/wasm');
  await ffmpegInstance.load({ coreURL, wasmURL });
  loaded = true;
  return ffmpegInstance;
}

export { ffmpegInstance };
