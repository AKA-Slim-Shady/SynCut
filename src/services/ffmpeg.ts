//ffmpeg.ts
import { FFmpeg } from "@ffmpeg/ffmpeg";

let ffmpeg: FFmpeg | null = null;

export const ffmpegService = {
  init: async () => {
    if (!ffmpeg) {
      ffmpeg = new FFmpeg();
      await ffmpeg.load({
        coreURL: "/ffmpeg/ffmpeg-core.js",
        wasmURL: "/ffmpeg/ffmpeg-core.wasm",
      });
    }
    return ffmpeg;
  },
};
