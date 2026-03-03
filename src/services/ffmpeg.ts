export const ffmpegService = {
  resolutionReduce: async (inputVideoPath: string) => {
    const outputPath = "./videos/output_480p.mp4";
    const command = [
      "ffmpeg",
      "-i",
      "./videos/input.webm",
      "-vf",
      "scale=-2:360",
      "-c:v",
      "libx264",
      "-crf",
      "23",
      "-c:a",
      "copy",
      outputPath,
    ];
    const process = Bun.spawn(command, {
      stderr: "pipe",
    });

    const stderr = await new Response(process.stderr).text();
    const exitCode = await process.exited;

    if (exitCode !== 0) {
      throw new Error(`FFmpeg failed: ${stderr}`);
    }

    return outputPath;
  },
};
