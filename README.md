# AudioMelo

Local audio converter — runs entirely in the browser. No cloud, no uploads.

## Setup

1. **Install dependencies**

   ```bash
   cd AudioMelo
   npm install
   ```

2. **FFmpeg WASM** — The two required files (`ffmpeg-core.js`, `ffmpeg-core.wasm`) are in `public/ffmpeg/`. No extra download needed.

3. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:4810](http://localhost:4810).

## Deploy to Vercel

- Push this repo to GitHub (include `public/ffmpeg/` so the FFmpeg files are committed).
- In [Vercel](https://vercel.com), import the repo and deploy. No env vars or special config needed.
- The app runs fully in the browser; the first load fetches the WASM (~32 MB) from your deployment.

## Features

- Upload: MP3, WAV, OGG, FLAC, AAC, M4A, WMA, Opus, AIFF, WebM
- Convert to WAV or MP3
- Batch: multiple files, one at a time
- Download converted file per row
- Progress bar per file; all processing in the browser
